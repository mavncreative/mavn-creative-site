import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Lazy-init so module load doesn't throw during build without env vars
function getStripe() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (Stripe as any)(process.env.STRIPE_SECRET_KEY!, {
    maxNetworkRetries: 1,
  });
}

const PACKAGES = {
  essential: {
    name: "Essential Package — MAVN Creative",
    price: 24900,
    description:
      "Cinematic listing video (up to 90 sec) · Interior & exterior walk-through · Professional color grading · Licensed music · 48-hr turnaround · 1 revision",
  },
  signature: {
    name: "Signature Package — MAVN Creative",
    price: 54900,
    description:
      "Cinematic listing video (up to 2 min) · FAA drone footage · Twilight shot · 20+ HDR photos · Professional color + LUT grading · 48-hr turnaround · 2 revisions",
  },
  elite: {
    name: "Elite Package — MAVN Creative",
    price: 99900,
    description:
      "Extended cinematic video (3–4 min) · Full drone package · Twilight & golden hour · Agent intro clip · 35+ HDR photos · Unlimited revisions · Dedicated PM",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { packageId, name, email, phone, propertyAddress, shootDate, notes } =
      await req.json();

    const pkg = PACKAGES[packageId as keyof typeof PACKAGES];
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    const host = req.headers.get("host") ?? "mavncreative.com";
    const proto = host.includes("localhost") ? "http" : "https";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `${proto}://${host}`;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: pkg.name,
              description: pkg.description,
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#packages`,
      metadata: {
        packageId,
        customerName: name,
        phone: phone ?? "",
        propertyAddress: propertyAddress ?? "",
        shootDate: shootDate ?? "",
        notes: (notes ?? "").slice(0, 500),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
