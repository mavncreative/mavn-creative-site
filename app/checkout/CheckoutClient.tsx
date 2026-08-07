"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const PACKAGES = {
  "content-creator": {
    name: "Content Creator",
    price: "$1,400",
    reels: "4 reels",
    save: "Save $596 vs à la carte",
    features: [
      "$350 per reel",
      "90-minute shooting session",
      "Brand discovery + scripting included",
      "Leverage yourself",
      "Cancel any time",
    ],
  },
  "double-down": {
    name: "Double Down",
    price: "$2,800",
    reels: "8 reels",
    save: "Save $1,192 vs à la carte",
    featured: true,
    badge: "Best Value",
    features: [
      "$350 per reel",
      "Half-day shoot day",
      "Brand discovery + scripting included",
      "Double the content",
      "Maximum momentum",
      "Cancel any time",
    ],
  },
  "market-leader": {
    name: "Market Leader",
    price: "$4,200",
    reels: "12 reels",
    save: "Save $1,788 vs à la carte",
    features: [
      "$350 per reel",
      "Full shoot day",
      "Brand discovery + scripting included",
      "Own your market",
      "Priority turnaround",
      "Cancel any time",
    ],
  },
} as const;

type TierId = keyof typeof PACKAGES;

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const tier = (searchParams.get("tier") ?? "content-creator") as TierId;
  const pkg = PACKAGES[tier] ?? PACKAGES["content-creator"];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    brokerage: "",
    instagram: "",
    contentGoals: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Full name is required.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return setError("Enter a valid email.");
    if (!form.phone.trim()) return setError("Phone is required.");
    setError("");
    setLoading(true);
    try {
      // Capture the lead first (email + GHL) so we have it even if payment is abandoned.
      const [first, ...rest] = form.name.trim().split(" ");
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: first,
          lastName: rest.join(" "),
          email: form.email,
          phone: form.phone,
          brokerage: form.brokerage,
          lookingFor: `${pkg.name} (${pkg.reels})`,
          instagram: form.instagram,
          notes: form.contentGoals || form.notes
            ? `Goals: ${form.contentGoals} | Notes: ${form.notes}`
            : "",
          source: `checkout-${tier}`,
        }),
      }).catch(() => {});

      // Create the Stripe checkout session and redirect.
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, ...form }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Something went wrong.");
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-[#efcb6d]/15 bg-[#151515] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#efcb6d]/50";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#efcb6d]/20 bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="MAVN Creative" className="h-10 w-auto rounded-md object-contain" />
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-white">MAVN Creative</p>
              <p className="text-xs tracking-[0.28em] text-[#efcb6d]">REAL ESTATE MEDIA</p>
            </div>
          </a>
          <a href="/" className="text-sm text-white/60 transition hover:text-white">
            ← Back to packages
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.28em] text-[#efcb6d]">Checkout</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            A few quick details before checkout.
          </h1>
          <p className="mt-3 max-w-2xl text-white/60">
            We&apos;ll use this to prepare your strategy call. You&apos;ll be redirected to
            secure payment after submitting.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <form onSubmit={handleSubmit} className="rounded-[32px] border border-[#efcb6d]/20 bg-[#1a1a1a] p-6 lg:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Full Name <span className="text-[#efcb6d]">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Email <span className="text-[#efcb6d]">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Phone <span className="text-[#efcb6d]">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="(555) 555-5555"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Brokerage / Company</label>
                <input
                  type="text"
                  value={form.brokerage}
                  onChange={(e) => update("brokerage", e.target.value)}
                  placeholder="Your brokerage"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white">Instagram Handle</label>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => update("instagram", e.target.value)}
                  placeholder="@yourhandle"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white">Content Goals</label>
                <textarea
                  rows={3}
                  value={form.contentGoals}
                  onChange={(e) => update("contentGoals", e.target.value)}
                  placeholder="What do you want your content to accomplish?"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white">
                  Anything else you&apos;d like us to know?
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Optional"
                  className={inputClass}
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-press mt-6 flex w-full items-center justify-center rounded-2xl bg-[#efcb6d] px-8 py-4 text-sm font-semibold text-black disabled:opacity-60"
            >
              {loading ? "Redirecting…" : "Continue to Payment →"}
            </button>
            <p className="mt-3 text-center text-xs text-white/45">
              Secure checkout powered by Stripe. Cancel anytime.
            </p>
          </form>

          {/* Package summary */}
          <div className="space-y-4">
            <div
              className={`rounded-[28px] border p-6 ${
                "featured" in pkg && pkg.featured
                  ? "border-[#efcb6d]/45 bg-[#1f1f1f]"
                  : "border-[#efcb6d]/20 bg-[#1a1a1a]"
              }`}
            >
              {"badge" in pkg && pkg.badge && (
                <div className="mb-4 inline-flex rounded-full bg-[#efcb6d] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-black">
                  {pkg.badge}
                </div>
              )}
              <h3 className="text-2xl font-semibold text-white">{pkg.name}</h3>
              <div className="my-5 border-y border-[#efcb6d]/15 py-5">
                <p className="text-5xl font-semibold tracking-tight text-white">{pkg.price}</p>
                <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/55">{pkg.reels}</p>
                <p className="mt-2 text-xs font-medium text-[#efcb6d]">{pkg.save}</p>
              </div>
              <ul className="space-y-2.5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/80">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#efcb6d] text-[10px] font-bold text-black">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[24px] border border-[#efcb6d]/20 bg-[#1a1a1a] p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">Questions?</p>
              <a
                href="mailto:contact@mavncreative.com"
                className="mt-2 block text-sm font-medium text-white transition hover:text-[#efcb6d]"
              >
                contact@mavncreative.com
              </a>
              <a
                href="tel:6124883825"
                className="mt-1 block text-sm text-white/70 transition hover:text-[#efcb6d]"
              >
                (612) 488-3825
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
