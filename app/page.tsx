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
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 text-sm text-white">
              <img
                src={logoSrc}
                alt="MAVN Creative logo"
                className="h-12 w-auto rounded-md object-contain"
              />
              <div>
                <p className="font-semibold tracking-[0.18em] text-white">
                  MAVN Creative
                </p>
                <p className="tracking-[0.28em] text-[#f4cf36]">
                  REAL ESTATE MEDIA
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm md:ml-auto md:mr-6">
              <a href="#about" className="nav-link">About</a>
              <a href="#services" className="nav-link">Services</a>
              <a href="#portfolio" className="nav-link">Portfolio</a>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <a
                href="tel:6124883825"
                className="text-white/75 transition hover:text-[#f4cf36]"
              >
                (612) 488-3825
              </a>
              <a
                href="#contact"
                className="btn-press rounded-full border border-[#f4cf36]/30 bg-[#f4cf36] px-5 py-2.5 font-medium text-black"
              >
                Book a Shoot
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,207,54,0.18),transparent_38%)]" />
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-28">
          <div className="relative z-10 anim in">
            <div className="mb-6 flex items-center gap-4">
              <img
                src={logoSrc}
                alt="MAVN Creative brand mark"
                className="h-16 w-auto object-contain sm:h-20"
              />
              <p className="text-sm uppercase tracking-[0.32em] text-white/80">
                Minnesota Based Real Estate Media Company
              </p>
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.08] text-white sm:text-4xl lg:text-5xl">
              Cinematic real estate content that helps agents stand out.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              We create cinematic listings, agent branding videos, HDR
              photography, and social-first content that helps real estate
              professionals show up at a higher level across Instagram,
              Facebook, and beyond.
            </p>

            <div className="mt-8 grid max-w-2xl gap-4">
              {featurePoints.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 text-sm leading-6 text-white/85"
                >
                  <FeatureIcon />
                  <p>{point}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#portfolio"
                className="btn-press rounded-2xl bg-[#f4cf36] px-6 py-3 text-sm font-medium text-black"
              >
                View Portfolio
              </a>
              <a
                href="#services"
                className="btn-press rounded-2xl border border-[#f4cf36]/25 bg-[#14110a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1d170c]"
              >
                Explore Services
              </a>
            </div>
          </div>

          <div className="anim in flex justify-center lg:justify-end" style={{ transitionDelay: "150ms" }}>
            <div className="relative mx-auto">
              <div className="relative w-[290px] rounded-[3rem] bg-[#0b0b0b] p-[10px] shadow-[0_25px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
                <div className="absolute left-1/2 top-[10px] z-20 h-[26px] w-[110px] -translate-x-1/2 rounded-b-[18px] bg-black" />
                <div className="absolute left-[18px] top-[120px] z-20 h-[42px] w-[3px] rounded-full bg-[#2a2a2a]" />
                <div className="absolute left-[18px] top-[175px] z-20 h-[42px] w-[3px] rounded-full bg-[#2a2a2a]" />
                <div className="absolute right-[18px] top-[145px] z-20 h-[68px] w-[3px] rounded-full bg-[#2a2a2a]" />
                <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black">
                  <VideoPlayer
                    src="https://fn9qpleiatjb4gdq.public.blob.vercel-storage.com/Rosemount%20v2.mp4"
                    className="aspect-[9/19.5] w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    preload="metadata"
                  />
                  <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-[#f4cf36]/25 bg-[#120e09]/95 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white">
                    Featured Reel
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why It Works ── */}
      <section className="border-y border-[#e7dcc0] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="anim mb-8">
            <p className="text-sm uppercase tracking-[0.28em] text-[#d4af37]">
              Why it works
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-black sm:text-4xl">
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
      <section id="about" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="anim grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#f4cf36]">
              About
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
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
        className="border-y border-[#f4cf36]/20 bg-[#0c0905]"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="anim mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#f4cf36]">
                Services
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
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
        className="mx-auto max-w-7xl px-6 py-20 lg:px-10"
      >
        <div className="anim mb-10">
          <p className="text-sm uppercase tracking-[0.28em] text-[#f4cf36]">
            Portfolio
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
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
                <div className="absolute left-8 top-8 rounded-full border border-[#f4cf36]/25 bg-[#120e09]/95 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white">
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
      </section>

      {/* ── Process ── */}
      <section className="border-y border-[#f4cf36]/20 bg-[#0c0905]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="anim mb-10">
            <p className="text-sm uppercase tracking-[0.28em] text-[#f4cf36]">
              Process
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
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
      <section className="border-y border-[#f4cf36]/20 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="anim mb-10">
            <p className="text-sm uppercase tracking-[0.28em] text-[#f4cf36]">
              Packages
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Options built around how real estate clients actually buy media.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {packages.map((pkg, i) => (
              <div
                key={pkg.name}
                className={`anim card-lift rounded-[30px] border p-7 ${
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
                  <p className="text-5xl font-semibold tracking-tight text-white">
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
                  className="btn-press mt-6 inline-flex rounded-2xl bg-[#f4cf36] px-5 py-3 text-sm font-medium text-black"
                >
                  {pkg.price === "Custom" ? "Get a Quote" : "Book Now"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Add-Ons ── */}
      <section className="border-b border-[#e7dcc0] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="anim mb-10">
            <p className="text-sm uppercase tracking-[0.28em] text-[#d4af37]">
              A La Carte Add-Ons
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-black sm:text-4xl">
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
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-black">
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
      <section id="contact" className="border-t border-[#f4cf36]/20 bg-[#0c0905]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="anim mb-12 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-[#f4cf36]">
              Booking
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Book your shoot and tell us what you need.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-white/75">
              Submit your project details and we'll follow up manually with
              pricing, availability, and next steps.
            </p>
          </div>

          <div className="anim grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <form
              action="mailto:contact@mavncreative.com"
              method="POST"
              encType="text/plain"
              className="rounded-[32px] border border-[#f4cf36]/20 bg-[#14110a] p-6 lg:p-8"
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
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
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
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
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
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
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
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
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
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3 text-white outline-none transition focus:border-[#f4cf36]/50"
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
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
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
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
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
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
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
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
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
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
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
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3 text-white outline-none transition focus:border-[#f4cf36]/50"
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
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-white">
                    Project Notes
                  </label>
                  <textarea
                    name="Project Notes"
                    rows={5}
                    value={bookingData.projectNotes}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        projectNotes: e.target.value,
                      })
                    }
                    placeholder="Tell us about the property, timeline, access details, or anything else we should know."
                    className="w-full rounded-2xl border border-[#f4cf36]/15 bg-[#0f0c08] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#f4cf36]/50"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
