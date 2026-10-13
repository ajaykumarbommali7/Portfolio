"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE, PROJECTS } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

export default function About({ index }: { index: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const lastPointer = useRef<string>("mouse");

  // Damped pendulum: pointer velocity kicks the angle, a spring pulls it back,
  // and a slow idle sway takes over when nothing is happening.
  useEffect(() => {
    const section = sectionRef.current;
    const swing = swingRef.current;
    if (!section || !swing || prefersReducedMotion()) return;

    let angle = 0;
    let vel = 0;
    let lastX: number | null = null;
    let lastT = 0;
    let lastInput = 0;
    let raf = 0;
    let running = false;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null && now - lastT < 100) {
        const vx = (e.clientX - lastX) / Math.max(1, now - lastT); // px per ms
        vel += Math.max(-0.9, Math.min(0.9, vx * 0.35));
      }
      lastX = e.clientX;
      lastT = now;
      lastInput = now;
    };

    const step = (t: number) => {
      const idle = t - lastInput > 1400;
      const target = idle ? Math.sin(t / 1300) * 1.6 : 0;
      vel += (target - angle) * 0.018; // spring
      vel *= 0.94; // damping
      angle += vel;
      angle = Math.max(-24, Math.min(24, angle));
      swing.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(step);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(section);
    section.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onMove);
    };
  }, []);

  const strapText = `${PROFILE.name} · ${PROFILE.role} · `;
  const barcode = barcodeFrom(PROFILE.name + PROFILE.gradYear);

  return (
    <section ref={sectionRef} id="about" className="section about section-lazy" aria-labelledby="about-title">
      <style>{css}</style>
      <div className="wrap about-grid">
        {/* left */}
        <div className="about-left">
          <p className="tag rv">{index} — About</p>
          <h2 id="about-title" className="h-sec mt-5">
            <span className="rv-mask">
              <span>
                Hi, I&apos;m <span className="serif">{PROFILE.firstName}.</span>
              </span>
            </span>
          </h2>
          <p className="about-summary rv" style={{ "--i": 1 } as React.CSSProperties}>
            {PROFILE.resumeSummary}
          </p>
          <p className="about-line rv" style={{ "--i": 2 } as React.CSSProperties}>
            {PROFILE.aboutLine}
          </p>
          <div className="about-btns rv" style={{ "--i": 3 } as React.CSSProperties}>
            <a href={PROFILE.resume} download className="btn btn-primary">
              Résumé <span aria-hidden>↓</span>
            </a>
            {PROFILE.github && (
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                GitHub <span aria-hidden>↗</span>
              </a>
            )}
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              LinkedIn <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        {/* centre: lanyard */}
        <div className="about-centre">
          <div ref={swingRef} className="lanyard">
            <div className="strap" aria-hidden>
              <div className="strap-text">
                <span>{strapText.repeat(3)}</span>
                <span>{strapText.repeat(3)}</span>
              </div>
            </div>
            <div className="clip" aria-hidden>
              <span />
            </div>
            <div
              className={`idcard ${flipped ? "is-flipped" : ""}`}
              role="group"
              tabIndex={0}
              aria-roledescription="flip card"
              aria-label={`Developer ID card, ${flipped ? "back" : "front"} side. Press Enter to flip.`}
              data-flipped={flipped}
              onPointerDown={(e) => (lastPointer.current = e.pointerType)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setFlipped(true)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setFlipped(false)}
              onClick={() => lastPointer.current !== "mouse" && setFlipped((f) => !f)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFlipped((f) => !f);
                }
              }}
            >
              <div className="idcard-inner">
                {/* front */}
                <div className="idface idfront">
                  <div className="idband">
                    <span className="slot" aria-hidden />
                    <span className="mono">DEVELOPER ID</span>
                  </div>
                  <div className="idphoto">
                    <div className="idphoto-ring">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/portrait-bust.webp" alt={`Portrait of ${PROFILE.name}`} width={480} height={600} />
                    </div>
                  </div>
                  <p className="idname">{PROFILE.name}</p>
                  <p className="idrole">{PROFILE.role}</p>
                  <dl className="idrows mono">
                    <div>
                      <dt>ID No.</dt>
                      <dd>
                        {PROFILE.initials}B-{PROFILE.gradYear}
                      </dd>
                    </div>
                    <div>
                      <dt>Dept.</dt>
                      <dd>Full Stack</dd>
                    </div>
                    <div>
                      <dt>Batch</dt>
                      <dd>{PROFILE.gradYear}</dd>
                    </div>
                  </dl>
                  <div className="idfoot" aria-hidden>
                    <div className="barcode">
                      {barcode.map((w, i) => (
                        <i key={i} style={{ width: w }} />
                      ))}
                    </div>
                    <div className="holo" />
                  </div>
                </div>

                {/* back */}
                <div className="idface idback">
                  <div className="idband">
                    <span className="slot" aria-hidden />
                    <span className="mono">WHAT I AM</span>
                  </div>
                  <ul className="idfacts">
                    <li>
                      {PROFILE.role} · {PROFILE.experience}
                    </li>
                    <li>
                      {PROFILE.degreeShort}, {PROFILE.gradYear}
                    </li>
                    <li>Angular · TypeScript · .NET Core · SQL Server</li>
                    <li>{PROJECTS.map((p) => p.short).join(" · ")}</li>
                    <li>IIS deployment on Windows Server</li>
                  </ul>
                  <div className="idsign">
                    <span className="serif">{PROFILE.name}</span>
                    <small className="mono">Signature</small>
                  </div>
                  <p className="idfound mono">
                    If found, say hello · <span>{PROFILE.email}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="about-hint mono" aria-hidden>
            Hover or tap the card to flip
          </p>
        </div>

        {/* right */}
        <aside className="about-right" aria-label="Quick facts">
          <p className="tag rv">Quick facts</p>
          <dl className="facts">
            {[
              ["Location", PROFILE.location],
              ["Education", PROFILE.education],
              ["Current role", PROFILE.currentRole],
              ["Email", PROFILE.email],
            ].map(([k, v], i) => (
              <div key={k} className="rv" style={{ "--i": i + 1 } as React.CSSProperties}>
                <dt className="mono">{k}</dt>
                <dd>{k === "Email" ? <a href={`mailto:${v}`}>{v}</a> : v}</dd>
              </div>
            ))}
          </dl>
          <blockquote className="about-quote rv" style={{ "--i": 5 } as React.CSSProperties}>
            <p>
              “{PROFILE.quote}”
            </p>
          </blockquote>
        </aside>
      </div>
    </section>
  );
}

