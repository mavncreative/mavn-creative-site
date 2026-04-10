import Stripe from "stripe";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Lazy-init so module load doesn't throw during build without env vars
function getStripe() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (Stripe as any)(process.env.STRIPE_SECRET_KEY!);
}
function getResend() { return new Resend(process.env.RESEND_API_KEY!); }

const PACKAGE_LABELS: Record<string, string> = {
  essential: "Essential — $249",
  signature: "Signature — $549",
  elite: "Elite — $999",
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};

    const packageLabel = PACKAGE_LABELS[meta.packageId] ?? meta.packageId ?? "Unknown";
    const amount = session.amount_total
      ? `$${(session.amount_total / 100).toFixed(2)}`
      : "N/A";
    const customerEmail = session.customer_email ?? meta.email ?? "Not provided";

    try {
      const resend = getResend();
      await resend.emails.send({
        from: "MAVN Creative Bookings <onboarding@resend.dev>",
        to: ["contact@mavncreative.com"],
        subject: `🎬 New Booking — ${packageLabel} | ${meta.customerName ?? customerEmail}`,
        html: buildEmailHtml({
          packageLabel,
          amount,
          customerName: meta.customerName,
          customerEmail,
          phone: meta.phone,
          propertyAddress: meta.propertyAddress,
          shootDate: meta.shootDate,
          notes: meta.notes,
          sessionId: session.id,
        }),
      });
      console.log("Booking email sent for session:", session.id);
    } catch (emailErr: unknown) {
      const msg = emailErr instanceof Error ? emailErr.message : "Email send failed";
      console.error("Email send error:", msg);
      // Don't return error — Stripe still needs a 200
    }
  }

  return NextResponse.json({ received: true });
}

// ── Email template ───────────────────────────────────────────────────────────
function buildEmailHtml(data: {
  packageLabel: string;
  amount: string;
  customerName?: string;
  customerEmail: string;
  phone?: string;
  propertyAddress?: string;
  shootDate?: string;
  notes?: string;
  sessionId: string;
}) {
  const row = (label: string, value?: string) =>
    value
      ? `<tr>
          <td style="padding:10px 0;color:#888;font-size:13px;width:160px;vertical-align:top">${label}</td>
          <td style="padding:10px 0;color:#fff;font-size:14px;vertical-align:top">${value}</td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header -->
        <tr>
          <td style="background:#000;border-radius:16px 16px 0 0;padding:28px 32px;border-bottom:1px solid rgba(244,207,54,0.2)">
            <p style="margin:0;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#f4cf36">MAVN Creative</p>
            <h1 style="margin:6px 0 0;font-size:22px;font-weight:600;color:#fff">New Booking Received</h1>
          </td>
        </tr>

        <!-- Badge -->
        <tr>
          <td style="background:#0f0c08;padding:20px 32px;border-bottom:1px solid rgba(244,207,54,0.12)">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#f4cf36;border-radius:20px;padding:6px 16px;font-size:12px;font-weight:700;color:#000;letter-spacing:0.08em">
                  ✓ PAYMENT CONFIRMED
                </td>
                <td style="padding-left:12px;font-size:20px;font-weight:700;color:#fff">${data.amount}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Details -->
        <tr>
          <td style="background:#0f0c08;padding:8px 32px 24px;border-radius:0 0 16px 16px">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.06);margin-top:16px">
              ${row("Package", data.packageLabel)}
              ${row("Customer", data.customerName)}
              ${row("Email", `<a href="mailto:${data.customerEmail}" style="color:#f4cf36">${data.customerEmail}</a>`)}
              ${row("Phone", data.phone ? `<a href="tel:${data.phone}" style="color:#f4cf36">${data.phone}</a>` : undefined)}
              ${row("Property", data.propertyAddress)}
              ${row("Shoot Date", data.shootDate)}
              ${data.notes ? row("Notes", `<span style="white-space:pre-wrap">${data.notes}</span>`) : ""}
            </table>

            <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06)">
              <p style="margin:0;font-size:12px;color:#555">Stripe session: <span style="color:#777;font-family:monospace">${data.sessionId}</span></p>
              <p style="margin:6px 0 0;font-size:12px;color:#555">View in Stripe → <a href="https://dashboard.stripe.com/payments" style="color:#f4cf36">dashboard.stripe.com</a></p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 0 0;text-align:center">
            <p style="margin:0;font-size:11px;color:#444">MAVN Creative · contact@mavncreative.com · (612) 488-3825</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
