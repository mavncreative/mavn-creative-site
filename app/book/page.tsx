"use client";

import { useState } from "react";

export default function BookLandingPage() {
  const [leadData, setLeadData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    brokerage: "",
    lookingFor: "Listing Photography",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...leadData, source: "book-page" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background video */}
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="ken-burns absolute inset-0 h-full w-full object-cover"
          style={{ filter: "brightness(0.30) saturate(1.1)" }}
        >
          <source
            src="https://fn9qpleiatjb4gdq.public.blob.vercel-storage.com/Rosemount%20v2.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_40%,transparent_20%,rgba(0,0,0,0.85)_100%)]" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-12 sm:py-16">
        {/* Brand */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <img src="/logo.png" alt="MAVN Creative" className="h-11 w-auto object-contain" />
          <div className="text-left leading-tight">
            <p className="text-sm font-semibold tracking-[0.16em] text-white">MAVN Creative</p>
            <p className="text-[10px] tracking-[0.24em] text-[#efcb6d]">REAL ESTATE MEDIA</p>
          </div>
        </div>

        {status === "success" ? (
          <div className="rounded-[28px] border border-[#efcb6d]/25 bg-black/55 p-8 text-center shadow-2xl shadow-black/50 backdrop-blur-md">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#efcb6d] text-3xl text-black">
              ✓
            </div>
            <h1 className="text-2xl font-semibold text-white">You're in, {leadData.firstName}.</h1>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Thanks for reaching out. Adam will be in touch within the hour to
              talk through your project and put something together for you.
            </p>
            <a
              href="https://instagram.com/mavn.creative"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press mt-7 inline-block rounded-2xl border border-[#efcb6d]/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white"
            >
              See our work → @mavn.creative
            </a>
          </div>
        ) : (
          <>
            {/* Headline */}
            <div className="mb-7 text-center">
              <h1 className="text-3xl font-semibold leading-[1.08] text-white sm:text-4xl">
                Listings that <span className="text-[#efcb6d]">stop the scroll.</span>
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/75 sm:text-base">
                MAVN Creative produces cinematic real estate video and
                photography for Twin Cities agents who want their listings to
                stand out.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/60">
                Whether you have a listing going live this week or you're
                building a consistent presence on Instagram, we create visuals
                that make buyers stop, watch, and reach out. First-time
                discount for new clients — fill out the form and we'll be in
                touch within the hour.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={submitLead}
              className="grid gap-3 rounded-[28px] border border-[#efcb6d]/25 bg-black/55 p-5 shadow-2xl shadow-black/50 backdrop-blur-md sm:grid-cols-2 sm:p-7"
            >
              <input
                required
                type="text"
                placeholder="First name"
                value={leadData.firstName}
                onChange={(e) => setLeadData({ ...leadData, firstName: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#efcb6d]/60"
              />
              <input
                type="text"
                placeholder="Last name"
                value={leadData.lastName}
                onChange={(e) => setLeadData({ ...leadData, lastName: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#efcb6d]/60"
              />
              <input
                required
                type="tel"
                placeholder="Phone number"
                value={leadData.phone}
                onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#efcb6d]/60"
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={leadData.email}
                onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#efcb6d]/60"
              />
              <input
                type="text"
                placeholder="Brokerage"
                value={leadData.brokerage}
                onChange={(e) => setLeadData({ ...leadData, brokerage: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#efcb6d]/60 sm:col-span-2"
              />
              <select
                value={leadData.lookingFor}
                onChange={(e) => setLeadData({ ...leadData, lookingFor: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#efcb6d]/60 sm:col-span-2"
              >
                <option>Listing Photography</option>
                <option>Listing Video / Reel</option>
                <option>Agent Branding Video</option>
                <option>Monthly Content Retainer</option>
                <option>Not Sure Yet</option>
              </select>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-press mt-1 w-full rounded-2xl bg-[#efcb6d] px-6 py-3.5 text-sm font-semibold text-black disabled:opacity-60 sm:col-span-2"
              >
                {status === "submitting" ? "Sending…" : "Get In Touch"}
              </button>

              {status === "error" && (
                <p className="text-xs text-red-400 sm:col-span-2">{error}</p>
              )}
            </form>

            {/* Below the form */}
            <p className="mt-6 text-center text-sm text-white/55">
              Check out our work:{" "}
              <a
                href="https://instagram.com/mavn.creative"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#efcb6d] hover:underline"
              >
                instagram.com/mavn.creative
              </a>
            </p>
          </>
        )}

        {/* Footer */}
        <p className="mt-10 text-center text-[11px] tracking-wide text-white/35">
          MAVN Creative · mavncreative.com · (612) 488-3825
        </p>
      </main>
    </div>
  );
}
