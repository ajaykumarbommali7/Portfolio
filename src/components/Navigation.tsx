"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { scrollToTarget, setScrollLocked } from "@/lib/scroll";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLLIElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // scrolled state + top progress bar
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // active section
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const hero = document.getElementById("top");
    const heroIo = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), {
      rootMargin: "-45% 0px -50% 0px",
    });
    if (hero) heroIo.observe(hero);
    return () => {
      io.disconnect();
      heroIo.disconnect();
    };
  }, []);

  // slide indicator pill under active link
  const placePill = useCallback(() => {
    const pill = pillRef.current;
    const list = listRef.current;
    if (!pill || !list) return;
    const link = active ? list.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    if (!link) {
      pill.style.opacity = "0";
      return;
    }
    pill.style.opacity = "1";
    pill.style.width = `${link.offsetWidth}px`;
    pill.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [active]);

  useLayoutEffect(() => {
    placePill();
    window.addEventListener("resize", placePill);
    return () => window.removeEventListener("resize", placePill);
  }, [placePill]);

  // mobile menu: esc + scroll lock
  useEffect(() => {
    if (!open) return;
    const btn = menuBtnRef.current;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // wait one frame so the scroll lock is released first
    requestAnimationFrame(() => scrollToTarget(id === "top" ? 0 : `#${id}`));
  };

  return (
    <>
      <style>{css}</style>
      <div className="nav-progress" aria-hidden>
        <div ref={barRef} />
      </div>
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#top" onClick={go("top")} className="nav-brand">
            <span className="nav-mark" aria-hidden>{PROFILE.initials}</span>
            <span className="nav-name">{PROFILE.name}</span>
          </a>

          <nav aria-label="Primary" className="nav-links">
            <ul ref={listRef}>
              <li ref={pillRef} className="nav-pill" aria-hidden />
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    data-id={n.id}
                    onClick={go(n.id)}
                    aria-current={active === n.id ? "true" : undefined}
                    className={active === n.id ? "is-active" : ""}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            ref={menuBtnRef}
            className="nav-menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`nav-overlay ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
      >
        <ol>
          {NAV.map((n, i) => (
            <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
              <a href={`#${n.id}`} onClick={go(n.id)}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                {n.label}
              </a>
            </li>
          ))}
        </ol>
        <p className="nav-overlay-foot mono">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </p>
      </div>
    </>
  );
}

const css = `
.nav-progress{position:fixed;inset:0 0 auto 0;height:2px;z-index:70;pointer-events:none}
.nav-progress>div{height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(0)}
.nav{position:fixed;inset:0 0 auto 0;z-index:60;padding:14px var(--gutter);pointer-events:none}
.nav-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;max-width:1320px;margin:0 auto}
.nav-inner>*{pointer-events:auto}
.nav-brand{display:flex;align-items:center;gap:12px;min-width:0}
.nav-mark{display:grid;place-items:center;width:42px;height:42px;flex:none;border-radius:999px;
  box-shadow:inset 0 0 0 1.5px var(--ink);font-weight:700;font-size:14px;letter-spacing:-.03em;
  transition:background .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
.nav-brand:hover .nav-mark{transform:rotate(360deg)}
.nav.is-scrolled .nav-mark{background:var(--ink);color:#fff}
.nav-name{font-weight:600;letter-spacing:-.02em;font-size:15px;white-space:nowrap;
  transition:opacity .5s var(--ease),transform .6s var(--ease)}
.nav.is-scrolled .nav-name{opacity:0;transform:translateX(-8px);pointer-events:none}
.nav-links ul{position:relative;display:flex;gap:2px;padding:5px;border-radius:999px;list-style:none;margin:0;
  transition:background .5s var(--ease),box-shadow .5s var(--ease),backdrop-filter .5s}
.nav.is-scrolled .nav-links ul{background:rgba(255,255,255,.72);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  box-shadow:var(--hairline),0 10px 30px -18px rgba(13,13,13,.3)}
.nav-links a{position:relative;z-index:1;display:block;padding:9px 16px;border-radius:999px;font-size:14px;font-weight:500;
  color:var(--ink-2);transition:color .4s var(--ease)}
.nav-links a:hover{color:var(--ink)}
.nav-links a.is-active{color:#fff}
.nav-pill{position:absolute;left:0;top:5px;bottom:5px;border-radius:999px;background:var(--ink);opacity:0;
  transition:transform .6s var(--ease),width .6s var(--ease),opacity .3s}
.nav-menu-btn{display:none;height:42px;padding:0 20px;border-radius:999px;background:var(--ink);color:#fff;font-size:14px;font-weight:500}
.nav-overlay{position:fixed;inset:0;z-index:55;background:var(--paper);display:flex;flex-direction:column;justify-content:center;
  padding:96px var(--gutter) 40px;clip-path:circle(0% at calc(100% - 50px) 34px);transition:clip-path .8s var(--ease)}
.nav-overlay[hidden]{display:flex;visibility:hidden}
.nav-overlay.is-open{clip-path:circle(150% at calc(100% - 50px) 34px);visibility:visible}
.nav-overlay ol{list-style:none;margin:0;padding:0}
.nav-overlay li{overflow:hidden;border-bottom:1px solid var(--line)}
.nav-overlay li a{display:flex;align-items:baseline;gap:16px;padding:14px 0;font-size:clamp(36px,11vw,64px);font-weight:700;
  letter-spacing:-.045em;line-height:1;transform:translateY(110%);transition:transform .8s var(--ease);transition-delay:calc(var(--i)*60ms + 150ms)}
.nav-overlay li a .mono{font-size:12px;color:var(--mute);letter-spacing:0;font-weight:400}
.nav-overlay.is-open li a{transform:none}
.nav-overlay-foot{margin-top:28px;font-size:13px;color:var(--mute)}
@media (max-width:820px){
  .nav-links{display:none}
  .nav-menu-btn{display:block}
}
`;
