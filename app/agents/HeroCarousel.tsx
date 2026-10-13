"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Slide = { src: string; title: string; type: string };

// Muted reels advance after this many seconds so the hero keeps moving;
// once a visitor unmutes, the current reel plays through to the end.
const MUTED_CAP_SECONDS = 12;
const SWIPE_THRESHOLD = 40;

// Position of slide i relative to the active one, wrapped so the carousel loops.
function offsetOf(i: number, active: number, n: number) {
  let d = i - active;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

function slideStyle(d: number): React.CSSProperties {
  const abs = Math.abs(d);
  const dir = Math.sign(d);
  if (abs === 0) return { transform: "translateX(0) scale(1)", opacity: 1, zIndex: 30 };
  if (abs === 1)
    return {
      transform: `translateX(${dir * 82}%) scale(0.78) rotate(${dir * 4}deg)`,
      opacity: 0.55,
      zIndex: 20,
    };
  return {
    transform: `translateX(${dir * 140}%) scale(0.6) rotate(${dir * 6}deg)`,
    opacity: 0,
    zIndex: 10,
    pointerEvents: "none",
  };
}

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const n = slides.length;
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(true);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);
  const swiped = useRef(false);

  const go = useCallback(
    (i: number) => {
      setProgress(0);
      setActive(((i % n) + n) % n);
    },
    [n]
  );
  const next = useCallback(() => go(active + 1), [go, active]);
  const prev = useCallback(() => go(active - 1), [go, active]);

  // Only the active reel plays; the rest rewind so they're ready when they come up.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && inView) {
        v.muted = muted;
        v.play().catch(() => {});
      } else {
        v.pause();
        if (i !== active) v.currentTime = 0;
      }
    });
  }, [active, inView, muted]);

  // Browsers pause video in background tabs; resume the active reel on return.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && inView) videos.current[active]?.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [active, inView]);

  // Pause everything while the hero is scrolled out of view.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onTimeUpdate = (i: number) => (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (i !== active) return;
    const v = e.currentTarget;
    const length = muted ? Math.min(v.duration || MUTED_CAP_SECONDS, MUTED_CAP_SECONDS) : v.duration;
    if (!length) return;
    setProgress(Math.min(v.currentTime / length, 1));
    if (muted && v.currentTime >= MUTED_CAP_SECONDS) next();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    swipeStart.current = e.clientX;
    swiped.current = false;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) >= SWIPE_THRESHOLD) swiped.current = true;
    if (dx <= -SWIPE_THRESHOLD) next();
    else if (dx >= SWIPE_THRESHOLD) prev();
  };

  const current = slides[active];

  return (
    <div className="relative mx-auto mt-14 max-w-3xl">
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeStart.current = null)}
        className="relative mx-auto aspect-[9/16] w-[58%] touch-pan-y select-none sm:w-[36%]"
      >
        {slides.map((s, i) => {
          const d = offsetOf(i, active, n);
          const isActive = d === 0;
          return (
            <div
              key={s.src}
              onClick={() => !isActive && !swiped.current && go(i)}
              style={slideStyle(d)}
              className={`absolute inset-0 overflow-hidden rounded-2xl bg-[#111] ring-1 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive
                  ? "shadow-[0_30px_90px_rgba(239,203,109,0.18)] ring-[#efcb6d]/40"
                  : "cursor-pointer ring-white/10"
              }`}
            >
              <video
                ref={(el) => {
                  videos.current[i] = el;
                }}
                muted
                playsInline
                preload={Math.abs(d) <= 1 ? "auto" : "metadata"}
                onTimeUpdate={onTimeUpdate(i)}
                onEnded={() => isActive && next()}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              >
                <source src={s.src} type="video/mp4" />
              </video>

              {isActive && (
                <>
                  <div className="absolute inset-x-3 top-3 h-[3px] overflow-hidden rounded-full bg-white/25">
                    <div
                      className="h-full rounded-full bg-[#efcb6d] transition-[width] duration-200 ease-linear"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 text-left">
                    <p className="text-[9px] uppercase tracking-[0.22em] text-[#efcb6d]">{s.type}</p>
                    <p className="mt-0.5 text-sm font-medium leading-tight text-white">{s.title}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMuted((m) => !m);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    aria-label={muted ? "Unmute" : "Mute"}
                    className="absolute right-2.5 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/75"
                  >
                    {muted ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                    )}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="relative z-40 mt-7 flex items-center justify-center gap-5">
        <button
          onClick={prev}
          aria-label="Previous reel"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-[#efcb6d]/50 hover:text-white"
        >
          ←
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Hero reels">
          {slides.map((s, i) => (
            <button
              key={s.src}
              onClick={() => go(i)}
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${s.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-[#efcb6d]" : "w-1.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next reel"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-[#efcb6d]/50 hover:text-white"
        >
          →
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        Now playing: {current.title}
      </p>
    </div>
  );
}
