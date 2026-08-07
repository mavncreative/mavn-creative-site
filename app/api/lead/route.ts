import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

// ── GoHighLevel: create/update the contact via the v2 API (no premium webhook) ──
// Uses the upsert endpoint so a returning lead updates instead of erroring, and
// applies a "website-lead" tag you can trigger a standard (free) workflow on.
// Requires: GHL_API_TOKEN (Private Integration token) + GHL_LOCATION_ID.
// Optional custom-field mapping: GHL_BROKERAGE_FIELD_ID, GHL_LOOKINGFOR_FIELD_ID.
async function upsertGhlContact(payload: {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  brokerage: string;
  looking_for: string;
  source: string;
}) {
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) return { created: false as const, skipped: true as const };

  const customFields: Array<{ id: string; value: string }> = [];
  if (process.env.GHL_BROKERAGE_FIELD_ID && payload.brokerage) {
    customFields.push({ id: process.env.GHL_BROKERAGE_FIELD_ID, value: payload.brokerage });
  }
  if (process.env.GHL_LOOKINGFOR_FIELD_ID && payload.looking_for) {
    customFields.push({ id: process.env.GHL_LOOKINGFOR_FIELD_ID, value: payload.looking_for });
  }

  // Tag the lead for the workflow trigger; also tag what they want for segmentation.
  const tags = ["website-lead"];
  if (payload.looking_for) tags.push(payload.looking_for);

  const body = {
    firstName: payload.first_name,
    lastName: payload.last_name,
    email: payload.email,
    phone: payload.phone,
    locationId,
    source: payload.source || "website",
    tags,
    ...(customFields.length ? { customFields } : {}),
  };

  try {
    const res = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("GHL upsert failed", res.status, text);
      return { created: false as const, error: `${res.status} ${text.slice(0, 200)}` };
    }
    return { created: true as const };
  } catch (err) {
    console.error("GHL upsert error", err);
    return { created: false as const, error: (err as Error).message };
  }
}

// Health check — reports which delivery channels are configured (no secrets).
export async function GET() {
  return NextResponse.json({
    resendConfigured: !!process.env.RESEND_API_KEY,
    ghlConfigured: !!(process.env.GHL_API_TOKEN && process.env.GHL_LOCATION_ID),
    ghlBrokerageFieldMapped: !!process.env.GHL_BROKERAGE_FIELD_ID,
    ghlLookingForFieldMapped: !!process.env.GHL_LOOKINGFOR_FIELD_ID,
    leadInbox: process.env.LEAD_INBOX || "contact@mavncreative.com",
    from: process.env.LEAD_FROM || "MAVN Creative <onboarding@resend.dev>",
  });
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
      instagram,
      notes,
      source,
    } = await req.json();

    if (!firstName || !email || !phone) {
      return NextResponse.json(
        { error: "First name, email, and phone are required." },
        { status: 400 }
      );
    }

    // 1) Create/update the contact in GoHighLevel (tags trigger the workflow).
    const ghl = await upsertGhlContact({
      first_name: firstName,
      last_name: lastName ?? "",
      phone,
      email,
      brokerage: brokerage ?? "",
      looking_for: lookingFor ?? "",
      source: source ?? "website",
    });

    // 2) Also email an internal notification via Resend (backup + human-readable).
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.LEAD_INBOX || "contact@mavncreative.com";
    const from = process.env.LEAD_FROM || "MAVN Creative <onboarding@resend.dev>";

    let emailed = false;
    let emailError: string | undefined;

    if (apiKey) {
      const resend = new Resend(apiKey);
      const html = `
        <h2>New MAVN Creative lead</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName ?? ""}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Brokerage:</strong> ${brokerage ?? "—"}</p>
        <p><strong>Looking for:</strong> ${lookingFor ?? "—"}</p>
        ${instagram ? `<p><strong>Instagram:</strong> ${instagram}</p>` : ""}
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
        <p><strong>Added to GHL:</strong> ${ghl.created ? "yes" : "no"}</p>
      `;
      const { data, error } = await resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: `New lead — ${firstName} ${lastName ?? ""} (${lookingFor ?? "unspecified"})`,
        html,
      });
      if (error) {
        emailError = error.message;
        console.error("Resend send failed", error);
      } else {
        emailed = !!data?.id;
      }
    } else if (!ghl.created) {
      console.warn("Lead received but not delivered anywhere", {
        firstName, lastName, phone, email, brokerage, lookingFor,
      });
    }

    return NextResponse.json({
      ok: true,
      ghl: ghl.created,
      ghlError: "error" in ghl ? ghl.error : undefined,
      emailed,
      emailError,
      resendConfigured: !!apiKey,
    });
  } catch (err) {
    console.error("lead route error", err);
    return NextResponse.json({ error: "Failed to submit lead." }, { status: 500 });
  }
}
