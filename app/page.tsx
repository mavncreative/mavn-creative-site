"use client";

import { useState, useEffect, useRef } from "react";

// ── Animated section background orbs ─────────────────────────────────────────
function AnimatedBg({
  orbs,
}: {
  orbs: Array<{
    color: string;
    size: string;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    anim: "orb-a" | "orb-b" | "orb-c";
    delay?: string;
  }>;
}) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}
    >
      {orbs.map((o, i) => (
        <div
          key={i}
          className={`orb ${o.anim}`}
          style={{
            background: o.color,
            width: o.size,
            height: o.size,
            top: o.top,
            bottom: o.bottom,
            left: o.left,
            right: o.right,
            animationDelay: o.delay ?? "0s",
          }}
        />
      ))}
    </div>
  );
}

// ── Seamless work reel — autoplays on scroll into view, loops, no chrome ──────
function WorkReel({
  src,
  title,
  type,
}: {
  src: string;
  title: string;
  type: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const retriesRef = useRef(0);
  const [errored, setErrored] = useState(false);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);

  // A single dropped chunk shouldn't kill the tile — retry the load a couple
  // times before falling back to the "open video" link.
  const handleError = () => {
    const el = videoRef.current;
    if (el && retriesRef.current < 2) {
      retriesRef.current += 1;
      setTimeout(() => el.load(), 400 * retriesRef.current);
    } else {
      setErrored(true);
    }
  };

  // Play only while visible — keeps things smooth and light on the browser.
  // Low threshold + rootMargin so tall 9:16 tiles start as they scroll in
  // (a tile can be taller than the viewport and never hit a high threshold).
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1, rootMargin: "100px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    el.play().catch(() => {});
  };

  if (errored) {
    return (
      <div className="video-fallback flex aspect-[9/16] flex-col items-center justify-center gap-2 rounded-2xl">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#efcb6d", textDecoration: "underline", fontSize: 13 }}
        >
          Open video ↗
        </a>
        <span style={{ fontSize: 11, opacity: 0.4 }}>Format not supported</span>
      </div>
    );
  }

  return (
    <div className="reel-tile group relative aspect-[9/16] overflow-hidden rounded-2xl bg-[#0d0d0d] ring-1 ring-white/5 transition-all duration-500 hover:ring-[#efcb6d]/30">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setReady(true)}
        onError={handleError}
        className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03] ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* bottom gradient — always subtle, deepens on hover */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

      {/* title + type — always on mobile, hover-reveal on desktop */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 opacity-100 transition-all duration-300 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
        <p className="text-[9px] uppercase tracking-[0.22em] text-[#efcb6d]">{type}</p>
        <p className="mt-0.5 text-sm font-medium leading-tight text-white">{title}</p>
      </div>

      {/* unmute toggle */}
      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/70 focus:opacity-100 group-hover:opacity-100"
      >
        {muted ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        )}
      </button>
    </div>
  );
}