/** Deterministic bar widths from a string, so the barcode is stable across renders. */
function barcodeFrom(s: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < 34; i++) out.push(1 + ((s.charCodeAt(i % s.length) * (i + 7)) % 4));
  return out;
}

const css = `
.about{overflow:hidden}
.about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,3.4vw,56px);align-items:stretch}
.about-left,.about-right{display:flex;flex-direction:column}
.about-summary{margin-top:28px;font-size:16px;line-height:1.62;color:var(--ink-2)}
.about-line{margin-top:16px;font-size:15px;line-height:1.55;color:var(--mute)}
.about-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:auto;padding-top:32px}

.about-centre{position:relative;display:flex;flex-direction:column;align-items:center;margin-top:calc(var(--section-y) * -1);min-height:640px}
.lanyard{position:relative;display:flex;flex-direction:column;align-items:center;transform-origin:50% 0;will-change:transform}
.strap{position:relative;width:30px;height:calc(var(--section-y) + 56px);overflow:hidden;background:var(--ink);
  box-shadow:inset 6px 0 8px -6px rgba(255,255,255,.25),inset -6px 0 8px -6px rgba(0,0,0,.6)}
.strap-text{position:absolute;left:50%;top:0;display:flex;flex-direction:column;transform:translateX(-50%);
  animation:strapScroll 22s linear infinite}
.strap-text span{writing-mode:vertical-rl;white-space:nowrap;font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;
  text-transform:uppercase;color:rgba(255,255,255,.75);padding-block:4px}
@keyframes strapScroll{to{transform:translate(-50%,-50%)}}
.clip{position:relative;width:40px;height:30px;margin-top:-4px;border-radius:6px 6px 10px 10px;
  background:linear-gradient(180deg,#d9d7d3,#9d9b97 45%,#e6e4e0 70%,#8d8b87);box-shadow:0 2px 3px rgba(0,0,0,.25)}
.clip span{position:absolute;left:50%;bottom:-10px;width:14px;height:16px;transform:translateX(-50%);border-radius:0 0 7px 7px;
  border:3px solid #a3a19d;border-top:0}

.idcard{position:relative;width:300px;height:404px;margin-top:4px;perspective:1400px;cursor:pointer;outline-offset:6px;border-radius:24px}
.idcard-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 1s var(--ease)}
.idcard.is-flipped .idcard-inner{transform:rotateY(180deg)}
.idface{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;border-radius:24px;background:#fff;overflow:hidden;
  backface-visibility:hidden;-webkit-backface-visibility:hidden;box-shadow:var(--hairline),var(--lift)}
.idback{transform:rotateY(180deg);align-items:stretch}
.idband{position:relative;width:100%;height:54px;flex:none;display:flex;align-items:flex-end;justify-content:center;padding-bottom:10px;
  background:var(--ink);color:#fff;font-size:11px;letter-spacing:.32em}
.slot{position:absolute;top:10px;left:50%;width:46px;height:8px;transform:translateX(-50%);border-radius:99px;background:var(--paper);
  box-shadow:inset 0 1px 2px rgba(0,0,0,.45)}
.idphoto{position:relative;margin-top:18px}
.idphoto::before{content:"";position:absolute;inset:-18px;border-radius:50%;background:radial-gradient(closest-side,rgba(13,13,13,.09),transparent);z-index:0}
.idphoto-ring{position:relative;z-index:1;width:128px;height:156px;padding:3px;border-radius:18px;
  background:linear-gradient(150deg,#e9e6e0,#8f8d88 50%,#e9e6e0);overflow:hidden}
.idphoto-ring img{width:100%;height:100%;object-fit:cover;object-position:50% 18%;border-radius:15px;background:#fff;
  transition:transform .9s var(--ease)}
.idcard:hover .idphoto-ring img,.idcard:focus-visible .idphoto-ring img{transform:scale(1.08)}
.idname{margin-top:14px;font-weight:700;font-size:19px;letter-spacing:-.03em}
.idrole{font-size:13px;color:var(--mute);margin-top:2px}
.idrows{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;width:calc(100% - 40px);margin-top:14px;padding-top:12px;border-top:1px dashed var(--line)}
.idrows div{text-align:center}
.idrows dt{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
.idrows dd{font-size:11.5px;margin-top:3px;color:var(--ink)}
.idfoot{display:flex;align-items:center;justify-content:space-between;width:calc(100% - 40px);margin-top:auto;padding-bottom:16px}
.barcode{display:flex;align-items:stretch;gap:2px;height:28px}
.barcode i{display:block;background:var(--ink)}
.holo{width:36px;height:36px;border-radius:50%;background:conic-gradient(from 0deg,#f4f2ee,#bdbab4,#fff,#8f8d88,#e9e6e0,#a9a6a0,#f4f2ee);
  box-shadow:inset 0 0 0 1px rgba(13,13,13,.12);animation:holo 6s linear infinite}
@keyframes holo{to{transform:rotate(1turn)}}
.idfacts{list-style:none;margin:22px 22px 0;padding:0;display:grid;gap:10px}
.idfacts li{position:relative;padding-left:16px;font-size:13.5px;line-height:1.4;color:var(--ink-2)}
.idfacts li::before{content:"";position:absolute;left:0;top:.5em;width:6px;height:6px;border-radius:2px;background:var(--ink)}
.idsign{margin:auto 22px 0;padding-top:10px;border-top:1px solid var(--ink)}
.idsign .serif{display:block;margin-top:-34px;font-size:28px;color:var(--ink);transform:rotate(-4deg);transform-origin:0 100%}
.idsign small{display:block;margin-top:6px;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
.idfound{margin:12px 22px 18px;font-size:10px;line-height:1.5;color:var(--mute);word-break:break-all}
.about-hint{margin-top:22px;font-size:11px;color:var(--mute);letter-spacing:.04em}

.facts{margin-top:22px;border-top:1px solid var(--line)}
.facts>div{display:grid;gap:4px;padding:16px 0;border-bottom:1px solid var(--line)}
.facts dt{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.facts dd{font-size:15.5px;line-height:1.4;font-weight:500;overflow-wrap:anywhere}
.facts dd a{text-decoration:underline;text-decoration-color:var(--faint);text-underline-offset:3px}
.facts dd a:hover{text-decoration-color:var(--ink)}
.about-quote{margin:auto 0 0;padding-top:32px}
.about-quote p{font-family:var(--font-serif);font-style:italic;font-size:clamp(24px,2.2vw,32px);line-height:1.15;color:var(--ink-2);letter-spacing:-.01em}

@media (max-width:1080px){
  .about-grid{grid-template-columns:minmax(0,1fr) 320px}
  .about-right{grid-column:1 / -1}
  .about-centre{grid-row:1 / span 1;grid-column:2}
  .facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:24px}
}
@media (max-width:760px){
  .about-grid{grid-template-columns:minmax(0,1fr)}
  .about-centre{grid-column:auto;grid-row:auto;margin-top:12px;min-height:0;order:2}
  .about-left{order:1}
  .about-right{order:3}
  .strap{height:96px}
  .about-btns{margin-top:0}
  .facts{grid-template-columns:minmax(0,1fr)}
}
`;
