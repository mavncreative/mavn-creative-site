"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const PACKAGES = {
  essential: {
    name: "Essential",
    price: "$249",
    subtitle: "Perfect for standard listings.",
    features: [
      "Cinematic listing video (up to 90 sec)",
      "Interior & exterior walk-through",
      "Professional color grading",
      "Licensed background music",
      "Standard 48-hour turnaround",
      "1 round of revisions included",
    ],
  },
  signature: {
    name: "Signature",
    price: "$549",
    subtitle: "Our most popular package.",
    featured: true,
    features: [
      "Cinematic listing video (up to 2 min)",
      "FAA-certified drone aerial footage",
      "Twilight / golden hour exterior shot",
      "Professional photography (20+ photos)",
      "Professional color + LUT grading",
      "Licensed music + sound design",
      "Standard 48-hour turnaround",
      "2 rounds of revisions included",
    ],
  },
  elite: {
    name: "Elite",
    price: "$999",
    subtitle: "For luxury & premium listings.",
    features: [
      "Extended cinematic video (3–4 min)",
      "Full drone package — multiple angles",
      "Twilight & golden hour sessions",
      "Agent intro / promo video clip",
      "Professional photography (35+ photos)",
      "Standard 48-hour turnaround",
      "Unlimited revisions",
      "Dedicated project manager",
    ],
  },
} as const;

type PackageId = keyof typeof PACKAGES;

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = (searchParams.get("package") ?? "essential") as PackageId;
  const pkg = PACKAGES[packageId] ?? PACKAGES.essential;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    propertyAddress: "",
    shootDate: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Name and email are required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId, ...form }),
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
          <a href="/#packages" className="text-sm text-white/60 transition hover:text-white">
            ← Back to packages
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.28em] text-[#efcb6d]">Checkout</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Book your shoot
          </h1>
          <p className="mt-3 text-white/60">
            Fill in your details below — you'll be taken to our secure payment page to complete booking.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <form onSubmit={handleSubmit} className="rounded-[32px] border border-[#efcb6d]/20 bg-[#1a1a1a] p-6 lg:p-8">
            <h2 className="mb-6 text-lg font-semibold text-white">Your details</h2>
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
                  Email Address <span className="text-[#efcb6d]">*</span>
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
                <label className="mb-2 block text-sm font-medium text-white">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="(555) 555-5555"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Preferred Shoot Date</label>
                <input
                  type="date"
                  value={form.shootDate}
                  onChange={(e) => update("shootDate", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white">Property Address</label>
                <input
                  type="text"
                  value={form.propertyAddress}
                  onChange={(e) => update("propertyAddress", e.target.value)}
                  placeholder="123 Main Street, City, State"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white">Project Notes</label>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Any details about the property, access, timeline, or special requests..."
                  className={inputClass}
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-xs leading-5 text-white/40">
                You'll be redirected to Stripe's secure payment page. Your card details are never stored by us.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="btn-press flex-shrink-0 rounded-2xl bg-[#efcb6d] px-8 py-3.5 text-sm font-semibold text-black disabled:opacity-60"
              >
                {loading ? "Redirecting…" : "Proceed to Payment →"}
              </button>
            </div>
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
              {"featured" in pkg && pkg.featured && (
                <div className="mb-4 inline-flex rounded-full border border-[#efcb6d]/30 bg-[#efcb6d] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-black">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-semibold text-white">{pkg.name}</h3>
              <p className="mt-1 text-sm text-white/60">{pkg.subtitle}</p>
              <div className="my-5 border-y border-[#efcb6d]/15 py-5">
                <p className="text-5xl font-semibold tracking-tight text-white">{pkg.price}</p>
                <p className="mt-1 text-sm text-white/50">per property</p>
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
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">
                Questions?
              </p>
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

            <div className="rounded-[24px] border border-[#efcb6d]/20 bg-[#1a1a1a] p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">
                Secure payment
              </p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Payments are processed by Stripe — PCI compliant and encrypted end-to-end.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
