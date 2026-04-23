"use client";

import { useState, useEffect, useRef } from "react";

// ── Scroll-fade hook ──────────────────────────────────────────────────────────
function useScrollAnimations() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".anim");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const delay = el.dataset.delay ?? "0";
            setTimeout(() => el.classList.add("in"), Number(delay));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

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
          className={`orb ${o.anim === "orb-a" ? "orb-a" : o.anim === "orb-b" ? "orb-b" : "orb-c"}`}
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

// ── Video player with error fallback ─────────────────────────────────────────
function VideoPlayer({
  src,
  className,
  autoPlay,
  muted,
  loop,
  playsInline,
  controls,
  preload,
  style,
}: {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  preload?: string;
  style?: React.CSSProperties;
}) {
  const [errored, setErrored] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!autoPlay || !videoRef.current) return;
    videoRef.current.play().catch(() => {});
  }, [autoPlay]);

  // MOV files: use video/mp4 type hint so Chrome/Firefox attempt H.264 decode
  // instead of rejecting on the video/quicktime MIME type from the server.
  const isMov = src.toLowerCase().includes(".mov");

  if (errored) {
    return (
      <div className={`video-fallback ${className ?? ""}`} style={style}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.4 }}
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#f4cf36", textDecoration: "underline", fontSize: 13 }}
        >
          Open video ↗
        </a>
        <span style={{ fontSize: 11, opacity: 0.4 }}>
          Format not supported in this browser
        </span>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className={className}
      style={style}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      controls={controls}
      preload={preload ?? "metadata"}
      onError={() => setErrored(true)}
    >
      {/* type="video/mp4" lets Chrome/Firefox attempt playback of MOV/H.264 */}
      <source src={src} type={isMov ? "video/mp4" : "video/mp4"} />
    </video>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function RealEstateMediaLandingPage() {
  const [bookingData, setBookingData] = useState({
    fullName: "",
    email: "",
    phone: "",
    clientLocation: "",
    serviceNeeded: "Cinematic Listing Video",
    propertyAddress: "",
    propertyCity: "",
    propertyState: "",
    squareFootage: "",
    bedBath: "",
    preferredShootDate: "",
    listingStatus: "",
    projectNotes: "",
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useScrollAnimations();

  const logoSrc = "/logo.png";

  const featurePoints = [
    "Cinematic listing videos built to stop the scroll.",
    "Agent branding content that makes you look confident and credible on camera.",
    "HDR photos, reels, and social-first media designed for Instagram and Facebook.",
  ];

  const FeatureIcon = () => (
    <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#f4cf36] text-xs font-semibold text-black">
      ✓
    </span>
  );

  const proofStats = [
    { label: "Listings elevated", value: "50+" },
    { label: "Content built for", value: "Reels + MLS" },
    { label: "Turnaround", value: "Fast & reliable" },
  ];

  const services = [
    {
      title: "Cinematic Listing Videos",
      description:
        "Property films that feel premium, modern, and emotionally engaging — designed to help agents market homes at a higher level.",
    },
    {
      title: "Agent Branding Videos",
      description:
        "Content that helps agents build trust, authority, and familiarity online with polished personal brand videos.",
    },
    {
      title: "HDR Photography",
      description:
        "Clean, sharp, professional interior and exterior photos built for MLS, Zillow, social media, and marketing materials.",
    },
    {
      title: "Social Media Content",
      description:
        "Short-form videos and campaign assets tailored for Facebook, Instagram, reels, teasers, launches, and ongoing growth.",
    },
    {
      title: "Developer & Project Media",
      description:
        "High-end visual assets for developments, new builds, and launch campaigns that need consistency and strong presentation.",
    },
    {
      title: "Creative Strategy",
      description:
        "Guidance on hooks, delivery, video concepts, and content structure so your media performs instead of just looking good.",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Reach Out",
      description:
        "Tell us about the listing, your brand, or the kind of content support you need.",
    },
    {
      step: "02",
      title: "Choose Your Package",
      description:
        "We build the right mix of video, photo, and social content based on your goals.",
    },
    {
      step: "03",
      title: "Shoot Day",
      description:
        "We direct, capture, and produce content with a clean cinematic approach.",
    },
    {
      step: "04",
      title: "Delivery & Posting",
      description:
        "Receive polished media that is ready to market, post, and share with confidence.",
    },
  ];

  const portfolioItems = [
    {
      title: "Cinematic Listing Reel",
      type: "Listing Video",
      description:
        "A cinematic real estate showcase created for social media marketing and listing visibility.",
      videoSrc:
        "https://fn9qpleiatjb4gdq.public.blob.vercel-storage.com/4390_Normandy_%20Place_V5.mp4",
    },
    {
      title: "Agent Branding Reel",
      type: "Branding Video",
      description:
        "A personal brand focused reel designed to elevate agent presence and build trust online.",
      videoSrc:
        "https://fn9qpleiatjb4gdq.public.blob.vercel-storage.com/Rosemount%20v2.mp4",
    },
    {
      title: "Luxury Property Reel",
      type: "Listing Video",
      description:
        "A cinematic property showcase built to create attention, highlight the home, and elevate the listing online.",
      videoSrc:
        "https://fn9qpleiatjb4gdq.public.blob.vercel-storage.com/869%20Lawson%20Ave%20Raw%20Footage%20V2.mp4",
    },
    {
      title: "Property Showcase Reel",
      type: "Listing Video",
      description:
        "A polished real estate reel created to showcase the property with cinematic movement and strong visual presentation.",
      videoSrc:
        "https://fn9qpleiatjb4gdq.public.blob.vercel-storage.com/Abbott_Dr_N_Reel_V2.mp4",
    },
  ];

  const packages = [
    {
      name: "Essential",
      subtitle: "Perfect for standard listings.",
      price: "$249",
      includes: [
        "Cinematic listing video (up to 90 sec)",
        "Interior & exterior walk-through",
        "Professional color grading",
        "Licensed background music",
        "Standard 48-hour turnaround",
        "1 round of revisions included",
      ],
      addOn: "Add drone + photos: +$199",
    },
    {
      name: "Signature",
      subtitle: "Our most popular package.",
      price: "$549",
      includes: [
        "Cinematic listing video (up to 2 min)",
        "FAA-certified drone aerial footage",
        "Twilight / golden hour exterior shot",
        "Professional photography (20+ photos)",
        "Professional color + LUT grading",
        "Licensed music + sound design",
        "Standard 48-hour turnaround",
        "2 rounds of revisions included",
      ],
      addOn: "Add agent promo video: +$199",
      featured: true,
    },
    {
      name: "Elite",
      subtitle: "For luxury & premium listings.",
      price: "$999",
      includes: [
        "Extended cinematic video (3–4 min)",
        "Full drone package — multiple angles",
        "Twilight & golden hour sessions",
        "Agent intro / promo video clip",
        "Professional photography (35+ photos)",
        "Standard 48-hour turnaround",
        "Unlimited revisions",
        "Dedicated project manager",
      ],
      addOn: "Add virtual tour: +$100",
    },
    {
      name: "Custom",
      subtitle: "Built for developers, teams, and unique campaign needs.",
      price: "Custom",
      includes: [
        "Multi-property or ongoing content planning",
        "Tailored video + photo deliverables",
        "Branding content for agents or teams",
        "Flexible turnaround based on scope",
        "Custom creative direction",
        "Quote built around your exact needs",
      ],
      addOn: "Schedule a discovery call for custom pricing",
    },
  ];

  const addOns = [
    {
      name: "Real Estate Photography",
      detail: "20 professionally edited photos",
      price: "$125",
    },
    {
      name: "Extra Revision Round",
      detail: "Beyond included revisions",
      price: "$50",
    },
    {
      name: "Extended Video",
      detail: "Add up to 1 minute to any listing video",
      price: "$75",
    },
    {
      name: "Virtual Tour Integration",
      detail: "Matterport-compatible 360 walkthrough link",
      price: "$100",
    },
    {
      name: "Agent Bio / Promo Video",
      detail: "60-sec branded agent introduction clip",
      price: "$199",
    },
    {
      name: "Twilight Session Only",
      detail: "Exterior golden hour / dusk shoot",
      price: "$99",
    },
    {
      name: "Raw Footage Files",
      detail: "Unedited footage delivered via download",
      price: "$50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ── Navigation ── */}
      <header
        className={`sticky top-0 z-50 border-b border-[#f4cf36]/20 bg-black transition-all duration-300 ${
          isScrolled ? "nav-glass" : ""
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-10">

          {/* ── Mobile header row ── */}
          <div className="flex items-center justify-between py-4 md:hidden">
            <div className="flex items-center gap-3">
              <img src={logoSrc} alt="MAVN Creative logo" className="h-9 w-auto object-contain" />
              <div className="leading-tight">
                <p className="text-xs font-semibold tracking-[0.16em] text-white">MAVN Creative</p>
                <p className="text-[10px] tracking-[0.24em] text-[#f4cf36]">REAL ESTATE MEDIA</p>
              </div>
            </div>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle navigation"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white transition hover:border-[#f4cf36]/40"
            >
              {mobileNavOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              )}
            </button>
          </div>

          {/* ── Mobile dropdown ── */}
          {mobileNavOpen && (
            <div className="border-t border-white/10 pb-5 md:hidden">
              <nav className="flex flex-col">
                {[
                  ["#about", "About"],
                  ["#services", "Services"],
                  ["#portfolio", "Portfolio"],
                  ["#packages", "Packages"],
                ].map(([href, label]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMobileNavOpen(false)}
                    className="border-b border-white/8 py-3.5 text-sm text-white/80 transition hover:text-white"
                  >
                    {label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-3">
                <a href="tel:6124883825" className="text-sm text-white/55 transition hover:text-[#f4cf36]">
                  (612) 488-3825
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileNavOpen(false)}
                  className="btn-press rounded-2xl bg-[#f4cf36] px-5 py-3.5 text-center text-sm font-semibold text-black"
                >
                  Book a Shoot
                </a>
              </div>
            </div>
          )}

          {/* ── Desktop nav row ── */}
          <div className="hidden items-center justify-between py-5 md:flex">
            <div className="flex items-center gap-4 text-sm text-white">
              <img src={logoSrc} alt="MAVN Creative logo" className="h-11 w-auto object-contain" />
              <div>
                <p className="font-semibold tracking-[0.18em] text-white">MAVN Creative</p>
                <p className="tracking-[0.28em] text-[#f4cf36]">REAL ESTATE MEDIA</p>
              </div>
            </div>
            <div className="flex items-center gap-7 text-sm">
              <a href="#about" className="nav-link">About</a>
              <a href="#services" className="nav-link">Services</a>
              <a href="#portfolio" className="nav-link">Portfolio</a>
              <a href="#packages" className="nav-link">Packages</a>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <a href="tel:6124883825" className="text-white/70 transition hover:text-[#f4cf36]">
                (612) 488-3825
              </a>
              <a href="#contact" className="btn-press rounded-full bg-[#f4cf36] px-5 py-2.5 font-semibold text-black">
                Book a Shoot
              </a>
            </div>
          </div>

        </div>
      </header>

      {/* ── Hero — full-screen cinematic video background ── */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-black">

        {/* Background video with Ken Burns zoom */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="ken-burns absolute inset-0 h-full w-full object-cover"
            style={{ filter: "brightness(0.38) saturate(1.1)" }}
          >
            <source
              src="https://fn9qpleiatjb4gdq.public.blob.vercel-storage.com/Rosemount%20v2.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Layered cinematic overlays */}
        {/* Vignette — darkens edges */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_30%,rgba(0,0,0,0.70)_100%)]" />
        {/* Bottom fade into next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent" />
        {/* Left reading gradient */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/60 to-transparent" />
        {/* Top fade from nav */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
        {/* Gold accent line at top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f4cf36]/50 to-transparent" />

        {/* Subtle animated orbs behind content */}
        <AnimatedBg orbs={[
          { color: "rgba(244,207,54,0.10)", size: "700px", top: "-180px", right: "-60px",   anim: "orb-a", delay: "0s"  },
          { color: "rgba(200,140,30,0.08)",  size: "500px", bottom: "-80px", left: "-60px", anim: "orb-b", delay: "-7s" },
        ]} />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-24 sm:px-6 lg:px-10 lg:pt-40 lg:pb-36">
          <div className="max-w-3xl">

            {/* Logo + eyebrow */}
            <div
              className="hero-line mb-7 flex items-center gap-3"
              style={{ animationDelay: "0.1s" }}
            >
              <img src={logoSrc} alt="MAVN Creative" className="h-10 w-auto object-contain" />
              <span className="h-4 w-px bg-white/25" />
              <p className="text-xs uppercase tracking-[0.36em] text-[#f4cf36]">
                Minnesota Real Estate Media
              </p>
            </div>

            {/* Main headline — lines staggered */}
            <h1 className="text-[1.9rem] font-semibold leading-[1.08] text-white sm:text-4xl lg:text-[5rem] lg:leading-[1.04]">
              <span className="hero-line block" style={{ animationDelay: "0.22s" }}>
                Cinematic real estate
              </span>
              <span className="hero-line block" style={{ animationDelay: "0.36s" }}>
                content that helps
              </span>
              <span className="hero-line block text-[#f4cf36]" style={{ animationDelay: "0.50s" }}>
                agents stand out.
              </span>
            </h1>

            {/* Subtext */}
            <p
              className="hero-line mt-5 max-w-xl text-sm leading-7 text-white/70 sm:mt-7 sm:text-base lg:text-lg"
              style={{ animationDelay: "0.65s" }}
            >
              Listing films, agent branding reels, HDR photography, and
              social-first content — built for real estate professionals
              who want to market at a higher level.
            </p>

            {/* CTAs */}
            <div
              className="hero-line mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
              style={{ animationDelay: "0.80s" }}
            >
              <a
                href="#portfolio"
                className="btn-press rounded-2xl bg-[#f4cf36] px-7 py-3.5 text-sm font-semibold text-black"
              >
                View Our Work
              </a>
              <a
                href="#packages"
                className="btn-press rounded-2xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                See Packages
              </a>
            </div>

            {/* Stat row */}
            <div
              className="hero-line mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-8 sm:mt-14 sm:gap-10 sm:pt-10"
              style={{ animationDelay: "0.95s" }}
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2">
          <p className="text-[9px] uppercase tracking-[0.35em] text-white/35">Scroll</p>
          <svg
            className="scroll-bounce text-white/35"
            width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ── Why It Works ── */}
      <section className="border-y border-[#e7dcc0] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-10 lg:py-16">
          <div className="anim mb-8">
            <p className="text-sm uppercase tracking-[0.28em] text-[#d4af37]">
              Why it works
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-black sm:text-3xl lg:text-4xl">
              Media built for attention, perception, and results.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {proofStats.map((stat, i) => (
              <div
                key={stat.label}
                className="anim card-lift rounded-[28px] border border-[#eadfbf] bg-[#fffaf0] p-6"
                data-delay={String(i * 100)}
              >
                <p className="text-sm uppercase tracking-[0.2em] text-[#d4af37]">
                  {stat.label}
                </p>
                <p className="mt-4 text-3xl font-semibold text-black">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="anim grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#f4cf36]">
              About
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
              We help real estate brands look more premium and feel more
              memorable.
            </h2>
          </div>
          <div className="space-y-5 leading-7 text-white/85">
            <p>
              MAVN Creative creates visual content for agents, buyers, sellers,
              and property developers who want more than basic marketing. We
              focus on cinematic execution, clean presentation, and content that
              supports visibility across social media and listing campaigns.
            </p>
            <p>
              Our goal is simple: make your brand and your properties feel
              stronger online. Whether that means a showcase video, an agent
              reel, a full set of HDR photos, or a more strategic content
              approach, we help you show up professionally and consistently.
            </p>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section
        id="services"
        className="relative overflow-hidden border-y border-[#f4cf36]/20 bg-[#0c0905]"
      >
        <AnimatedBg orbs={[
          { color: "rgba(244,207,54,0.18)", size: "500px", top: "-100px", right: "-80px",  anim: "orb-b", delay: "-3s" },
          { color: "rgba(180,110,20,0.14)",  size: "420px", bottom: "-60px", left: "10%",  anim: "orb-a", delay: "-7s" },
          { color: "rgba(244,207,54,0.08)",  size: "300px", top: "40%",  left: "-60px",    anim: "orb-c", delay: "-12s" },
        ]} />
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="anim mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#f4cf36]">
                Services
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
                What we do
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-white/75">
              Built for agents and brands that want stronger content, stronger
              presentation, and stronger positioning in a crowded market.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, i) => (
              <div
                key={service.title}
                className="anim card-lift rounded-[28px] border border-[#f4cf36]/20 bg-[#120e09] p-6 shadow-2xl shadow-black/30"
                data-delay={String((i % 3) * 90)}
              >
                <h3 className="text-xl font-medium text-white">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/75">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio ── */}
      <section
        id="portfolio"
        className="relative overflow-hidden bg-[#050505]"
      >
        <AnimatedBg orbs={[
          { color: "rgba(244,207,54,0.15)", size: "550px", top: "0px",    left: "-100px",  anim: "orb-c", delay: "-5s" },
          { color: "rgba(220,160,40,0.12)",  size: "400px", bottom: "50px", right: "-80px", anim: "orb-a", delay: "-9s" },
        ]} />
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="anim mb-8">
          <p className="text-sm uppercase tracking-[0.28em] text-[#f4cf36]">
            Portfolio
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            Recent work
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-white/75">
            Listing films, social reels, and brand videos that show the quality
            of our work instantly.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {portfolioItems.map((item, i) => (
            <div
              key={item.title}
              className="anim card-lift overflow-hidden rounded-[30px] border border-[#f4cf36]/20 bg-[#14110a]"
              data-delay={String((i % 4) * 90)}
            >
              <div className="relative mx-auto w-full max-w-[320px] p-4">
                <VideoPlayer
                  src={item.videoSrc}
                  className="aspect-[9/16] w-full rounded-[24px] object-cover"
                  style={{ display: "block" }}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute left-4 top-4 rounded-full border border-[#f4cf36]/25 bg-[#120e09]/95 px-3 py-1.5 text-[9px] uppercase tracking-[0.20em] text-white sm:left-8 sm:top-8 sm:px-4 sm:py-2 sm:text-[10px]">
                  {item.type}
                </div>
              </div>
              <div className="space-y-3 px-6 pb-6 pt-2 text-center">
                <h3 className="text-xl font-medium text-white">{item.title}</h3>
                <p className="text-sm leading-6 text-white/75">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="relative overflow-hidden border-y border-[#f4cf36]/20 bg-[#0c0905]">
        <AnimatedBg orbs={[
          { color: "rgba(244,207,54,0.16)", size: "480px", top: "-80px",  right: "5%",    anim: "orb-a", delay: "-2s" },
          { color: "rgba(180,110,20,0.12)",  size: "360px", bottom: "-40px", left: "-60px", anim: "orb-b", delay: "-6s" },
        ]} />
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="anim mb-8">
            <p className="text-sm uppercase tracking-[0.28em] text-[#f4cf36]">
              Process
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
              Simple, clear, and built for busy professionals.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {process.map((item, i) => (
              <div
                key={item.step}
                className="anim card-lift rounded-[28px] border border-[#f4cf36]/20 bg-[#120e09] p-6"
                data-delay={String(i * 90)}
              >
                <p className="text-sm text-white/60">Step {item.step}</p>
                <h3 className="mt-3 text-xl font-medium text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/75">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section id="packages" className="relative overflow-hidden border-y border-[#f4cf36]/20 bg-[#050505]">
        <AnimatedBg orbs={[
          { color: "rgba(244,207,54,0.22)", size: "620px", top: "-140px", left: "-100px",  anim: "orb-b", delay: "-1s" },
          { color: "rgba(200,130,20,0.16)",  size: "500px", top: "30%",  right: "-120px",  anim: "orb-a", delay: "-5s" },
          { color: "rgba(244,207,54,0.10)",  size: "350px", bottom: "-80px", left: "35%",  anim: "orb-c", delay: "-10s" },
        ]} />
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="anim mb-8">
            <p className="text-sm uppercase tracking-[0.28em] text-[#f4cf36]">
              Packages
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
              Options built around how real estate clients actually buy media.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {packages.map((pkg, i) => (
              <div
                key={pkg.name}
                className={`anim card-lift rounded-[28px] border p-5 lg:p-7 ${
                  pkg.featured
                    ? "border-[#f4cf36]/45 bg-[#1a140b]"
                    : "border-[#f4cf36]/20 bg-[#14110a]"
                }`}
                data-delay={String((i % 4) * 80)}
              >
                {pkg.featured && (
                  <div className="mb-4 inline-flex rounded-full border border-[#f4cf36]/30 bg-[#f4cf36] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-black">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-semibold text-white">
                  {pkg.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  {pkg.subtitle}
                </p>
                <div className="mt-5 border-y border-[#f4cf36]/15 py-5">
                  <p className="text-4xl font-semibold tracking-tight text-white lg:text-5xl">
                    {pkg.price}
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    {pkg.price === "Custom" ? "quote based on scope" : "per property"}
                  </p>
                </div>
                <div className="mt-6 space-y-3">
                  {pkg.includes.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3 text-sm text-white/85"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl bg-[#f4cf36]/12 px-4 py-3 text-sm font-medium text-white/85">
                  {pkg.addOn}
                </div>
                <a
                  href={pkg.price === "Custom" ? "#contact" : `/checkout?package=${pkg.name.toLowerCase()}`}
                  className="btn-press mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f4cf36] px-5 py-3.5 text-sm font-semibold text-black"
                >
                  {pkg.price === "Custom" ? "Get a Quote" : "Book Now"}
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Add-Ons ── */}
      <section className="border-b border-[#e7dcc0] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-10 lg:py-16">
          <div className="anim mb-8">
            <p className="text-sm uppercase tracking-[0.28em] text-[#d4af37]">
              A La Carte Add-Ons
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-black sm:text-3xl lg:text-4xl">
              Customize your package with extra services.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-black/60">
              Flexible upgrades for listings that need more coverage, more
              polish, or more branded content.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {addOns.map((item, i) => (
              <div
                key={item.name}
                className="anim card-lift rounded-[24px] border border-[#eadfbf] bg-[#fffaf0] p-5"
                data-delay={String((i % 3) * 80)}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-black sm:text-lg">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-black/60">
                      {item.detail}
                    </p>
                  </div>
                  <div className="rounded-full bg-[#d4af37] px-3 py-1 text-sm font-semibold text-black">
                    {item.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="relative overflow-hidden border-t border-[#f4cf36]/20 bg-[#0c0905]">
        <AnimatedBg orbs={[
          { color: "rgba(244,207,54,0.16)", size: "520px", top: "-60px",  right: "-80px", anim: "orb-c", delay: "-4s" },
          { color: "rgba(180,110,20,0.12)",  size: "400px", bottom: "0px", left: "-60px", anim: "orb-b", delay: "-8s" },
        ]} />
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="anim mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-[#f4cf36]">
              Booking
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
              Book your shoot and tell us what you need.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-white/75">
              Submit your project details and we'll follow up manually with
              pricing, availability, and next steps.
            </p>
          </div>

          <div className="anim grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
            <form
              action="mailto:contact@mavncreative.com"
              method="POST"
              encType="text/plain"
              className="rounded-[28px] border border-[#f4cf36]/20 bg-[#14110a] p-5 lg:p-8"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Full Name
                  </label>
                  <input
                    name="Full Name"
                    type="text"
                    value={bookingData.fullName}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, fullName: e.target.value })
                    }
                    placeholder="Your full name"
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Email Address
                  </label>
                  <input
                    name="Email"
                    type="email"
                    value={bookingData.email}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Phone Number
                  </label>
                  <input
                    name="Phone"
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, phone: e.target.value })
                    }
                    placeholder="(555) 555-5555"
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Your Location
                  </label>
                  <input
                    name="Client Location"
                    type="text"
                    value={bookingData.clientLocation}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        clientLocation: e.target.value,
                      })
                    }
                    placeholder="City, State"
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-white">
                    What Do You Need?
                  </label>
                  <select
                    name="Service Needed"
                    value={bookingData.serviceNeeded}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        serviceNeeded: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3.5 text-white outline-none transition focus:border-[#f4cf36]/50"
                  >
                    <option>Cinematic Listing Video</option>
                    <option>Agent Branding Video</option>
                    <option>HDR Photography</option>
                    <option>Drone + Photo Package</option>
                    <option>Custom Package</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-white">
                    Property Address
                  </label>
                  <input
                    name="Property Address"
                    type="text"
                    value={bookingData.propertyAddress}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        propertyAddress: e.target.value,
                      })
                    }
                    placeholder="123 Main Street"
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Property City
                  </label>
                  <input
                    name="Property City"
                    type="text"
                    value={bookingData.propertyCity}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        propertyCity: e.target.value,
                      })
                    }
                    placeholder="City"
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Property State
                  </label>
                  <input
                    name="Property State"
                    type="text"
                    value={bookingData.propertyState}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        propertyState: e.target.value,
                      })
                    }
                    placeholder="State"
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Square Footage
                  </label>
                  <input
                    name="Square Footage"
                    type="text"
                    value={bookingData.squareFootage}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        squareFootage: e.target.value,
                      })
                    }
                    placeholder="e.g. 2,400"
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Bedrooms / Bathrooms
                  </label>
                  <input
                    name="Bedrooms Bathrooms"
                    type="text"
                    value={bookingData.bedBath}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, bedBath: e.target.value })
                    }
                    placeholder="4 bed / 3 bath"
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Preferred Shoot Date
                  </label>
                  <input
                    name="Preferred Shoot Date"
                    type="date"
                    value={bookingData.preferredShootDate}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        preferredShootDate: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3.5 text-white outline-none transition focus:border-[#f4cf36]/50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    MLS / Listing Status
                  </label>
                  <input
                    name="Listing Status"
                    type="text"
                    value={bookingData.listingStatus}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        listingStatus: e.target.value,
                      })
                    }
                    placeholder="Coming soon, active, vacant, etc."
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-white">
                    Project Notes
                  </label>
                  <textarea
                    name="Project Notes"
                    rows={4}
                    value={bookingData.projectNotes}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        projectNotes: e.target.value,
                      })
                    }
                    placeholder="Tell us about the property, timeline, access details, or anything else we should know."
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:flex-col md:items-stretch lg:flex-row lg:items-center">
                <p className="text-sm leading-6 text-white/60">
                  We'll follow up with pricing, availability, and next steps directly.
                </p>
                <button
                  type="submit"
                  className="btn-press rounded-2xl bg-[#f4cf36] px-6 py-3 text-sm font-medium text-black"
                >
                  Send Booking Request
                </button>
              </div>
            </form>

            <div className="space-y-4">
              <div className="card-lift rounded-[28px] border border-[#f4cf36]/20 bg-[#120e09] p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-white/60">
                  Email
                </p>
                <a
                  href="mailto:contact@mavncreative.com"
                  className="mt-3 block text-lg font-medium text-white transition hover:text-[#f4cf36]"
                >
                  contact@mavncreative.com
                </a>
              </div>
              <div className="card-lift rounded-[28px] border border-[#f4cf36]/20 bg-[#120e09] p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-white/60">
                  Phone
                </p>
                <a
                  href="tel:6124883825"
                  className="mt-3 block text-lg font-medium text-white transition hover:text-[#f4cf36]"
                >
                  (612) 488-3825
                </a>
              </div>
              <div className="card-lift rounded-[28px] border border-[#f4cf36]/20 bg-[#120e09] p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-white/60">
                  Launch Note
                </p>
                <p className="mt-3 text-sm leading-6 text-white/75">
                  Online payment is being finalized. For now, submit your
                  project details here and we'll confirm the booking manually.
                </p>
              </div>
              <div className="card-lift rounded-[28px] border border-[#f4cf36]/20 bg-[#120e09] p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-white/60">
                  What Happens Next
                </p>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-white/85">
                  <li>• We review your request and confirm service needs</li>
                  <li>• We reply with pricing, timing, and availability</li>
                  <li>• We lock in your shoot date and prep details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
