import { CERTIFICATIONS } from "@/lib/data";
import SectionHead from "../ui/SectionHead";

/** Ink-flood index. Only rendered when the résumé lists certifications. */
export default function Certifications({ index }: { index: string }) {
  return (
    <section id="certifications" className="section certs section-lazy" aria-labelledby="certs-title">
      <style>{css}</style>
      <div className="wrap certs-grid">
        <div className="certs-head">
          <SectionHead index={index} label="Certifications" id="certs-title" title="Always" accent="learning." />
          <p className="certs-count mono rv">{String(CERTIFICATIONS.length).padStart(2, "0")} certifications</p>
        </div>
        <ol className="certs-list">
          {CERTIFICATIONS.map((c, i) => {
            const inner = (
              <>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="certs-title">{c.title}</span>
                <span className="certs-issuer">{c.issuer}</span>
                <span className="certs-arrow" aria-hidden>
                  ↗
                </span>
              </>
            );
            return (
              <li key={c.title} className="rv" style={{ "--i": i } as React.CSSProperties}>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="certs-row">
                    {inner}
                  </a>
                ) : (
                  <div className="certs-row" tabIndex={0}>
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

const css = `
.certs{background:#fff;border-block:1px solid var(--line)}
.certs-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px;align-items:start}
.certs-head{position:sticky;top:120px}
.certs-count{margin-top:18px;font-size:12px;color:var(--mute)}
.certs-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.certs-row{position:relative;display:grid;grid-template-columns:44px minmax(0,1fr) auto 24px;gap:16px;align-items:center;padding:22px 16px;
  border-bottom:1px solid var(--line);isolation:isolate;overflow:hidden;transition:color .5s var(--ease)}
.certs-row::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--ink);transform:scaleX(0);transform-origin:left;transition:transform .7s var(--ease)}
.certs-row:hover,.certs-row:focus-visible{color:#fff}
.certs-row:hover::before,.certs-row:focus-visible::before{transform:scaleX(1)}
.certs-row .mono{font-size:12px;opacity:.6}
.certs-title{font-weight:600;font-size:clamp(17px,1.6vw,21px);letter-spacing:-.02em}
.certs-issuer{font-size:13px;opacity:.7}
.certs-arrow{opacity:0;transform:translateX(-10px);transition:opacity .5s var(--ease),transform .6s var(--ease)}
.certs-row:hover .certs-arrow,.certs-row:focus-visible .certs-arrow{opacity:1;transform:none}
@media (max-width:860px){
  .certs-grid{grid-template-columns:minmax(0,1fr)}
  .certs-head{position:relative;top:0}
  .certs-row{grid-template-columns:36px minmax(0,1fr) 20px}
  .certs-issuer{grid-column:2}
}
`;
