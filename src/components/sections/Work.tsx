"use client";

import { useState } from "react";
import { PROJECTS } from "@/lib/data";
import SectionHead from "../ui/SectionHead";
import TechLogo from "../ui/TechLogo";

export default function Work({ index }: { index: string }) {
  const [open, setOpen] = useState(PROJECTS[0]?.id);

  return (
    <section id="work" className="section work section-lazy" aria-labelledby="work-title">
      <style>{css}</style>
      <div className="wrap">
        <div className="work-head">
          <SectionHead index={index} label="Selected work" id="work-title" title="Things I've" accent="built." />
          <p className="work-note rv">
            {PROJECTS.length} projects. Hover, focus or tap a panel to open it.
          </p>
        </div>

        <div className="panels rv" style={{ "--i": 1 } as React.CSSProperties}>
          {PROJECTS.map((p) => {
            const isOpen = open === p.id;
            return (
              <article
                key={p.id}
                className={`panel ${isOpen ? "is-open" : ""}`}
                onMouseEnter={() => setOpen(p.id)}
                aria-labelledby={`p-${p.id}-title`}
              >
                <button
                  className="spine"
                  aria-expanded={isOpen}
                  aria-controls={`p-${p.id}-body`}
                  onFocus={() => setOpen(p.id)}
                  onClick={() => setOpen(p.id)}
                >
                  <span className="spine-n mono">{p.index}</span>
                  <span className="spine-title">{p.title}</span>
                  <span className="spine-plus" aria-hidden>
                    +
                  </span>
                </button>

                <div id={`p-${p.id}-body`} className="pbody" hidden={!isOpen}>
                  <div className="pcopy" data-lenis-prevent>
                    <p className="pkicker mono">
                      {p.index} — {p.kicker}
                    </p>
                    <h3 id={`p-${p.id}-title`} className="ptitle">
                      {p.title}
                    </h3>
                    <p className="pdesc">{p.description}</p>
                    <ul className="pfeat">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <ul className="ptech" aria-label="Tech">
                      {p.tech.map((t) => (
                        <li key={t.name}>
                          <TechLogo name={t.name} logo={t.logo} size={14} />
                          {t.name}
                        </li>
                      ))}
                    </ul>
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary pgh">
                        View on GitHub <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                  <figure className="pmock" aria-label={`Illustrative UI sketch for ${p.title}, not a real screenshot`}>
                    <figcaption className="mono">Illustrative UI</figcaption>
                    {p.mock === "erp" ? <ErpMock /> : p.mock === "hrms" ? <HrmsMock /> : p.mock === "gym" ? <GymMock /> : <NewsMock />}
                  </figure>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ErpMock() {
  return (
    <div className="mk mk-erp" aria-hidden>
      <div className="mk-side">
        <i className="mk-logo" />
        {Array.from({ length: 6 }, (_, i) => (
          <i key={i} className={i === 1 ? "is-on" : ""} />
        ))}
      </div>
      <div className="mk-main">
        <div className="mk-bar">
          <i className="w40" />
          <i className="pill" />
        </div>
        <div className="mk-kpis">
          {[62, 38, 80].map((h, i) => (
            <div key={i} className="mk-kpi">
              <i className="w50" />
              <b style={{ width: `${h}%` }} />
            </div>
          ))}
        </div>
        <div className="mk-chart">
          {[40, 64, 52, 78, 58, 88, 70, 94].map((h, i) => (
            <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
        <div className="mk-table">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <i className="w30" />
              <i className="w20" />
              <i className="w15" />
              <em className={i % 2 ? "" : "dark"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsMock() {
  return (
    <div className="mk mk-news" aria-hidden>
      <div className="mk-phone">
        <div className="mk-notch" />
        <div className="mk-tabs">
          <i className="is-on" />
          <i />
          <i />
        </div>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="mk-story" style={{ animationDelay: `${i * 120}ms` }}>
            <div className="mk-thumb" />
            <div className="mk-lines">
              <i className="w90" />
              <i className="w70" />
              <i className="w40 faint" />
            </div>
          </div>
        ))}
      </div>
      <div className="mk-api mono">
        <span>GET /feed</span>
        <span>200 · json</span>
      </div>
    </div>
  );
}

function HrmsMock() {
  return (
    <div className="mk mk-hrms" aria-hidden>
      <div className="mk-bar">
        <i className="w30" />
        <span className="mk-btns">
          <em>XLS</em>
          <em>PDF</em>
        </span>
      </div>
      <div className="mk-cal">
        {Array.from({ length: 28 }, (_, i) => (
          <span key={i} className={[3, 4, 11, 17, 18, 19].includes(i) ? "on" : i % 7 > 4 ? "off" : ""} />
        ))}
      </div>
      <div className="mk-approvals">
        {["ok", "wait", "ok"].map((st, i) => (
          <div key={i} style={{ animationDelay: `${i * 120}ms` }}>
            <b className="mk-av" />
            <span className="mk-lines">
              <i className="w70" />
              <i className="w40 faint" />
            </span>
            <em className={st}>{st === "ok" ? "✓" : "…"}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

function GymMock() {
  return (
    <div className="mk mk-gym" aria-hidden>
      <div className="mk-bar">
        <span className="mk-branches">
          <em className="on">Branch A</em>
          <em>Branch B</em>
        </span>
        <span className="mk-rls mono">RLS</span>
      </div>
      <div className="mk-kpis">
        {[72, 46, 88].map((h, i) => (
          <div key={i} className="mk-kpi">
            <i className="w50" />
            <b style={{ width: `${h}%` }} />
          </div>
        ))}
      </div>
      <div className="mk-members">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
            <b className="mk-av" />
            <span className="mk-lines">
              <i className="w70" />
              <i className="w40 faint" />
            </span>
            <span className="mk-ring" style={{ "--p": `${[82, 35, 64, 18][i]}%` } as React.CSSProperties} />
          </div>
        ))}
      </div>
    </div>
  );
}

const css = `
.work-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap}
.work-note{max-width:30ch;color:var(--mute);font-size:14px;line-height:1.5}
.panels{display:flex;gap:10px;margin-top:44px;height:min(80svh,640px)}
.panel{position:relative;flex:1;min-width:0;display:flex;border-radius:26px;background:var(--card);box-shadow:var(--hairline);overflow:hidden;
  transition:flex .9s var(--ease),box-shadow .6s var(--ease)}
.panel.is-open{flex:8;box-shadow:var(--hairline),var(--lift)}
.spine{flex:none;width:86px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;
  border-right:1px solid transparent;transition:border-color .6s}
.panel.is-open .spine{border-color:var(--line)}
.spine-n{font-size:12px;color:var(--mute)}
.spine-title{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:700;font-size:22px;letter-spacing:-.03em;white-space:nowrap}
.spine-plus{display:grid;place-items:center;width:38px;height:38px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);
  font-size:20px;line-height:1;transition:transform .6s var(--ease),background .4s,color .4s}
.spine:hover .spine-plus{transform:rotate(90deg)}
.panel.is-open .spine-plus{transform:rotate(45deg);background:var(--ink);color:#fff}
.pbody{flex:1;min-width:0;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:28px;padding:30px 30px 30px 26px}
.pbody[hidden]{display:none}
.pcopy{display:flex;flex-direction:column;min-width:0;overflow:auto;animation:pfade .8s var(--ease) both .15s}
@keyframes pfade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.pkicker{font-size:11.5px;color:var(--mute);letter-spacing:.03em}
.ptitle{margin-top:10px;font-size:clamp(28px,2.7vw,40px);font-weight:700;letter-spacing:-.045em;line-height:1}
.pdesc{margin-top:12px;font-size:15px;line-height:1.55;color:var(--ink-2)}
.pfeat{list-style:none;margin:14px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 18px}
.pfeat li{position:relative;padding-left:14px;font-size:13px;line-height:1.4;color:var(--ink-2)}
.pfeat li::before{content:"";position:absolute;left:0;top:.55em;width:5px;height:5px;border-radius:99px;background:var(--ink)}
.ptech{list-style:none;margin:auto 0 0;padding:14px 0 0;display:flex;flex-wrap:wrap;gap:6px}
.ptech li{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 9px;border-radius:999px;background:var(--paper);font-size:11.5px;font-weight:500}
.pgh{margin-top:16px;align-self:flex-start}
.pmock{position:relative;margin:0;border-radius:20px;background:var(--paper);overflow:hidden;min-height:0;
  animation:wipe 1.1s var(--ease) both .2s}
@keyframes wipe{from{clip-path:inset(0 0 0 100% round 20px)}to{clip-path:inset(0 0 0 0 round 20px)}}
.pmock figcaption{position:absolute;top:12px;right:14px;z-index:2;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);
  background:rgba(255,255,255,.8);padding:4px 8px;border-radius:99px}
.mk{position:absolute;inset:0;padding:42px 18px 18px}
.mk i{display:block;height:7px;border-radius:99px;background:#d6d3cd}
.mk i.faint{background:#e4e1db}
.w15{width:15%}.w20{width:20%}.w30{width:30%}.w40{width:40%}.w50{width:50%}.w70{width:70%}.w90{width:90%}
.mk-erp{display:flex;gap:12px}
.mk-side{width:44px;flex:none;display:flex;flex-direction:column;gap:12px;padding:12px 10px;border-radius:14px;background:var(--ink)}
.mk-side i{background:#3a3a3a;height:8px}
.mk-side i.is-on{background:#fff}
.mk-side .mk-logo{width:22px;height:22px;border-radius:7px;background:#fff;margin-bottom:6px}
.mk-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:10px}
.mk-bar{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:12px;background:#fff}
.mk-bar .pill{width:56px;height:16px;background:var(--ink)}
.mk-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.mk-kpi{padding:10px;border-radius:12px;background:#fff;display:grid;gap:10px}
.mk-kpi b{display:block;height:14px;border-radius:5px;background:#3a3a3a}
.mk-chart{flex:1;min-height:60px;display:flex;align-items:flex-end;gap:6px;padding:12px;border-radius:12px;background:#fff}
.mk-chart span{flex:1;border-radius:5px 5px 2px 2px;background:linear-gradient(#0d0d0d,#77756f);transform-origin:bottom;animation:grow 1s var(--ease) both}
@keyframes grow{from{transform:scaleY(0)}}
.mk-table{display:grid;gap:6px;padding:10px 12px;border-radius:12px;background:#fff}
.mk-table div{display:flex;align-items:center;gap:10px}
.mk-table em{margin-left:auto;width:34px;height:14px;border-radius:99px;background:#e4e1db}
.mk-table em.dark{background:var(--ink)}
.mk-news{display:flex;align-items:center;justify-content:center;gap:16px}
.mk-phone{position:relative;width:min(220px,62%);height:92%;border-radius:30px;background:#fff;padding:26px 12px 12px;
  box-shadow:inset 0 0 0 6px var(--ink),0 24px 40px -24px rgba(13,13,13,.4);display:flex;flex-direction:column;gap:10px;overflow:hidden}
.mk-notch{position:absolute;top:10px;left:50%;width:56px;height:10px;transform:translateX(-50%);border-radius:99px;background:var(--ink)}
.mk-tabs{display:flex;gap:6px;padding:0 4px}
.mk-tabs i{width:42px;height:14px;background:#e4e1db}
.mk-tabs i.is-on{background:var(--ink)}
.mk-story{display:flex;flex-direction:column;gap:8px;padding:8px;border-radius:14px;background:var(--paper);animation:pfade .8s var(--ease) both}
.mk-thumb{height:54px;border-radius:10px;background:linear-gradient(135deg,#bdbab4,#e9e6e0)}
.mk-lines{display:grid;gap:5px}
.mk-api{display:flex;flex-direction:column;gap:6px;font-size:10.5px}
.mk-api span{padding:6px 10px;border-radius:8px;background:#fff;box-shadow:var(--hairline);white-space:nowrap}
.mk-api span:first-child{background:var(--ink);color:#fff;box-shadow:none}
.mk-hrms,.mk-gym{display:flex;flex-direction:column;gap:10px}
.mk-btns,.mk-branches{display:flex;gap:6px}
.mk-btns em,.mk-branches em{font-style:normal;font-size:10px;font-family:var(--font-mono);padding:3px 8px;border-radius:99px;background:var(--paper);color:var(--ink-2)}
.mk-branches em.on{background:var(--ink);color:#fff}
.mk-cal{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;padding:12px;border-radius:12px;background:#fff}
.mk-cal span{aspect-ratio:1.6;border-radius:5px;background:#ecebe7}
.mk-cal span.off{background:#f7f6f3}
.mk-cal span.on{background:var(--ink);animation:pfade .6s var(--ease) both}
.mk-approvals,.mk-members{flex:1;display:grid;gap:6px;align-content:start}
.mk-approvals>div,.mk-members>div{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;background:#fff;animation:pfade .8s var(--ease) both}
.mk-av{flex:none;width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#bdbab4,#e9e6e0)}
.mk-approvals .mk-lines,.mk-members .mk-lines{flex:1;min-width:0}
.mk-approvals em{font-style:normal;display:grid;place-items:center;width:24px;height:24px;border-radius:50%;font-size:12px}
.mk-approvals em.ok{background:var(--ink);color:#fff}
.mk-approvals em.wait{box-shadow:inset 0 0 0 1.5px #bdbab4;color:var(--mute)}
.mk-rls{font-size:10px;padding:3px 8px;border-radius:6px;box-shadow:inset 0 0 0 1.5px var(--ink)}
.mk-ring{flex:none;width:26px;height:26px;border-radius:50%;background:conic-gradient(var(--ink) var(--p),#e4e1db 0);
  -webkit-mask:radial-gradient(circle,transparent 7px,#000 8px);mask:radial-gradient(circle,transparent 7px,#000 8px)}

@media (max-width:1100px){
  .pbody{grid-template-columns:minmax(0,1fr);overflow:auto}
  .pmock{min-height:260px}
}
@media (max-width:860px){
  .panels{flex-direction:column;height:auto}
  .panel{flex-direction:column;flex:none}
  .panel.is-open{flex:none}
  .spine{width:100%;flex-direction:row;padding:16px 18px;gap:14px;justify-content:flex-start}
  .spine-title{writing-mode:horizontal-tb;transform:none;font-size:19px;white-space:normal;text-align:left;flex:1}
  .pbody{padding:6px 18px 18px;gap:20px}
  .pfeat{grid-template-columns:minmax(0,1fr)}
  .pcopy{overflow:visible}
  .mk-api{display:none}
  .ptitle{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
  .pkicker{margin-top:4px}
}
`;