type TabId = "branding" | "work" | "packages" | "book";

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MavnCreativeSite() {
  const [activeTab, setActiveTab] = useState<TabId>("branding");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Lead form → posts to /api/lead (GoHighLevel webhook + Resend backup)
  const [leadData, setLeadData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    brokerage: "",
    lookingFor: "Monthly Content Package",
  });
  const [leadStatus, setLeadStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [leadError, setLeadError] = useState("");

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadStatus("submitting");
    setLeadError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...leadData, source: "homepage-book-tab" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setLeadStatus("success");
    } catch (err) {
      setLeadStatus("error");
      setLeadError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToTab = (tab: TabId) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const logoSrc = "/logo.png";

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "branding", label: "Branding" },
    { id: "work", label: "Our Work" },
    { id: "packages", label: "Packages" },
    { id: "book", label: "Book With Us" },
  ];

  const proofStats = [
    { label: "Listings elevated", value: "50+" },
    { label: "Content built for", value: "Reels + MLS" },
    { label: "Turnaround", value: "Fast & reliable" },
  ];

  const portfolioItems = [
    {
      title: "509 Arlington Ave E",
      type: "Listing Video",
      description:
        "A cinematic listing reel showcasing the property with clean movement and strong visual presentation.",
      videoSrc: "/videos/509-arlington-ave-e.mp4",
    },
    {
      title: "913 E 39th Street",
      type: "Listing Video",
      description:
        "A cinematic listing reel capturing the property with smooth movement and a strong sense of place.",
      videoSrc: "/videos/913-e-39th-st.mp4",
    },
    {
      title: "1690 Margaret Street",
      type: "Listing Video",
      description:
        "A polished property showcase built to highlight the home and stop the scroll on social.",
      videoSrc: "/videos/1690-margaret-st.mp4",
    },
    {
      title: "Rosemount",
      type: "Branding Video",
      description:
        "A personal brand focused reel designed to elevate agent presence and build trust online.",
      videoSrc:
        "https://fn9qpleiatjb4gdq.public.blob.vercel-storage.com/Rosemount%20v2.mp4",
    },
    {
      title: "4390 Normandy Place",
      type: "Listing Video",
      description:
        "A cinematic real estate showcase created for social media marketing and listing visibility.",
      videoSrc:
        "https://fn9qpleiatjb4gdq.public.blob.vercel-storage.com/4390_Normandy_%20Place_V5.mp4",
    },
    {
      title: "869 Lawson Avenue",
      type: "Listing Video",
      description:
        "A cinematic property showcase built to create attention, highlight the home, and elevate the listing online.",
      videoSrc:
        "https://fn9qpleiatjb4gdq.public.blob.vercel-storage.com/869%20Lawson%20Ave%20Raw%20Footage%20V2.mp4",
    },
    {
      title: "Abbott Drive N",
      type: "Listing Video",
      description:
        "A polished real estate reel created to showcase the property with cinematic movement and strong visual presentation.",
      videoSrc:
        "https://fn9qpleiatjb4gdq.public.blob.vercel-storage.com/Abbott_Dr_N_Reel_V2.mp4",
    },
  ];

  // Monthly agent content packages (from MAVN content package pricing)
  const packages = [
    {
      tier: "Tier 1 · Creator",
      name: "Creator",
      tagline: "Build your presence",
      price: "$699",
      includes: [
        "4 strategic videos / month",
        "1 Social Lead Reel (vertical)",
        "Done-for-you scripting & creative direction",
        "Monthly strategy call",
        "Caption + hashtag strategy",
        "Up to 2 filming locations",
        "Vertical-first delivery (Reels, TikTok, Shorts)",
        "10% off all listing content",
      ],
      note: "Perfect for agents starting out",
    },
    {
      tier: "Tier 2 · Signature",
      name: "Signature",
      tagline: "Build momentum & authority",
      price: "$1,149",
      includes: [
        "5 strategic videos / month",
        "2 Social Lead Reels (vertical)",
        "FAA-certified drone footage included",
        "Done-for-you scripting & creative direction",
        "Monthly strategy call + content calendar",
        "Up to 3 filming locations",
        "Vertical-first delivery (Reels, TikTok, Shorts)",
        "15% off all listing content",
      ],
      note: "Most popular for growing agents",
      featured: true,
    },
    {
      tier: "Tier 3 · Elite",
      name: "Elite",
      tagline: "Dominate your market",
      price: "$1,499",
      includes: [
        "6 strategic videos / month",
        "3 Social Lead Reels (vertical)",
        "FAA-certified drone footage included",
        "Dedicated monthly campaign / CTA video",
        "Done-for-you scripting & creative direction",
        "Bi-weekly strategy calls",
        "Up to 3 filming locations",
        "15% off all listing content",
      ],
      note: "For agents ready to own their market",
    },
  ];

  // À la carte / one-time reel pricing (from Agent Branding Packages)
  const alaCarte = [
    {
      name: "Single Reel",
      subtitle: "One reel, one shoot day",
      price: "$499",
      unit: "/ reel",
      includes: [
        "1 professionally produced reel",
        "Done-for-you scripting & creative direction",
        "Brand discovery call",
        "Professional color grading",
        "Licensed music + sound design",
        "1 round of revisions",
        "Delivered within 48 hours",
      ],
    },
    {
      name: "Starter Pack",
      subtitle: "4 reels · one shoot day",
      price: "$999",
      unit: "one-time",
      badge: "Most Popular",
      save: "Save $997 vs à la carte",
      includes: [
        "4 professionally produced reels",
        "Done-for-you scripting & creative direction",
        "Brand discovery session",
        "~2 hr shoot day — all 4 reels in one session",
        "Delivered one per week over 4 weeks",
        "Color grading + licensed music & sound",
        "2 rounds of revisions",
      ],
      featured: true,
    },
    {
      name: "Growth Pack",
      subtitle: "8 reels · one shoot day",
      price: "$1,799",
      unit: "one-time",
      badge: "Best Value",
      save: "Save $2,193 vs à la carte",
      includes: [
        "8 professionally produced reels",
        "Done-for-you scripting & creative direction",
        "Brand discovery session",
        "Half-day shoot — all 8 reels in one session",
        "Delivered one per week over 8 weeks",
        "Color grading + licensed music & sound",
        "Unlimited revisions · priority turnaround",
      ],
    },
  ];

  const videoTypes = [
    {
      tag: "Authority",
      title: "Education Video",
      description:
        "Answers the questions buyers are Googling. Builds trust with cold audiences.",
    },
    {
      tag: "Trust",
      title: "Storytelling Video",
      description:
        "Your story, client journeys, behind the scenes. Makes people feel like they know you.",
    },
    {
      tag: "Reach",
      title: "Scroll-Stopper",
      description:
        "High-energy, trend-aware content built to spike reach and grow new audiences fast.",
    },
    {
      tag: "Local Authority",
      title: "Community Video",
      description:
        "Neighborhood tours, market updates, local lifestyle. Cements you as the local expert.",
    },
  ];

  const leadGenSteps = [
    {
      step: "01",
      title: "Awareness",
      audience: "Cold Audience",
      description: "New buyers find you through Reels, TikTok, or YouTube Shorts.",
    },
    {
      step: "02",
      title: "Interest",
      audience: "Warm Audience",
      description: "They follow, binge your content, and feel like they know you.",
    },
    {
      step: "03",
      title: "Trust",
      audience: "Hot Audience",
      description: "After consistent content, you're the expert they trust.",
    },
    {
      step: "04",
      title: "Lead",
      audience: "Consultation",
      description: "When ready to buy, you're the only agent they think to call.",
    },
  ];

  const inputClass =
    "w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#efcb6d]/60";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Header / Tab navigation ── */}
      <header
        className={`sticky top-0 z-50 border-b border-[#efcb6d]/20 bg-black transition-all duration-300 ${
          isScrolled ? "nav-glass" : ""
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-10">

          {/* Mobile row */}
          <div className="flex items-center justify-between py-4 md:hidden">
            <button onClick={() => goToTab("branding")} className="flex items-center gap-3">
              <img src={logoSrc} alt="MAVN Creative logo" className="h-9 w-auto object-contain" />
              <div className="text-left leading-tight">
                <p className="text-xs font-semibold tracking-[0.16em] text-white">MAVN Creative</p>
                <p className="text-[10px] tracking-[0.24em] text-[#efcb6d]">REAL ESTATE MEDIA</p>
              </div>
            </button>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle navigation"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white transition hover:border-[#efcb6d]/40"
            >
              {mobileNavOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              )}
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileNavOpen && (
            <div className="border-t border-white/10 pb-5 md:hidden">
              <nav className="flex flex-col">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => goToTab(t.id)}
                    className={`border-b border-white/8 py-3.5 text-left text-sm transition ${
                      activeTab === t.id ? "text-[#efcb6d]" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-3">
                <a href="tel:6124883825" className="text-sm text-white/55 transition hover:text-[#efcb6d]">
                  (612) 488-3825
                </a>
              </div>
            </div>
          )}

          {/* Desktop row */}
          <div className="hidden items-center justify-between py-5 md:flex">
            <button onClick={() => goToTab("branding")} className="flex items-center gap-4 text-sm text-white">
              <img src={logoSrc} alt="MAVN Creative logo" className="h-11 w-auto object-contain" />
              <div className="text-left">
                <p className="font-semibold tracking-[0.18em] text-white">MAVN Creative</p>
                <p className="tracking-[0.28em] text-[#efcb6d]">REAL ESTATE MEDIA</p>
              </div>
            </button>
            <nav className="flex items-center gap-8 text-sm">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => goToTab(t.id)}
                  className={`relative transition ${
                    activeTab === t.id ? "text-[#efcb6d]" : "text-white/75 hover:text-white"
                  }`}
                >
                  {t.label}
                  {activeTab === t.id && (
                    <span className="absolute -bottom-1.5 left-0 h-[1.5px] w-full bg-[#efcb6d]" />
                  )}
                </button>
              ))}
            </nav>
            <a href="tel:6124883825" className="text-sm text-white/70 transition hover:text-[#efcb6d]">
              (612) 488-3825
            </a>
          </div>

        </div>
      </header>

      {/* ── Tab panels ── */}
      <div key={activeTab} style={{ animation: "fade-up-hero 0.5s ease forwards" }}>

        {/* ═══ BRANDING ═══ */}
        {activeTab === "branding" && (
          <>
            {/* Hero */}
            <section className="relative flex min-h-[86vh] items-center overflow-hidden bg-black">
              <div className="absolute inset-0">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="ken-burns absolute inset-0 h-full w-full object-cover"
                  style={{ filter: "brightness(0.36) saturate(1.1)" }}
                >
                  <source
                    src="https://fn9qpleiatjb4gdq.public.blob.vercel-storage.com/Rosemount%20v2.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>

              {/* Overlays */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_30%,rgba(0,0,0,0.72)_100%)]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/55 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#efcb6d]/50 to-transparent" />

              <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-20 sm:px-6 lg:px-10 lg:pt-28">
                <div className="max-w-3xl">
                  <div className="hero-line mb-6 flex items-center gap-3" style={{ animationDelay: "0.1s" }}>
                    <span className="h-4 w-px bg-white/25" />
                    <p className="text-xs uppercase tracking-[0.36em] text-[#efcb6d]">
                      Twin Cities Real Estate Media
                    </p>
                  </div>

                  <h1 className="text-[2rem] font-semibold leading-[1.05] text-white sm:text-5xl lg:text-[4.5rem] lg:leading-[1.02]">
                    <span className="hero-line block" style={{ animationDelay: "0.22s" }}>
                      Listings that
                    </span>
                    <span className="hero-line block text-[#efcb6d]" style={{ animationDelay: "0.36s" }}>
                      stop the scroll.
                    </span>
                  </h1>

                  <p
                    className="hero-line mt-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base lg:text-lg"
                    style={{ animationDelay: "0.55s" }}
                  >
                    MAVN Creative produces cinematic real estate video and photography for
                    Twin Cities agents who want their listings — and their personal brand —
                    to stand out.
                  </p>

                  <div
                    className="hero-line mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
                    style={{ animationDelay: "0.7s" }}
                  >
                    <button
                      onClick={() => goToTab("book")}
                      className="btn-press rounded-2xl bg-[#efcb6d] px-7 py-3.5 text-sm font-semibold text-black"
                    >
                      Book With Us
                    </button>
                    <button
                      onClick={() => goToTab("work")}
                      className="btn-press rounded-2xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
                    >
                      View Our Work
                    </button>
                  </div>

                  <div
                    className="hero-line mt-12 flex flex-wrap gap-6 border-t border-white/10 pt-8 sm:gap-10"
                    style={{ animationDelay: "0.85s" }}
                  >
                    {proofStats.map((stat) => (
                      <div key={stat.label}>
                        <p className="text-2xl font-semibold text-white">{stat.value}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/50">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Brand statement */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-10 lg:py-24">
              <div className="grid gap-8 md:grid-cols-2 md:gap-14 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[#efcb6d]">The Brand</p>
                  <h2 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
                    Premium media for real estate professionals.
                  </h2>
                </div>
                <div className="space-y-5 leading-7 text-white/80">
                  <p>
                    We produce cinematic listing videos, agent branding reels, and
                    HDR photography for real estate professionals across the Twin Cities.
                    Clean execution. Strong visuals. Content that makes your brand and your
                    listings look the part.
                  </p>
                  <p className="text-white/65">
                    Whether you have a listing going live this week or you're building a
                    consistent presence on Instagram, we create visuals that make buyers
                    stop, watch, and reach out.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => goToTab("packages")}
                      className="btn-press rounded-2xl border border-[#efcb6d]/30 bg-[#efcb6d]/10 px-5 py-3 text-sm font-semibold text-white"
                    >
                      See Packages
                    </button>
                    <a
                      href="https://instagram.com/mavn.creative"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-press rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/80"
                    >
                      @mavn.creative
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ═══ OUR WORK ═══ */}
        {activeTab === "work" && (
          <section className="relative overflow-hidden bg-[#0a0a0a]">
            <AnimatedBg orbs={[
              { color: "rgba(239, 203, 109,0.15)", size: "550px", top: "0px", left: "-100px", anim: "orb-c", delay: "-5s" },
              { color: "rgba(220,160,40,0.12)", size: "400px", bottom: "50px", right: "-80px", anim: "orb-a", delay: "-9s" },
            ]} />
            <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-10 lg:py-24">
              <div className="mb-10 max-w-2xl">
                <p className="text-sm uppercase tracking-[0.28em] text-[#efcb6d]">Our Work</p>
                <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Recent work</h2>
                <p className="mt-4 leading-7 text-white/70">
                  Listing films, social reels, and brand videos that show the quality of
                  our work instantly.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {portfolioItems.map((item, i) => (
                  <div
                    key={item.title}
                    className="reel-in"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <WorkReel src={item.videoSrc} title={item.title} type={item.type} />
                  </div>
                ))}
              </div>

              <div className="mt-12 flex flex-col items-start gap-4 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-white/70">Like what you see? Let's build content for your brand.</p>
                <button
                  onClick={() => goToTab("book")}
                  className="btn-press rounded-2xl bg-[#efcb6d] px-6 py-3.5 text-sm font-semibold text-black"
                >
                  Book With Us
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ═══ PACKAGES ═══ */}
        {activeTab === "packages" && (
          <section className="relative overflow-hidden bg-[#0a0a0a]">
            <AnimatedBg orbs={[
              { color: "rgba(239, 203, 109,0.20)", size: "620px", top: "-140px", left: "-100px", anim: "orb-b", delay: "-1s" },
              { color: "rgba(200,130,20,0.14)", size: "500px", top: "30%", right: "-120px", anim: "orb-a", delay: "-5s" },
            ]} />
            <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-10 lg:py-24">
              <div className="mb-10 max-w-2xl">
                <p className="text-sm uppercase tracking-[0.28em] text-[#efcb6d]">Agent Content Packages</p>
                <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                  Done-for-you content that builds your brand.
                </h2>
                <p className="mt-4 leading-7 text-white/70">
                  Monthly social content that builds your brand and generates inbound leads —
                  scripted, shot, and delivered for you every month.
                </p>
              </div>

              {/* Tiers */}
              <div className="grid gap-5 lg:grid-cols-3">
                {packages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`card-lift flex flex-col rounded-[28px] border p-6 lg:p-7 ${
                      pkg.featured
                        ? "border-[#efcb6d]/45 bg-[#1f1f1f]"
                        : "border-[#efcb6d]/20 bg-[#1a1a1a]"
                    }`}
                  >
                    {pkg.featured && (
                      <div className="mb-4 inline-flex w-fit rounded-full bg-[#efcb6d] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-black">
                        Most Popular
                      </div>
                    )}
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#efcb6d]">{pkg.tier}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{pkg.name}</h3>
                    <p className="mt-1 text-sm text-white/65">{pkg.tagline}</p>
                    <div className="mt-5 border-y border-[#efcb6d]/15 py-5">
                      <p className="text-4xl font-semibold tracking-tight text-white lg:text-5xl">
                        {pkg.price}
                        <span className="ml-1 text-sm font-normal text-white/55">/ month</span>
                      </p>
                      <p className="mt-1 text-xs text-white/50">3–6 month commitment · billed monthly</p>
                    </div>
                    <div className="mt-6 flex-1 space-y-2.5">
                      {pkg.includes.map((item) => (
                        <div key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#efcb6d]" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 rounded-2xl bg-[#efcb6d]/10 px-4 py-3 text-center text-sm font-medium text-white/85">
                      {pkg.note}
                    </p>
                    <button
                      onClick={() => goToTab("book")}
                      className="btn-press mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#efcb6d] px-5 py-3.5 text-sm font-semibold text-black"
                    >
                      Get Started
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* À la carte / per-reel pricing */}
              <div className="mt-16">
                <p className="text-sm uppercase tracking-[0.28em] text-[#efcb6d]">À La Carte</p>
                <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                  Pay per reel — no commitment.
                </h3>
                <p className="mt-3 max-w-2xl leading-7 text-white/70">
                  Not ready for a monthly plan? Book reels one at a time, or bundle a
                  shoot day and save. Shoot once, publish every week.
                </p>

                <div className="mt-8 grid gap-5 lg:grid-cols-3">
                  {alaCarte.map((item) => (
                    <div
                      key={item.name}
                      className={`card-lift flex flex-col rounded-[28px] border p-6 lg:p-7 ${
                        item.featured
                          ? "border-[#efcb6d]/45 bg-[#1f1f1f]"
                          : "border-[#efcb6d]/20 bg-[#1a1a1a]"
                      }`}
                    >
                      {item.badge && (
                        <div className="mb-4 inline-flex w-fit rounded-full bg-[#efcb6d] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-black">
                          {item.badge}
                        </div>
                      )}
                      <h4 className="text-2xl font-semibold text-white">{item.name}</h4>
                      <p className="mt-1 text-sm text-white/65">{item.subtitle}</p>
                      <div className="mt-5 border-y border-[#efcb6d]/15 py-5">
                        <p className="text-4xl font-semibold tracking-tight text-white lg:text-5xl">
                          {item.price}
                          <span className="ml-1 text-sm font-normal text-white/55">{item.unit}</span>
                        </p>
                        {item.save && (
                          <p className="mt-1 text-xs font-medium text-[#efcb6d]">{item.save}</p>
                        )}
                      </div>
                      <div className="mt-6 flex-1 space-y-2.5">
                        {item.includes.map((inc) => (
                          <div key={inc} className="flex items-start gap-2.5 text-sm text-white/85">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#efcb6d]" />
                            {inc}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => goToTab("book")}
                        className="btn-press mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#efcb6d] px-5 py-3.5 text-sm font-semibold text-black"
                      >
                        {item.name === "Single Reel" ? "Book a Reel" : "Get Started"}
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly content mix */}
              <div className="mt-16">
                <p className="text-sm uppercase tracking-[0.28em] text-[#efcb6d]">Monthly Content Mix</p>
                <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                  4 video types, every month.
                </h3>
                <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {videoTypes.map((v, i) => (
                    <div key={v.title} className="card-lift rounded-[24px] border border-[#efcb6d]/20 bg-[#1a1a1a] p-6">
                      <p className="text-sm text-white/45">0{i + 1}</p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#efcb6d]">{v.tag}</p>
                      <h4 className="mt-1 text-lg font-medium text-white">{v.title}</h4>
                      <p className="mt-3 text-sm leading-6 text-white/70">{v.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead-gen system */}
              <div className="mt-16">
                <p className="text-sm uppercase tracking-[0.28em] text-[#efcb6d]">Lead Generation System</p>
                <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                  How content becomes clients.
                </h3>
                <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {leadGenSteps.map((s) => (
                    <div key={s.step} className="rounded-[24px] border border-[#efcb6d]/20 bg-[#151515] p-6">
                      <p className="text-3xl font-semibold text-[#efcb6d]">{s.step}</p>
                      <h4 className="mt-3 text-lg font-medium text-white">{s.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-white/70">{s.description}</p>
                      <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-white/45">
                        {s.audience}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-14 flex flex-col items-start gap-4 rounded-[28px] border border-[#efcb6d]/20 bg-[#151515] p-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">Ready to build your presence?</p>
                  <p className="mt-1 text-sm text-white/65">
                    Tell us about your goals and we'll recommend the right package.
                  </p>
                </div>
                <button
                  onClick={() => goToTab("book")}
                  className="btn-press flex-none rounded-2xl bg-[#efcb6d] px-6 py-3.5 text-sm font-semibold text-black"
                >
                  Book With Us
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ═══ BOOK WITH US ═══ */}
        {activeTab === "book" && (
          <section className="relative overflow-hidden bg-[#151515]">
            <AnimatedBg orbs={[
              { color: "rgba(239, 203, 109,0.16)", size: "520px", top: "-60px", right: "-80px", anim: "orb-c", delay: "-4s" },
              { color: "rgba(120, 95, 50,0.12)", size: "400px", bottom: "0px", left: "-60px", anim: "orb-b", delay: "-8s" },
            ]} />
            <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-10 lg:py-24">
              <div className="mb-10 max-w-2xl">
                <p className="text-sm uppercase tracking-[0.28em] text-[#efcb6d]">Book With Us</p>
                <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                  Tell us about your listing or brand.
                </h2>
                <p className="mt-4 leading-7 text-white/70">
                  New client discount available. Fill out the form and we'll be in touch
                  within the hour.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
                {/* Form */}
                <div className="rounded-[28px] border border-[#efcb6d]/20 bg-[#1a1a1a] p-5 lg:p-8">
                  {leadStatus === "success" ? (
                    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#efcb6d] text-2xl text-black">
                        ✓
                      </div>
                      <h3 className="text-xl font-semibold text-white">You're in.</h3>
                      <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">
                        Thanks, {leadData.firstName}. We'll reach out within the hour to
                        lock in the details.
                      </p>
                      <button
                        onClick={() => goToTab("work")}
                        className="btn-press mt-6 rounded-2xl border border-[#efcb6d]/40 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
                      >
                        Browse our work while you wait
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={submitLead} className="grid gap-4 sm:grid-cols-2">
                      <input required type="text" placeholder="First name" value={leadData.firstName}
                        onChange={(e) => setLeadData({ ...leadData, firstName: e.target.value })} className={inputClass} />
                      <input type="text" placeholder="Last name" value={leadData.lastName}
                        onChange={(e) => setLeadData({ ...leadData, lastName: e.target.value })} className={inputClass} />
                      <input required type="tel" placeholder="Phone number" value={leadData.phone}
                        onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })} className={inputClass} />
                      <input required type="email" placeholder="Email address" value={leadData.email}
                        onChange={(e) => setLeadData({ ...leadData, email: e.target.value })} className={inputClass} />
                      <input type="text" placeholder="Brokerage" value={leadData.brokerage}
                        onChange={(e) => setLeadData({ ...leadData, brokerage: e.target.value })} className={`${inputClass} sm:col-span-2`} />
                      <select value={leadData.lookingFor}
                        onChange={(e) => setLeadData({ ...leadData, lookingFor: e.target.value })}
                        className={`${inputClass} sm:col-span-2`}>
                        <option>Monthly Content Package</option>
                        <option>Listing Photography</option>
                        <option>Listing Video / Reel</option>
                        <option>Agent Branding Video</option>
                        <option>Not Sure Yet</option>
                      </select>
                      <button type="submit" disabled={leadStatus === "submitting"}
                        className="btn-press mt-1 w-full rounded-2xl bg-[#efcb6d] px-6 py-3.5 text-sm font-semibold text-black disabled:opacity-60 sm:col-span-2">
                        {leadStatus === "submitting" ? "Sending…" : "Get In Touch"}
                      </button>
                      {leadStatus === "error" && (
                        <p className="text-xs text-red-400 sm:col-span-2">{leadError}</p>
                      )}
                      <p className="text-[11px] leading-5 text-white/45 sm:col-span-2">
                        By submitting you agree to be contacted about your project. No spam.
                      </p>
                    </form>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  <div className="card-lift rounded-[28px] border border-[#efcb6d]/20 bg-[#1a1a1a] p-6">
                    <p className="text-sm uppercase tracking-[0.18em] text-white/60">What Happens Next</p>
                    <ul className="mt-3 space-y-3 text-sm leading-6 text-white/85">
                      <li>• We review your request and confirm what you need</li>
                      <li>• We reply with pricing, timing, and availability</li>
                      <li>• We lock in your shoot date and prep the details</li>
                    </ul>
                  </div>
                  <div className="card-lift rounded-[28px] border border-[#efcb6d]/20 bg-[#1a1a1a] p-6">
                    <p className="text-sm uppercase tracking-[0.18em] text-white/60">Email</p>
                    <a href="mailto:contact@mavncreative.com" className="mt-3 block text-lg font-medium text-white transition hover:text-[#efcb6d]">
                      contact@mavncreative.com
                    </a>
                  </div>
                  <div className="card-lift rounded-[28px] border border-[#efcb6d]/20 bg-[#1a1a1a] p-6">
                    <p className="text-sm uppercase tracking-[0.18em] text-white/60">Phone</p>
                    <a href="tel:6124883825" className="mt-3 block text-lg font-medium text-white transition hover:text-[#efcb6d]">
                      (612) 488-3825
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-[#efcb6d]/20 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-5 py-8 text-center sm:flex-row sm:justify-between sm:text-left lg:px-10">
          <p className="text-sm text-white/55">
            © {new Date().getFullYear()} MAVN Creative · Twin Cities Real Estate Media
          </p>
          <div className="flex items-center gap-5 text-sm text-white/55">
            <a href="https://instagram.com/mavn.creative" target="_blank" rel="noopener noreferrer" className="transition hover:text-[#efcb6d]">@mavn.creative</a>
            <a href="tel:6124883825" className="transition hover:text-[#efcb6d]">(612) 488-3825</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
