"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#efcb6d]/20 bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-4 lg:px-10">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="MAVN Creative" className="h-10 w-auto rounded-md object-contain" />
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-white">MAVN Creative</p>
              <p className="text-xs tracking-[0.28em] text-[#efcb6d]">REAL ESTATE MEDIA</p>
            </div>
          </a>
        </div>
      </header>

      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center lg:px-10">
        {/* Checkmark */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#efcb6d]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="mt-8 text-3xl font-semibold text-white sm:text-4xl">
          Booking confirmed!
        </h1>
        <p className="mt-4 max-w-lg leading-7 text-white/70">
          Your payment was successful and your shoot is officially booked with MAVN Creative.
          We'll be in touch within 24 hours to confirm the details, coordinate access, and
          lock in your shoot day.
        </p>

        <div className="mt-10 w-full space-y-4 text-left">
          <div className="rounded-[24px] border border-[#efcb6d]/20 bg-[#1a1a1a] p-6">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#efcb6d]">
              What happens next
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/80">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#efcb6d] text-[10px] font-bold text-black">1</span>
                We'll email you a confirmation with your booking reference
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#efcb6d] text-[10px] font-bold text-black">2</span>
                Our team will reach out to confirm shoot time, access, and any property details
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#efcb6d] text-[10px] font-bold text-black">3</span>
                We show up, capture everything, and deliver polished media within 48 hours
              </li>
            </ul>
          </div>

          <div className="rounded-[24px] border border-[#efcb6d]/20 bg-[#1a1a1a] p-6">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#efcb6d]">
              Questions?
            </p>
            <div className="mt-3 space-y-1">
              <a href="mailto:contact@mavncreative.com" className="block text-sm text-white transition hover:text-[#efcb6d]">
                contact@mavncreative.com
              </a>
              <a href="tel:6124883825" className="block text-sm text-white/70 transition hover:text-[#efcb6d]">
                (612) 488-3825
              </a>
            </div>
          </div>
        </div>

        <a
          href="/"
          className="btn-press mt-10 rounded-2xl bg-[#efcb6d] px-8 py-3.5 text-sm font-semibold text-black"
        >
          Back to MAVN Creative
        </a>

        {sessionId && (
          <p className="mt-6 text-xs text-white/25">
            Reference: {sessionId}
          </p>
        )}
      </div>
    </div>
  );
}
