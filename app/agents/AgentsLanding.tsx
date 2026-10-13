"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";


// ── Reel tile — autoplays muted while on screen, tap to unmute ───────────────
function Reel({
  src,
  title,
  type,
  className = "",
}: {
  src: string;
  title?: string;
  type?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);

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

  return (
    <div
      className={`group relative aspect-[9/16] overflow-hidden rounded-2xl bg-[#111] ring-1 ring-white/10 ${className}`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setReady(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={src} type="video/mp4" />
      </video>
      {title && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
            <p className="text-[9px] uppercase tracking-[0.22em] text-[#efcb6d]">{type}</p>
            <p className="mt-0.5 text-sm font-medium leading-tight text-white">{title}</p>
          </div>
        </>
      )}
      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/75"
      >
        {muted ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        )}
      </button>
    </div>
  );
}

// ── Small building blocks ────────────────────────────────────────────────────
function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.28em] ${
        dark ? "text-[#a8821f]" : "text-[#efcb6d]"
      }`}
    >
      {children}
    </p>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="box-decoration-clone bg-[#efcb6d] px-2 text-black [-webkit-box-decoration-break:clone]">
      {children}
    </span>
  );
}

function CTA({ label = "Reserve My Shoot", href = "#offer" }: { label?: string; href?: string }) {
  return (
    <a
      href={href}
      className="btn-press inline-flex items-center gap-2 rounded-full bg-[#efcb6d] px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-black shadow-[0_10px_40px_rgba(239,203,109,0.25)]"
    >
      {label}
      <span aria-hidden>→</span>
    </a>
  );
}

// Fade-up on scroll, using the .anim/.in classes from globals.css
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".anim");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── Content ──────────────────────────────────────────────────────────────────
const framework = [
  {
    tag: "Authority",
    title: "Education",
    body: "Answer the questions buyers and sellers are already Googling. This is what builds trust with people who have never met you.",
  },
  {
    tag: "Trust",
    title: "Storytelling",
    body: "Your story, your why, the client journeys. The videos that make people feel like they already know you.",
  },
  {
    tag: "Reach",
    title: "Scroll-Stopper",
    body: "High-energy, trend-aware content built to get you in front of new audiences fast.",
  },
  {
    tag: "Local Authority",
    title: "Community",
    body: "Neighborhood tours, market updates, local lifestyle. The content that ties your name to a place.",
  },
];

const steps = [
  {
    n: "01",
    title: "Discover",
    lead: "Define what you want to be known for.",
    body: "A brand discovery session covering your market, your ideal client, your specialty, and what makes you the obvious choice.",
  },
  {
    n: "02",
    title: "Script",
    lead: "Turn your expertise into talking points.",
    body: "We write the hooks and talking points for every reel, built around how you actually talk.",
  },
  {
    n: "03",
    title: "Shoot",
    lead: "Get directed on camera.",
    body: "A professionally directed shoot with on-camera coaching, so you come across as confident instead of stiff.",
  },
  {
    n: "04",
    title: "Deliver",
    lead: "Leave with content worth posting.",
    body: "Cinematic, edited vertical reels delivered weekly and ready for Instagram, Facebook, TikTok, and YouTube Shorts.",
  },
];

const deliverables = [
  {
    phase: "Before the shoot",
    items: [
      ["Brand Discovery Session", "Your market, audience, specialty, and the position you want to own."],
      ["Content Plan", "Every reel mapped to Education, Storytelling, Scroll-Stopper, or Community."],
      ["Custom Scripts & Hooks", "Talking points written for you, so you never wonder what to say."],
    ],
  },
  {
    phase: "During the shoot",
    items: [
      ["Directed Shooting Session", "90 minutes to a full day depending on your package, with on-camera direction the whole time."],
      ["Cinematic Production", "The same premium camera work, lighting, and movement we bring to listing films."],
    ],
  },
  {
    phase: "After the shoot",
    items: [
      ["Professionally Edited Reels", "Color graded, captioned, and cut vertical for every platform."],
      ["Weekly Delivery", "Reels arrive on a steady cadence so your feed never goes quiet."],
    ],
  },
];

const ideas = [
  {
    pillar: "Education",
    lines: [
      "What $400K gets you in Minneapolis vs. the suburbs",
      "3 things first-time buyers get wrong in this market",
      "Should you list in winter? Here's the truth",
    ],
  },
  {
    pillar: "Storytelling",
    lines: ["Why I got into real estate", "The client who almost gave up on buying"],
  },
  {
    pillar: "Scroll-Stopper",
    lines: ["Rating Twin Cities neighborhoods in 30 seconds", "POV: you just got the keys"],
  },
  {
    pillar: "Community",
    lines: ["A Saturday in Northeast Minneapolis", "St. Paul's most underrated neighborhood"],
  },
];

const specialties = [
  "Buyers",
  "Sellers",
  "First-Time Buyers",
  "Investors",
  "Luxury",
  "Relocation",
  "New Construction",
];

const reels = [
  { title: "Personal Brand Intro", type: "Branding", src: "/videos/personal-brand-intro.mp4" },
  { title: "5509 Blaisdell Ave", type: "Listing", src: "/videos/5509-blaisdell-ave.mp4" },
  {
    title: "Rosemount",
    type: "Branding",
    src: "https://fn9qpleiatjb4gdq.public.blob.vercel-storage.com/Rosemount%20v2.mp4",
  },
  { title: "4858 Irving Ave S", type: "Listing", src: "/videos/4858-irving-ave-s.mp4" },
  { title: "509 Arlington Ave E", type: "Listing", src: "/videos/509-arlington-ave-e.mp4" },
  { title: "913 E 39th Street", type: "Listing", src: "/videos/913-e-39th-st.mp4" },
];

const forYou = [
  "You're great with clients, but nobody online knows it yet.",
  "You know content matters and constantly wonder what to post.",
  "You've filmed on your phone and it never looks or sounds like you.",
  "You want polished content without sounding robotic or scripted.",
  "You want to be the first call before someone even needs an agent.",
  "You're ready to show up consistently in the market you want to own.",
];

const notForYou = [
  "You only want the cheapest video you can find.",
  "You're not willing to get in front of the camera.",
  "You expect a handful of reels to replace your follow-up and relationships.",
];

const packages = [
  {
    id: "content-creator",
    name: "Content Creator",
    reels: "4 reels",
    price: "$1,400",
    save: "Save $596 vs. à la carte",
    shoot: "90-minute shooting session",
    includes: [
      "Brand discovery + scripting",
      "90-minute shooting session",
      "4 professionally edited reels",
      "One reel for each of the 4 pillars",
      "$350 per reel",
    ],
  },
  {
    id: "double-down",
    name: "Double Down",
    reels: "8 reels",
    price: "$2,800",
    save: "Save $1,192 vs. à la carte",
    badge: "Best Value",
    featured: true,
    includes: [
      "Brand discovery + scripting",
      "Half-day shoot",
      "8 professionally edited reels",
      "Two months of weekly content",
      "$350 per reel",
    ],
  },
  {
    id: "market-leader",
    name: "Market Leader",
    reels: "12 reels",
    price: "$4,200",
    save: "Save $1,788 vs. à la carte",
    includes: [
      "Brand discovery + scripting",
      "Full shoot day",
      "12 professionally edited reels",
      "Three months of weekly content",
      "Priority turnaround",
      "$350 per reel",
    ],
  },
];

const faqs = [
  {
    q: "Do I need to know what I want to be known for?",
    a: "No. That's what the brand discovery session is for. We'll work through your market, your best clients, and your strengths, then land on a clear position before anything gets scripted.",
  },
  {
    q: "What if I'm awkward on camera?",
    a: "Most agents feel that way before their first shoot. We direct every take, coach your delivery, and keep shooting until it sounds like you on a good day.",
  },
  {
    q: "Do I have to memorize scripts?",
    a: "No. We break talking points into short, natural lines and film them in pieces. You never have to deliver a long monologue in one take.",
  },
  {
    q: "Where do we shoot?",
    a: "Anywhere in the Twin Cities that fits your brand: a listing, your office, a coffee shop, or the neighborhood you want to own. We'll plan locations together during discovery.",
  },
  {
    q: "Can you also film my listings?",
    a: "Yes. Cinematic listing videos are our core work. Ask about pairing a listing film with your branding shoot so both go out with the same premium look.",
  },
  {
    q: "When do I get my reels?",
    a: "Reels are delivered on a weekly cadence after your shoot, so you always have something ready to post. Market Leader clients get priority turnaround.",
  },
  {
    q: "Can I start with a single reel?",
    a: "Yes. Individual reels are $499 each with their own shoot. Packages bring the price down to $350 per reel and include brand discovery and scripting.",
  },
  {
    q: "Do you post the content for me?",
    a: "Packages cover strategy, scripting, filming, and editing. If you'd like us to handle ongoing posting too, mention it on the form and we'll put together a plan.",
  },
];

const leadOptions = [
  "Content Creator (4 reels)",
  "Double Down (8 reels)",
  "Market Leader (12 reels)",
  "Single reel",
  "Not sure yet",
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AgentsLanding() {
  useReveal();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);

  const [lead, setLead] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    brokerage: "",
    lookingFor: leadOptions[0],
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, source: "agents-landing" }),
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

  const field = (key: keyof typeof lead) => ({
    value: lead[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setLead((prev) => ({ ...prev, [key]: e.target.value })),
  });

  const inputClass =
    "w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[#efcb6d]/60";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0a] font-sans text-white">
      {/* ── Nav ── */}
      <header
        className={`sticky top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-md transition ${
          scrolled ? "nav-glass" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="MAVN Creative" className="h-9 w-auto object-contain" />
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-semibold tracking-[0.16em]">MAVN Creative</p>
              <p className="text-[10px] tracking-[0.24em] text-[#efcb6d]">REAL ESTATE MEDIA</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a href="#how" className="nav-link">How It Works</a>
            <a href="#included" className="nav-link">What&apos;s Included</a>
            <a href="#work" className="nav-link">Work</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </nav>
          <a
            href="#offer"
            className="btn-press rounded-full bg-[#efcb6d] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-black sm:px-5"
          >
            Reserve My Shoot →
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,203,109,0.16),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 text-center lg:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#efcb6d]/30 bg-[#efcb6d]/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85 sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#efcb6d]" />
            For Twin Cities agents ready to be known
          </span>
          <h1 className="mx-auto mt-7 max-w-5xl text-[2.5rem] font-black uppercase leading-[1.08] tracking-tight sm:text-6xl lg:text-[5.5rem]">
            Become the agent
            <br />
            <Highlight>your market knows.</Highlight>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            A strategy-first content shoot that turns your expertise into cinematic reels, so buyers and
            sellers <strong className="text-white">trust you before they ever call.</strong>
          </p>

          <div className="mx-auto mt-9 grid max-w-xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
            {[
              ["Brand", "Discovery"],
              ["Scripted", "Reels"],
              ["Twin Cities", "Minnesota"],
            ].map(([a, b]) => (
              <div key={a} className="px-3 py-4">
                <p className="text-sm font-bold uppercase tracking-wide sm:text-base">{a}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-white/50">{b}</p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-col items-center gap-3">
            <CTA />
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">
              Packages from $350 per reel
            </p>
          </div>

          {/* Reel fan */}
          <div className="relative mx-auto mt-14 flex max-w-3xl items-end justify-center gap-3 sm:gap-5">
            <Reel
              src="/videos/5509-blaisdell-ave.mp4"
              className="hidden w-[30%] -rotate-3 opacity-80 sm:block"
            />
            <Reel
              src="/videos/personal-brand-intro.mp4"
              className="w-[58%] shadow-[0_30px_90px_rgba(239,203,109,0.18)] ring-[#efcb6d]/40 sm:w-[36%]"
            />
            <Reel
              src="/videos/913-e-39th-st.mp4"
              className="hidden w-[30%] rotate-3 opacity-80 sm:block"
            />
          </div>
        </div>

        {/* Proof strip */}
        <div className="border-y border-white/10 bg-black/60">
          <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4 px-5 py-6 text-center">
            {[
              ["50+", "Listings elevated"],
              ["Reels + MLS", "Built for both"],
              ["Weekly", "Content delivery"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="whitespace-nowrap text-base font-bold text-[#efcb6d] sm:text-2xl">{v}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/50 sm:text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pattern interrupt ── */}
      <section className="bg-[#f6f2e9] text-black">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
          <div className="anim max-w-3xl">
            <Eyebrow dark>The hard truth</Eyebrow>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[1] tracking-tight sm:text-5xl">
              Sellers don&apos;t hire the best agent.
              <br />
              <span className="text-[#a8821f]">They hire the one they already trust.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70">
              Before a homeowner ever calls you, they&apos;ve watched you, Googled you, and checked your
              social. Every week you&apos;re invisible online, listings go to agents who aren&apos;t
              better than you. Just more visible.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="anim rounded-3xl border border-black/10 bg-white p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-black/40">The invisible agent</p>
              <p className="mt-5 text-2xl font-semibold italic leading-snug text-black/70">
                &ldquo;Which agent was that again?&rdquo;
              </p>
              <ul className="mt-6 space-y-3 text-[15px] text-black/60">
                {[
                  "Competes on price and luck",
                  "Chases cold leads every month",
                  "Random posts when there's time",
                  "Forgotten the moment a deal closes",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="text-black/30">—</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="anim rounded-3xl bg-black p-7 text-white shadow-2xl sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#efcb6d]">The known agent</p>
              <p className="mt-5 text-2xl font-semibold italic leading-snug">
                &ldquo;You have to work with them.&rdquo;
              </p>
              <ul className="mt-6 space-y-3 text-[15px] text-white/85">
                {[
                  "Gets called first and referred often",
                  "Attracts inbound buyers and sellers",
                  "A clear point of view, every week",
                  "Top of mind in their market year-round",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="text-[#efcb6d]">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── The shift ── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-5 py-20 text-center lg:py-28">
          <div className="anim">
            <Eyebrow>The shift</Eyebrow>
            <h2 className="mt-5 text-4xl font-black uppercase leading-[1.02] tracking-tight sm:text-6xl">
              The goal isn&apos;t to post more.
              <br />
              <span className="text-[#efcb6d]">It&apos;s to be known for something.</span>
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/70">
              When you know your market and your message, you know exactly what to talk about, who it&apos;s
              for, and why people should remember you. Every reel has a job.
            </p>
          </div>
          <div className="anim mx-auto mt-12 grid max-w-3xl items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">From</p>
              <p className="mt-3 text-xl italic text-white/60">&ldquo;I should probably post something.&rdquo;</p>
            </div>
            <span className="text-2xl text-[#efcb6d]">→</span>
            <div className="rounded-2xl border border-[#efcb6d]/40 bg-[#efcb6d]/10 p-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#efcb6d]">To</p>
              <p className="mt-3 text-xl font-semibold italic">&ldquo;This is what I&apos;m known for.&rdquo;</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Framework ── */}
      <section className="border-y border-white/10 bg-[#0f0d09]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
          <div className="anim max-w-3xl">
            <Eyebrow>The MAVN content framework</Eyebrow>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[1] tracking-tight sm:text-5xl">
              Four types of video.
              <br />
              One recognizable brand.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/70">
              Every reel we make fits one of four jobs. Together they take someone from stranger to
              client.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {framework.map((f, i) => (
              <div
                key={f.title}
                className="anim card-lift rounded-3xl border border-white/10 bg-black p-7"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <p className="text-5xl font-black text-[#efcb6d]/25">0{i + 1}</p>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.24em] text-[#efcb6d]">
                  {f.tag}
                </p>
                <h3 className="mt-2 text-2xl font-bold">{f.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section id="how" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
          <div className="anim max-w-3xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[1] tracking-tight sm:text-5xl">
              One shoot.
              <br />
              <span className="text-[#efcb6d]">Built on a real strategy.</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((p) => (
              <div key={p.n} className="anim bg-[#0a0a0a] p-7 sm:p-8">
                <p className="font-mono text-sm text-[#efcb6d]">{p.n}</p>
                <h3 className="mt-4 text-2xl font-bold uppercase tracking-tight">{p.title}</h3>
                <p className="mt-3 font-semibold text-white/90">{p.lead}</p>
                <p className="mt-2 text-sm leading-6 text-white/60">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <CTA />
          </div>
        </div>
      </section>

      {/* ── What you walk away with ── */}
      <section id="included" className="scroll-mt-20 bg-[#f6f2e9] text-black">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
          <div className="anim max-w-3xl">
            <Eyebrow dark>What you walk away with</Eyebrow>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[1] tracking-tight sm:text-5xl">
              A personal brand system.
              <br />
              <span className="text-[#a8821f]">Not just a few videos.</span>
            </h2>
          </div>
          <div className="mt-12 space-y-5">
            {deliverables.map((d, i) => (
              <div
                key={d.phase}
                className="anim grid gap-6 rounded-3xl border border-black/10 bg-white p-7 sm:p-9 md:grid-cols-[220px_1fr]"
              >
                <div>
                  <p className="font-mono text-sm text-[#a8821f]">0{i + 1}</p>
                  <p className="mt-2 text-lg font-bold uppercase tracking-wide">{d.phase}</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {d.items.map(([t, b]) => (
                    <div key={t} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#efcb6d] text-xs font-bold text-black">
                        ✓
                      </span>
                      <div>
                        <p className="font-semibold">{t}</p>
                        <p className="mt-1 text-sm leading-6 text-black/60">{b}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ideas ── */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
          <div className="anim max-w-3xl">
            <Eyebrow>The content strategy</Eyebrow>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[1] tracking-tight sm:text-5xl">
              Picture the reels you&apos;d actually post.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/70">
              Every idea maps back to your market, your perspective, and your specialty, so you never
              post into the void again.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {ideas.map((g, i) => (
              <div key={g.pillar} className="anim rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#efcb6d]">
                  0{i + 1} · {g.pillar}
                </p>
                <ul className="mt-5 space-y-3">
                  {g.lines.map((l) => (
                    <li
                      key={l}
                      className="rounded-xl border border-white/10 bg-black px-4 py-3 text-[15px] font-medium"
                    >
                      &ldquo;{l}&rdquo;
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="anim mt-10">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Tailored to your specialty</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-[#efcb6d]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/85"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Work ── */}
      <section id="work" className="scroll-mt-20 bg-[#0f0d09]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
          <div className="anim flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <Eyebrow>The work</Eyebrow>
              <h2 className="mt-4 text-4xl font-black uppercase leading-[1] tracking-tight sm:text-5xl">
                Perception is pricing.
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/70">
                The quality of your content is what people assume about the quality of your service. This
                is the level we shoot at for every Twin Cities agent we work with.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Tap the speaker to unmute</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
            {reels.map((r) => (
              <Reel key={r.title} src={r.src} title={r.title} type={r.type} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
          <div className="anim max-w-3xl">
            <Eyebrow>Who this is for</Eyebrow>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[1] tracking-tight sm:text-5xl">
              Built for the agent who should be
              <span className="text-[#efcb6d]"> more recognizable than they are.</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="anim rounded-3xl border border-[#efcb6d]/30 bg-[#efcb6d]/[0.06] p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#efcb6d]">This is for you if</p>
              <ul className="mt-6 space-y-4">
                {forYou.map((t) => (
                  <li key={t} className="flex gap-3 text-[15px] leading-6">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#efcb6d] text-[10px] font-bold text-black">
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="anim rounded-3xl border border-white/10 bg-white/[0.02] p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">Probably not for you if</p>
              <ul className="mt-6 space-y-4">
                {notForYou.map((t) => (
                  <li key={t} className="flex gap-3 text-[15px] leading-6 text-white/65">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-white/20 text-[10px] text-white/50">
                      ✕
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rented vs owned ── */}
      <section className="bg-[#f6f2e9] text-black">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
          <div className="anim mx-auto max-w-3xl text-center">
            <Eyebrow dark>Renting vs. owning attention</Eyebrow>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[1] tracking-tight sm:text-5xl">
              Stop renting all of your attention.
            </h2>
            <p className="mt-6 text-lg leading-8 text-black/65">
              Portals, paid leads, and ads have their place. But the moment the spend stops, so does the
              attention. A personal brand builds recognition and trust that belongs to you.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="anim rounded-3xl border border-black/10 bg-white p-8">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-black/40">Rented attention</p>
              <ul className="mt-5 space-y-3 text-[15px] text-black/60">
                {[
                  "Disappears when the spend stops",
                  "The platform owns the lead",
                  "You compete beside every other agent on the page",
                  "Transactional from the first touch",
                ].map((t) => (
                  <li key={t} className="flex gap-3"><span className="text-black/30">—</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="anim rounded-3xl bg-black p-8 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#efcb6d]">Owned authority</p>
              <ul className="mt-5 space-y-3 text-[15px] text-white/85">
                {[
                  "Your name becomes the asset",
                  "Content compounds week after week",
                  "Trust starts before the first conversation",
                  "Past clients stay reminded to refer you",
                ].map((t) => (
                  <li key={t} className="flex gap-3"><span className="text-[#efcb6d]">✓</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="anim mt-12 grid gap-3 sm:grid-cols-4">
            {[
              ["Awareness", "New buyers find you on Reels, TikTok, or Shorts."],
              ["Interest", "They follow, binge, and feel like they know you."],
              ["Trust", "Consistent content makes you the expert."],
              ["Lead", "When they're ready, you're the only call."],
            ].map(([t, b], i) => (
              <div key={t} className="rounded-2xl border border-black/10 bg-white/70 p-5">
                <p className="font-mono text-xs text-[#a8821f]">0{i + 1}</p>
                <p className="mt-2 font-bold uppercase tracking-wide">{t}</p>
                <p className="mt-1 text-sm leading-6 text-black/60">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offer ── */}
      <section id="offer" className="relative scroll-mt-20 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,203,109,0.10),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
          <div className="anim mx-auto max-w-3xl text-center">
            <Eyebrow>The offer</Eyebrow>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[1] tracking-tight sm:text-6xl">
              Become the face
              <br />
              <Highlight>of your market.</Highlight>
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/70">
              Every package includes brand discovery and scripting. Pick how much content you want to
              walk away with.
            </p>
          </div>
          <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">
            {packages.map((p) => (
              <div
                key={p.id}
                className={`anim relative flex flex-col rounded-3xl p-8 ${
                  p.featured
                    ? "bg-[#efcb6d] text-black shadow-[0_30px_80px_rgba(239,203,109,0.25)] lg:-my-4 lg:py-12"
                    : "border border-white/12 bg-white/[0.03]"
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-3 left-8 rounded-full bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#efcb6d]">
                    {p.badge}
                  </span>
                )}
                <p className={`text-xs font-bold uppercase tracking-[0.24em] ${p.featured ? "text-black/60" : "text-[#efcb6d]"}`}>
                  {p.reels}
                </p>
                <h3 className="mt-2 text-2xl font-black uppercase tracking-tight">{p.name}</h3>
                <p className="mt-5 text-5xl font-black tracking-tight">{p.price}</p>
                <p className={`mt-2 text-sm ${p.featured ? "text-black/65" : "text-white/55"}`}>{p.save}</p>
                <ul className={`mt-7 flex-1 space-y-3 border-t pt-6 text-[15px] ${p.featured ? "border-black/15" : "border-white/10"}`}>
                  {p.includes.map((t) => (
                    <li key={t} className="flex gap-3">
                      <span className={p.featured ? "text-black" : "text-[#efcb6d]"}>✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <a
                  href={`/checkout?tier=${p.id}`}
                  className={`btn-press mt-8 block rounded-full px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.12em] ${
                    p.featured ? "bg-black text-[#efcb6d]" : "bg-[#efcb6d] text-black"
                  }`}
                >
                  Reserve — {p.price}
                </a>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-white/55">
            Want to test it first? Single reels are <span className="text-white">$499</span> with their own shoot.{" "}
            <a href="#apply" className="text-[#efcb6d] underline underline-offset-4">Request one below</a>.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="scroll-mt-20 border-t border-white/10 bg-[#0f0d09]">
        <div className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
          <div className="anim text-center">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl">Questions, answered.</h2>
          </div>
          <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-base font-semibold sm:text-lg">{f.q}</span>
                    <span
                      className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border text-lg transition ${
                        open ? "rotate-45 border-[#efcb6d] text-[#efcb6d]" : "border-white/20 text-white/60"
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}
                  >
                    <p className="overflow-hidden pr-12 leading-7 text-white/65">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Final CTA + form ── */}
      <section id="apply" className="relative scroll-mt-20 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(239,203,109,0.14),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div className="anim">
            <h2 className="text-4xl font-black uppercase leading-[1] tracking-tight sm:text-5xl">
              A year from now, someone in your market will be the agent everyone knows.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/70">
              The question is whether you&apos;re intentionally building toward that position.
            </p>
            <p className="mt-6 text-xl font-semibold text-[#efcb6d]">
              Pick your market. Tell your story. Become its face.
            </p>
            <div className="mt-10 space-y-3 text-sm text-white/70">
              <a href="mailto:contact@mavncreative.com" className="block transition hover:text-[#efcb6d]">
                contact@mavncreative.com
              </a>
              <a href="tel:6124883825" className="block transition hover:text-[#efcb6d]">
                (612) 488-3825
              </a>
            </div>
          </div>

          <div className="anim rounded-3xl border border-white/12 bg-white/[0.03] p-6 sm:p-8">
            {status === "success" ? (
              <div className="py-10 text-center">
                <p className="text-3xl font-black uppercase">You&apos;re in.</p>
                <p className="mt-4 leading-7 text-white/70">
                  Thanks, {lead.firstName}. We&apos;ll reach out shortly to set up your brand discovery
                  session.
                </p>
                <a href="#work" className="mt-6 inline-block text-sm text-[#efcb6d] underline underline-offset-4">
                  Watch more of our work
                </a>
              </div>
            ) : (
              <form onSubmit={submitLead}>
                <p className="text-lg font-bold uppercase tracking-wide">Start with a discovery call</p>
                <p className="mt-1 text-sm text-white/55">Tell us a bit about you and we&apos;ll be in touch.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <input required placeholder="First name" className={inputClass} {...field("firstName")} />
                  <input placeholder="Last name" className={inputClass} {...field("lastName")} />
                  <input required type="tel" placeholder="Phone" className={inputClass} {...field("phone")} />
                  <input required type="email" placeholder="Email" className={inputClass} {...field("email")} />
                  <input placeholder="Brokerage" className={`${inputClass} sm:col-span-2`} {...field("brokerage")} />
                  <select className={`${inputClass} sm:col-span-2`} {...field("lookingFor")}>
                    {leadOptions.map((o) => (
                      <option key={o} className="bg-black">{o}</option>
                    ))}
                  </select>
                </div>
                {status === "error" && <p className="mt-3 text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-press mt-5 w-full rounded-full bg-[#efcb6d] px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-black disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending…" : "Request My Discovery Call →"}
                </button>
                <p className="mt-4 text-[11px] leading-5 text-white/40">
                  By submitting you agree to be contacted by call, text, or email about your project. Message
                  and data rates may apply; reply STOP to opt out. See our{" "}
                  <a href="/privacy" className="underline">privacy policy</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} MAVN Creative · Twin Cities Real Estate Media ·{" "}
        <Link href="/" className="hover:text-white">mavncreative.com</Link> ·{" "}
        <a href="/privacy" className="hover:text-white">Privacy</a>
      </footer>
    </div>
  );
}

