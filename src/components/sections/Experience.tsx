"use client";

import { useRef } from "react";
import { EDUCATION, EXPERIENCE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";

// chronological: education first, then experience in résumé date order
const STOPS = [...EDUCATION, ...EXPERIENCE];

export default function Experience({ index }: { index: string }) {
  const spineRef = useRef<HTMLDivElement>(null);
  const stopRefs = useRef<(HTMLLIElement | null)[]>([]);

  const listRef = useScrollProgress<HTMLOListElement>(
    (p, el) => {
      spineRef.current?.style.setProperty("transform", `scaleY(${p})`);
      const reach = p * el.offsetHeight;
      stopRefs.current.forEach((s) => s?.classList.toggle("is-lit", !!s && s.offsetTop + 14 <= reach + 1));
    },
    { start: 0.62, end: 0.62 },
  );

  return (
    <section id="experience" className="section exp section-lazy" aria-labelledby="exp-title">
      <style>{css}</style>
      <div className="wrap exp-grid">
        <SectionHead
          index={index}
          label="Experience"
          id="exp-title"
          title="Education & experience, one"
          accent="path."
          className="exp-head"
        />

        <ol ref={listRef} className="tl">
          <li className="tl-track" aria-hidden role="presentation">
            <div ref={spineRef} className="tl-spine" />
          </li>
          {STOPS.map((s, i) => (
            <li key={i} ref={(el) => void (stopRefs.current[i] = el)} className="tl-stop">
              <span className="tl-dot" aria-hidden />
              <p className="tl-year mono">{s.year}</p>
              <div className="tl-card">
                <p className="tl-kind mono">{s.kind === "education" ? "Education" : "Experience"}</p>
                <h3 className="tl-title">{s.title}</h3>
                <p className="tl-place">{s.place}</p>
                <p className="tl-detail">{s.detail}</p>
              </div>
            </li>
          ))}
          <li ref={(el) => void (stopRefs.current[STOPS.length] = el)} className="tl-stop tl-next">
            <span className="tl-dot" aria-hidden />
            <p className="tl-year mono">Next</p>
            <div className="tl-card">
              <h3 className="tl-title">
                Your team<span className="serif">?</span>
              </h3>
              <a href="#contact" className="tl-link">
                Let&apos;s talk <span aria-hidden>→</span>
              </a>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}

const css = `
.exp-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,6vw,96px);align-items:start}
.exp-head{position:sticky;top:120px}
.tl{position:relative;list-style:none;margin:0;padding:0 0 0 0}
.tl-track{position:absolute;left:180px;top:14px;bottom:28px;width:2px;background:var(--soft);border-radius:2px}
.tl-spine{position:absolute;inset:0;background:var(--ink);transform-origin:top;transform:scaleY(0);border-radius:2px}
.tl-stop{position:relative;display:grid;grid-template-columns:150px minmax(0,1fr);gap:60px;padding-bottom:56px}
.tl-dot{position:absolute;left:174px;top:8px;width:14px;height:14px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--faint);
  transition:background .5s var(--ease),box-shadow .5s var(--ease),transform .6s var(--ease)}
.tl-year{padding-top:4px;text-align:right;font-size:13px;color:var(--mute);transition:color .5s var(--ease)}
.tl-card{transform:translateX(10px);transition:transform .9s var(--ease)}
.tl-title{transition:color .6s var(--ease)}
.tl-stop:not(.is-lit) .tl-title{color:var(--mute)}
.tl-kind{font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.tl-title{margin-top:6px;font-size:clamp(22px,2.2vw,30px);font-weight:700;letter-spacing:-.035em;line-height:1.1}
.tl-place{margin-top:6px;font-size:15px;font-weight:500;color:var(--ink-2)}
.tl-detail{margin-top:10px;font-size:14.5px;line-height:1.55;color:var(--mute);max-width:52ch}
.tl-stop.is-lit .tl-dot{background:var(--ink);box-shadow:0 0 0 5px rgba(13,13,13,.08);transform:scale(1.1)}
.tl-stop.is-lit .tl-year{color:var(--ink)}
.tl-stop.is-lit .tl-card{transform:none}
.tl-next{padding-bottom:0}
.tl-next .tl-card{padding:24px 26px;border-radius:24px;border:1.5px dashed rgba(13,13,13,.25)}
.tl-next .tl-title{margin-top:0}
.tl-link{display:inline-block;margin-top:10px;font-weight:500;text-decoration:underline;text-underline-offset:4px;text-decoration-color:var(--faint)}
.tl-link:hover{text-decoration-color:var(--ink)}
@media (max-width:900px){
  .exp-grid{grid-template-columns:minmax(0,1fr)}
  .exp-head{position:relative;top:0}
  .tl-track{left:6px}
  .tl-dot{left:0}
  .tl-stop{grid-template-columns:minmax(0,1fr);gap:8px;padding-left:36px;padding-bottom:44px}
  .tl-year{text-align:left;padding-top:0}
}
@media (prefers-reduced-motion:reduce){
  .tl-spine{transform:none!important}
  .tl-card{transform:none}
}
`;
