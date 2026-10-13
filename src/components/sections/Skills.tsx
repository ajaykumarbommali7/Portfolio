"use client";

import { useMemo, useState } from "react";
import { PROJECTS, SKILL_GROUPS } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";
import TechLogo, { BRAND, isBrand } from "../ui/TechLogo";

type Tile = { n: number; name: string; symbol: string; logo: string; family: string };

// project tech labels that are spelled differently from the skill name
const ALIAS: Record<string, string> = {
  HTML: "HTML5",
  CSS: "CSS3",
  "Web API": "ASP.NET Web API",
  "ASP.NET Core Web API": "ASP.NET Web API",
  "Entity Framework Core": "Entity Framework",
};

const TILES: Tile[] = SKILL_GROUPS.flatMap((g) => g.skills.map((s) => ({ ...s, family: g.family }))).map((s, i) => ({
  ...s,
  n: i + 1,
}));

function projectsFor(name: string) {
  return PROJECTS.filter((p) => p.tech.some((t) => (ALIAS[t.name] ?? t.name) === name)).map((p) => p.title);
}

export default function Skills({ index }: { index: string }) {
  const [filter, setFilter] = useState<string | null>(null);
  const [current, setCurrent] = useState<Tile>(TILES[0]);
  const [gridRef, inView] = useInView<HTMLUListElement>({ threshold: 0.12 });
  const families = useMemo(() => SKILL_GROUPS.map((g) => g.family), []);
  const used = projectsFor(current.name);
  const tint = BRAND[current.logo]?.tint;

  return (
    <section id="skills" className="section skills section-lazy" aria-labelledby="skills-title">
      <style>{css}</style>
      <div className="wrap">
        <SectionHead index={index} label="Skills" id="skills-title" title="The periodic table of my" accent="stack." />

        <div className="chips rv" role="group" aria-label="Filter by family">
          <button className={`chip ${filter === null ? "is-on" : ""}`} aria-pressed={filter === null} onClick={() => setFilter(null)}>
            All <span className="mono">{TILES.length}</span>
          </button>
          {families.map((f) => (
            <button
              key={f}
              className={`chip ${filter === f ? "is-on" : ""}`}
              aria-pressed={filter === f}
              onClick={() => setFilter((cur) => (cur === f ? null : f))}
            >
              {f} <span className="mono">{TILES.filter((t) => t.family === f).length}</span>
            </button>
          ))}
        </div>

        <div className="ptable">
          <ul ref={gridRef} className={`pgrid ${inView ? "is-in" : ""}`} aria-label="Skills">
            {TILES.map((t, i) => {
              const dim = filter !== null && t.family !== filter;
              return (
                <li
                  key={t.n}
                  style={
                    {
                      "--d8": ((i % 8) + Math.floor(i / 8)) * 40 + "ms",
                      "--d4": ((i % 4) + Math.floor(i / 4)) * 40 + "ms",
                    } as React.CSSProperties
                  }
                >
                  <button
                    className={`el ${dim ? "is-dim" : ""} ${current.n === t.n ? "is-cur" : ""}`}
                    onMouseEnter={() => setCurrent(t)}
                    onFocus={() => setCurrent(t)}
                    onClick={() => setCurrent(t)}
                    aria-label={`${t.name}, ${t.family}`}
                    aria-describedby="skill-inspector"
                  >
                    <span className="el-n mono">{t.n}</span>
                    <span className="el-sym">{t.symbol}</span>
                    <span className="el-name">{t.name}</span>
                    <span className="el-fam mono">{t.family}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <aside id="skill-inspector" className="inspector card" aria-live="polite">
            <div className="insp-top mono">
              <span>No. {String(current.n).padStart(2, "0")}</span>
              <span>{isBrand(current.logo) ? "Brand" : "Concept"}</span>
            </div>
            <div key={current.n} className="insp-logo" style={{ "--tint": tint ?? "transparent" } as React.CSSProperties}>
              <TechLogo name={current.name} logo={current.logo} size={150} />
            </div>
            <p className="insp-name">{current.name}</p>
            <p className="insp-fam mono">{current.family}</p>
            <div className="insp-used">
              <p className="mono">Used in</p>
              {used.length ? (
                <ul>
                  {used.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              ) : (
                <p className="insp-none">Part of my core skillset.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const css = `
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:36px}
.chip{display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 16px;border-radius:999px;font-size:14px;font-weight:500;
  box-shadow:inset 0 0 0 1px rgba(13,13,13,.16);color:var(--ink-2);transition:background .4s var(--ease),color .4s var(--ease),transform .4s var(--ease)}
.chip .mono{font-size:11px;color:var(--mute)}
.chip:hover{transform:translateY(-1px);color:var(--ink)}
.chip.is-on{background:var(--ink);color:#fff;box-shadow:inset 0 0 0 1px var(--ink)}
.chip.is-on .mono{color:rgba(255,255,255,.6)}
.ptable{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;margin-top:28px;align-items:start}
.pgrid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px;list-style:none;margin:0;padding:0}
.pgrid li{opacity:0;transform:translateY(16px) scale(.96);transition:opacity .7s var(--ease),transform .9s var(--ease);transition-delay:var(--d8)}
.pgrid.is-in li{opacity:1;transform:none}
.el{position:relative;display:flex;flex-direction:column;width:100%;aspect-ratio:1/1.08;padding:9px 10px;border-radius:14px;text-align:left;
  background:var(--card);box-shadow:var(--hairline);transition:background .4s var(--ease),color .4s var(--ease),opacity .4s var(--ease),transform .5s var(--ease),box-shadow .5s var(--ease)}
.el:hover,.el:focus-visible{transform:translateY(-3px);box-shadow:var(--hairline),0 16px 30px -18px rgba(13,13,13,.45)}
.el.is-cur{background:var(--ink);color:#fff}
.el.is-cur .el-n,.el.is-cur .el-fam{color:rgba(255,255,255,.55)}
.el.is-dim{opacity:.22}
.el-n{font-size:10px;color:var(--mute)}
.el-sym{margin-top:auto;font-size:clamp(20px,2.1vw,30px);font-weight:700;letter-spacing:-.04em;line-height:1}
.el-name{margin-top:4px;font-size:11px;line-height:1.15;font-weight:500;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.el-fam{margin-top:3px;font-size:8.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.inspector{position:sticky;top:96px;padding:20px;display:flex;flex-direction:column;align-items:center;text-align:center}
.insp-top{display:flex;justify-content:space-between;width:100%;font-size:11px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em}
.insp-logo{position:relative;display:grid;place-items:center;width:200px;height:200px;margin:18px 0 8px;color:var(--ink);
  animation:pop .7s var(--ease) both}
.insp-logo::before{content:"";position:absolute;inset:14px;border-radius:50%;background:radial-gradient(closest-side,var(--tint),transparent);opacity:.16;filter:blur(8px)}
.insp-logo>*{position:relative;width:150px;height:150px;object-fit:contain}
@keyframes pop{0%{opacity:0;transform:scale(.6) rotate(-6deg)}60%{opacity:1;transform:scale(1.06)}100%{transform:none}}
.insp-name{font-size:24px;font-weight:700;letter-spacing:-.03em}
.insp-fam{margin-top:4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.insp-used{width:100%;margin-top:18px;padding-top:14px;border-top:1px solid var(--line);text-align:left}
.insp-used>.mono{font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--mute)}
.insp-used ul{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:6px}
.insp-used li{font-size:14px;font-weight:500}
.insp-used li::before{content:"→ ";color:var(--mute)}
.insp-none{margin-top:8px;font-size:13.5px;color:var(--mute)}
@media (max-width:980px){
  .ptable{grid-template-columns:minmax(0,1fr)}
  .inspector{position:relative;top:0;flex-direction:row;flex-wrap:wrap;justify-content:center;gap:0 20px}
  .insp-top{flex-basis:100%}
}
@media (max-width:640px){
  .pgrid{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
  .pgrid li{transition-delay:var(--d4)}
  .el{padding:7px 8px;border-radius:12px}
  .el-sym{font-size:22px}
  .el-fam{display:none}
  .insp-logo{width:170px;height:170px}
}
`;
