"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

/**
 * Talking hero. The clip is a seamless loop (see scripts/build-hero-assets.py),
 * blended into the paper with mix-blend-mode: multiply.
 *
 * Sound: try to play with sound; if the browser blocks it, play muted and unlock
 * on the first pointerdown / keydown / touchend. The video pauses whenever less
 * than 35 % of the hero is visible, so the voice stops as soon as you scroll on.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const userMuted = useRef(false);
  const visible = useRef(true);

  useEffect(() => {
    const v = videoRef.current;
    const section = sectionRef.current;
    if (!v || !section) return;
    v.defaultMuted = true;

    const sync = () => setSoundOn(!v.muted && !v.paused);

    const start = async () => {
      if (!visible.current) return;
      v.muted = userMuted.current;
      try {
        await v.play();
        setBlocked(false);
      } catch {
        v.muted = true;
        setBlocked(!userMuted.current);
        try {
          await v.play();
        } catch {
          /* autoplay fully disabled — the button still works */
        }
      }
      sync();
    };

    const unlock = (e: Event) => {
      if (btnRef.current?.contains(e.target as Node)) return; // the button handles itself
      remove();
      if (userMuted.current || !v.muted) return;
      v.muted = false;
      setBlocked(false);
      if (visible.current) v.play().catch(() => {});
      sync();
    };
    const events = ["pointerdown", "keydown", "touchend"] as const;
    const remove = () => events.forEach((ev) => window.removeEventListener(ev, unlock, true));
    events.forEach((ev) => window.addEventListener(ev, unlock, { capture: true, passive: true }));

    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.intersectionRatio >= 0.35;
        if (visible.current) {
          if (v.paused) v.play().catch(() => {});
        } else if (!v.paused) v.pause();
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(section);

    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    v.addEventListener("volumechange", sync);
    start();

    return () => {
      remove();
      io.disconnect();
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
      v.removeEventListener("volumechange", sync);
    };
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const turnOn = v.muted || v.paused;
    userMuted.current = !turnOn;
    v.muted = !turnOn;
    setBlocked(false);
    if (turnOn) v.play().catch(() => {});
  };

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget(id);
  };

  return (
    <section ref={sectionRef} id="top" className="hero" aria-labelledby="hero-title">
      <style>{css}</style>

      <p className="hero-ghost" aria-hidden>
        {PROFILE.firstName.toUpperCase().split("").map((c, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>
            {c}
          </span>
        ))}
      </p>

      <div className="hero-stage">
        <video
          ref={videoRef}
          className="hero-video"
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero/poster.webp"
          disablePictureInPicture
          aria-label={`Intro video: ${PROFILE.name} speaking to the camera`}
        >
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="hero-copy wrap">
        <div className="hero-left">
          <p className="tag rv">
            {PROFILE.name} · {PROFILE.location}
          </p>
          <h1 id="hero-title" className="hero-title">
            <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
              <span>Full Stack</span>
            </span>
            <span className="rv-mask" style={{ "--i": 2 } as React.CSSProperties}>
              <span>
                Developer<span className="serif">.</span>
              </span>
            </span>
          </h1>
          <p className="hero-sub rv" style={{ "--i": 3 } as React.CSSProperties}>
            {PROFILE.experience} building web applications with Angular, TypeScript, .NET Core and SQL Server.
          </p>
        </div>

        <div className="hero-right rv" style={{ "--i": 4 } as React.CSSProperties}>
          <div className="hero-ctas">
            <a href="#work" onClick={go("#work")} className="btn btn-primary">
              Explore work
            </a>
            <a href="#contact" onClick={go("#contact")} className="btn btn-ghost">
              Let&apos;s talk
            </a>
            <a href={PROFILE.resume} download className="btn btn-ghost">
              Résumé <span aria-hidden>↓</span>
            </a>
          </div>
          <button
            ref={btnRef}
            type="button"
            className={`hero-sound ${blocked ? "is-blocked" : ""}`}
            onClick={toggleSound}
            aria-label={soundOn ? "Mute intro video" : "Play intro video with sound"}
            aria-pressed={soundOn}
          >
            {soundOn ? (
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
                <rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor" />
                <rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
                <path d="M4 2.2v11.6a.6.6 0 0 0 .9.5l9.2-5.8a.6.6 0 0 0 0-1L4.9 1.7a.6.6 0 0 0-.9.5Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

const css = `
.hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;isolation:isolate;background:var(--paper)}
.hero-ghost{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;margin:0;z-index:0;
  font-weight:800;letter-spacing:-.06em;line-height:.8;font-size:clamp(120px,31vw,520px);
  color:transparent;-webkit-text-stroke:1.5px rgba(13,13,13,.13);user-select:none;padding-top:6vh}
.hero-ghost span{display:inline-block;animation:ghostIn 1.6s var(--ease) both;animation-delay:calc(var(--i)*90ms + 200ms)}
@keyframes ghostIn{from{opacity:0;transform:translateY(18%)}to{opacity:1;transform:none}}
.hero-stage{position:absolute;left:50%;bottom:0;transform:translateX(-50%);height:min(96svh,1040px);aspect-ratio:768/960;
  z-index:1;mix-blend-mode:multiply;pointer-events:none}
.hero-video{width:100%;height:100%;object-fit:cover;animation:heroVid 1.6s var(--ease) both .1s}
@keyframes heroVid{from{opacity:0;transform:translateY(24px) scale(.98)}to{opacity:1;transform:none}}
.hero-copy{position:relative;z-index:2;display:flex;align-items:flex-end;justify-content:space-between;gap:32px;padding-bottom:clamp(28px,6vh,64px)}
.hero-left{max-width:min(30vw,420px)}
.hero-title{margin-top:18px;font-weight:700;letter-spacing:-.05em;line-height:.95;font-size:clamp(44px,5.4vw,84px)}
.hero-title .serif{color:var(--mute)}
.hero-sub{margin-top:18px;color:var(--mute);font-size:15px;line-height:1.5;max-width:34ch}
.hero-right{display:flex;flex-direction:column;align-items:flex-end;gap:14px;max-width:min(30vw,420px)}
.hero-ctas{display:flex;flex-direction:column;align-items:stretch;gap:10px}
.hero-sound{position:relative;display:grid;place-items:center;width:46px;height:46px;border-radius:999px;background:var(--ink);color:#fff;
  transition:transform .5s var(--ease)}
.hero-sound:hover{transform:scale(1.06)}
.hero-sound.is-blocked::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:0 0 0 1.5px var(--ink);
  animation:ping 1.8s var(--ease) infinite}
@keyframes ping{from{transform:scale(1);opacity:.6}to{transform:scale(1.7);opacity:0}}
@media (max-width:1100px){
  .hero{justify-content:flex-start;padding-top:72px}
  .hero-stage{position:relative;left:auto;transform:none;margin:0 auto;height:min(62svh,720px);max-width:100%}
  .hero-ghost{align-items:flex-start;padding-top:clamp(90px,16svh,200px);font-size:clamp(110px,34vw,360px)}
  .hero-copy{flex-direction:column;align-items:center;text-align:center;gap:22px;margin-top:-6px}
  .hero-left,.hero-right{max-width:640px}
  .hero-left .tag{justify-content:center}
  .hero-sub{margin-inline:auto}
  .hero-right{flex-direction:row;align-items:center;flex-wrap:wrap;justify-content:center}
  .hero-ctas{flex-direction:row;flex-wrap:wrap;justify-content:center}
}
@media (max-width:520px){
  .hero-title{font-size:clamp(40px,12vw,56px)}
  .hero-ctas .btn{padding:0 18px;height:44px;font-size:14px}
}
`;
