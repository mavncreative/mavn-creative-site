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
  "content-creator": {
    name: "Content Creator Program — MAVN Creative",
    price: 140000,
    description:
      "4 professionally produced reels · $350 per reel · 90-minute shooting session · Brand discovery + scripting included · Cancel any time",
  },
  "double-down": {
    name: "Double Down — MAVN Creative",
    price: 280000,
    description:
      "8 professionally produced reels · $350 per reel · Half-day shoot · Brand discovery + scripting included · Cancel any time",
  },
  "market-leader": {
    name: "Market Leader — MAVN Creative",
    price: 420000,
    description:
      "12 professionally produced reels · $350 per reel · Full shoot day · Brand discovery + scripting included · Priority turnaround · Cancel any time",
  },
};

// Health check — reports whether Stripe is configured (no secret exposed).
export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY;
  const keyType = !key
    ? "missing"
    : key.startsWith("sk_live") || key.startsWith("rk_live")
      ? "live"
      : key.startsWith("sk_test") || key.startsWith("rk_test")
        ? "test"
        : "unrecognized";
  return NextResponse.json({
    stripeConfigured: !!key,
    keyType,
    keyLength: key?.length ?? 0,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { tier, name, email, phone, brokerage, instagram, contentGoals, notes } =
      await req.json();

    const pkg = PACKAGES[tier as keyof typeof PACKAGES];
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
        tier,
        customerName: name,
        phone: phone ?? "",
        brokerage: brokerage ?? "",
        instagram: instagram ?? "",
        contentGoals: (contentGoals ?? "").slice(0, 500),
        notes: (notes ?? "").slice(0, 500),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const type = (err as any)?.type ?? (err as Error)?.name ?? "unknown";
    console.error("Stripe checkout error:", type, message);
    return NextResponse.json({ error: message, type }, { status: 500 });
  }
}
