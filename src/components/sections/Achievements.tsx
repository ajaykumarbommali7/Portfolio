"use client";

import { useEffect, useRef } from "react";
import { ACHIEVEMENTS } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import TechLogo, { BRAND } from "../ui/TechLogo";

/** Pinned horizontal gallery. Only rendered when the résumé lists achievements. */
export default function Achievements({ index }: { index: string }) {
  const outerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;
    const reduced = prefersReducedMotion();
    let travel = 0;
    let raf = 0;
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".ach-card"));
    const counted = new Set<HTMLElement>();

    const count = (card: HTMLElement) => {
      if (counted.has(card)) return;
      counted.add(card);
      const el = card.querySelector<HTMLElement>("[data-to]");
      if (!el) return;
      const to = Number(el.dataset.to);
      if (reduced) {
        el.textContent = String(to);
        return;
      }
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 4)))); // easeOutQuart
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const update = () => {
      raf = 0;
      const r = outer.getBoundingClientRect();
      const p = travel ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
      track.style.transform = `translate3d(${-p * travel}px,0,0)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      const mid = window.innerWidth / 2;
      let best: HTMLElement | null = null;
      let bestD = Infinity;
      for (const c of cards) {
        const b = c.getBoundingClientRect();
        if (b.left < window.innerWidth && b.right > 0 && r.top < window.innerHeight && r.bottom > 0) count(c);
        const d = Math.abs(b.left + b.width / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      cards.forEach((c) => c.classList.toggle("is-near", c === best));
    };

    const measure = () => {
      travel = Math.max(0, track.scrollWidth - window.innerWidth);
      outer.style.height = `${window.innerHeight + travel}px`;
      update();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={outerRef} id="achievements" className="ach" aria-labelledby="ach-title">
      <style>{css}</style>
      <div className="ach-pin">
        <div className="wrap ach-head">
          <div>
            <p className="tag">{index} — Achievements</p>
            <h2 id="ach-title" className="h-sec mt-4">
              Numbers worth <span className="serif">counting.</span>
            </h2>
          </div>
          <div className="ach-bar" aria-hidden>
            <div ref={barRef} />
          </div>
        </div>
        <div ref={trackRef} className="ach-track">
          {ACHIEVEMENTS.map((a, i) => (
            <article
              key={a.label}
              className="ach-card"
              style={{ "--tint": BRAND[a.logo]?.tint ?? "#0d0d0d" } as React.CSSProperties}
            >
              <div className="ach-top">
                <div className="ach-logo">
                  <TechLogo name={a.label} logo={a.logo} size={40} />
                </div>
                <span className="mono">
                  {String(i + 1).padStart(2, "0")} / {String(ACHIEVEMENTS.length).padStart(2, "0")}
                </span>
              </div>
              <div className="ach-bottom">
                <div>
                  <h3>{a.label}</h3>
                  <p>{a.caption}</p>
                  <p className="mono">{a.detail}</p>
                </div>
                <p className="ach-num" aria-label={`${a.value}${a.suffix ?? ""}`}>
                  <span data-to={a.value}>0</span>
                  {a.suffix}
                </p>
              </div>
            </article>
          ))}
          <p className="ach-end">and counting →</p>
        </div>
      </div>
    </section>
  );
}

const css = `
.ach{position:relative}
.ach-pin{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:40px;overflow:hidden}
.ach-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px}
.ach-bar{width:160px;height:2px;background:var(--soft)}
.ach-bar>div{height:100%;background:var(--ink);transform-origin:left;transform:scaleX(0)}
.ach-track{display:flex;gap:20px;padding-inline:var(--gutter);width:max-content;will-change:transform}
.ach-card{display:flex;flex-direction:column;justify-content:space-between;width:clamp(340px,40vw,540px);height:clamp(260px,36vh,310px);
  padding:24px;border-radius:28px;background:#fff;box-shadow:var(--hairline);transition:transform .7s var(--ease),box-shadow .7s var(--ease)}
.ach-card.is-near{transform:translateY(-12px);box-shadow:var(--hairline),var(--lift)}
.ach-top{display:flex;justify-content:space-between;align-items:flex-start}
.ach-top .mono{font-size:12px;color:var(--mute)}
.ach-logo{position:relative;display:grid;place-items:center;width:72px;height:72px;border-radius:20px;background:var(--paper)}
.ach-logo::before{content:"";position:absolute;inset:-8px;border-radius:28px;background:radial-gradient(closest-side,var(--tint),transparent);opacity:.12;transition:opacity .6s}
.ach-card.is-near .ach-logo::before{opacity:.3}
.ach-logo>*{position:relative}
.ach-bottom{display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
.ach-bottom h3{font-weight:700;font-size:20px;letter-spacing:-.03em}
.ach-bottom p{font-size:14px;color:var(--ink-2);margin-top:4px}
.ach-bottom .mono{font-size:11px;color:var(--mute)}
.ach-num{font-weight:700;font-size:clamp(56px,7vw,104px);letter-spacing:-.06em;line-height:.85}
.ach-end{align-self:center;padding:0 10vw 0 24px;font-family:var(--font-serif);font-style:italic;font-size:36px;color:var(--mute);white-space:nowrap}
@media (max-width:640px){.ach-card{width:min(340px,82vw)}}
`;
