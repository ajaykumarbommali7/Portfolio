"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

const LINES = ["Let's build", "something together."];

export default function Contact({ index }: { index: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const t = document.createElement("textarea");
      t.value = PROFILE.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hop = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    if (el.classList.contains("hop")) return;
    el.classList.add("hop");
    el.addEventListener("animationend", () => el.classList.remove("hop"), { once: true });
  };

  const badge = "say hello · say hello · say hello · ";

  return (
    <section id="contact" className="section contact section-lazy" aria-labelledby="contact-title">
      <style>{css}</style>
      <div className="wrap">
        <p className="tag rv">{index} — Contact</p>
        <h2 id="contact-title" className="contact-h" aria-label="Let's build something together.">
          {LINES.map((line, li) => (
            <span key={li} className="rv-mask" style={{ "--i": li } as React.CSSProperties} aria-hidden>
              <span className={li === 1 ? "serif-line" : ""}>
                {line.split(" ").map((word, wi) => (
                  <span key={wi} className="word">
                    {word.split("").map((c, ci) => (
                      <span key={ci} className="ch" onPointerEnter={hop}>
                        {c}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h2>

        <div className="contact-grid">
          <div className="contact-main">
            <p className="contact-label mono rv">Write to me</p>
            <div className="contact-mail rv" style={{ "--i": 1 } as React.CSSProperties}>
              <a href={`mailto:${PROFILE.email}`} className="contact-email">
                {PROFILE.email}
              </a>
              <button type="button" className={`copy ${copied ? "is-done" : ""}`} onClick={copy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>
            <ul className="contact-links rv" style={{ "--i": 2 } as React.CSSProperties}>
              <li>
                <span className="mono">Phone</span>
                <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
              </li>
              {PROFILE.github && (
                <li>
                  <span className="mono">GitHub</span>
                  <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                    GitHub ↗
                  </a>
                </li>
              )}
              <li>
                <span className="mono">LinkedIn</span>
                <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
                  ajay-kumar-bommali ↗
                </a>
              </li>
              <li>
                <span className="mono">Based in</span>
                <span>{PROFILE.location}</span>
              </li>
            </ul>
          </div>

          <a href={`mailto:${PROFILE.email}`} className="badge" aria-hidden tabIndex={-1}>
            <svg viewBox="0 0 200 200" aria-hidden>
              <defs>
                <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text>
                <textPath href="#badge-circle" textLength="488">
                  {badge}
                </textPath>
              </text>
            </svg>
            <span className="badge-core" aria-hidden>
              ↗
            </span>
          </a>
        </div>
      </div>

      <footer className="footer wrap">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
        <p className="mono">Built with Next.js</p>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget(0);
          }}
        >
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}

const css = `
.contact{padding-bottom:0}
.contact-h{margin-top:24px;font-weight:700;letter-spacing:-.055em;line-height:.95;font-size:clamp(46px,9.6vw,150px)}
.contact-h .serif-line{font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-.03em;color:var(--mute)}
.contact-h .word{display:inline-block;white-space:nowrap;margin-right:.24em}
.contact-h .ch{display:inline-block}
.contact-h .ch.hop{animation:hop .6s var(--ease)}
@keyframes hop{0%{transform:none}35%{transform:translateY(-.16em)}65%{transform:translateY(.03em)}100%{transform:none}}
.contact-grid{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;margin-top:clamp(48px,8vh,96px)}
.contact-main{min-width:0;flex:1}
.contact-label{font-size:12px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em}
.contact-mail{display:flex;align-items:center;flex-wrap:wrap;gap:14px 18px;margin-top:12px}
.contact-email{font-size:clamp(22px,3.6vw,52px);font-weight:600;letter-spacing:-.04em;text-decoration:underline;text-decoration-thickness:2px;
  text-underline-offset:.16em;text-decoration-color:var(--faint);transition:text-decoration-color .4s var(--ease);overflow-wrap:anywhere}
.contact-email:hover{text-decoration-color:var(--ink)}
.copy{height:36px;padding:0 16px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.22);
  transition:background .4s var(--ease),color .4s var(--ease)}
.copy:hover,.copy.is-done{background:var(--ink);color:#fff}
.contact-links{list-style:none;margin:36px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0 24px;border-top:1px solid var(--line)}
.contact-links li{display:grid;gap:4px;padding:16px 0;border-bottom:1px solid var(--line)}
.contact-links .mono{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute)}
.contact-links a,.contact-links li>span:last-child{font-size:16px;font-weight:500}
.contact-links a:hover{text-decoration:underline;text-underline-offset:4px}
.badge{position:relative;flex:none;display:grid;place-items:center;width:clamp(132px,13vw,180px);aspect-ratio:1;border-radius:50%}
.badge svg{position:absolute;inset:0;width:100%;height:100%;animation:spin 18s linear infinite}
.badge text{font-family:var(--font-mono);font-size:15px;letter-spacing:.1em;text-transform:uppercase;fill:var(--ink)}
.badge-core{display:grid;place-items:center;width:46%;aspect-ratio:1;border-radius:50%;background:var(--ink);color:#fff;font-size:26px;
  transition:transform .6s var(--ease)}
.badge:hover .badge-core{transform:rotate(45deg) scale(1.06)}
@keyframes spin{to{transform:rotate(1turn)}}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.footer{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-top:clamp(80px,12vh,140px);
  padding-top:24px;padding-bottom:28px;border-top:1px solid var(--line);font-size:13.5px;color:var(--mute)}
.footer .mono{font-size:12px}
.footer a{color:var(--ink);font-weight:500}
.footer a:hover{text-decoration:underline;text-underline-offset:4px}
@media (max-width:760px){
  .contact-grid{flex-direction:column;align-items:flex-start}
  .badge{align-self:flex-end}
}
`;
