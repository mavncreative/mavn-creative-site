import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

// Forward the lead to a GoHighLevel Workflow "Inbound Webhook" trigger.
// Set GHL_WEBHOOK_URL to the trigger URL; the workflow then creates the
// contact and fires the SMS + email sequences from the playbook. Field keys
// below are what you map inside the GHL workflow builder.
async function forwardToGHL(payload: {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  brokerage: string;
  looking_for: string;
  source: string;
}) {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return { forwarded: false };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("GHL webhook failed", res.status, text);
    return { forwarded: false };
  }
  return { forwarded: true };
}

export async function POST(req: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      brokerage,
      lookingFor,
      source,
    } = await req.json();

    if (!firstName || !email || !phone) {
      return NextResponse.json(
        { error: "First name, email, and phone are required." },
        { status: 400 }
      );
    }

    // 1) Push into GoHighLevel (creates contact + triggers automations).
    const { forwarded } = await forwardToGHL({
      first_name: firstName,
      last_name: lastName ?? "",
      phone,
      email,
      brokerage: brokerage ?? "",
      looking_for: lookingFor ?? "",
      source: source ?? "website",
    });

    // 2) Also email an internal notification via Resend (optional backup).
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.LEAD_INBOX || "contact@mavncreative.com";
    const from = process.env.LEAD_FROM || "MAVN Creative <leads@mavncreative.com>";

    if (apiKey) {
      const resend = new Resend(apiKey);
      const html = `
        <h2>New MAVN Creative lead</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName ?? ""}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Brokerage:</strong> ${brokerage ?? "—"}</p>
        <p><strong>Looking for:</strong> ${lookingFor ?? "—"}</p>
        <p><strong>Pushed to GHL:</strong> ${forwarded ? "yes" : "no"}</p>
      `;
      await resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: `New lead — ${firstName} ${lastName ?? ""} (${lookingFor ?? "unspecified"})`,
        html,
      });
    } else if (!forwarded) {
      // No GHL webhook and no email key — at least log it so nothing is lost.
      console.warn("Lead received but not delivered anywhere", {
        firstName, lastName, phone, email, brokerage, lookingFor,
      });
    }

    return NextResponse.json({ ok: true, ghl: forwarded });
  } catch (err) {
    console.error("lead route error", err);
    return NextResponse.json({ error: "Failed to submit lead." }, { status: 500 });
  }
}
