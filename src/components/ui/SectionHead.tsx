/** "03 — Selected work" tag + heading whose last word is a serif italic accent. */
export default function SectionHead({
  index,
  label,
  title,
  accent,
  id,
  className = "",
}: {
  index: string;
  label: string;
  title: string;
  accent: string;
  id: string;
  className?: string;
}) {
  return (
    <header className={className}>
      <p className="tag rv">
        {index} — {label}
      </p>
      <h2 id={id} className="h-sec mt-5">
        <span className="rv-mask">
          <span>
            {title} <span className="serif">{accent}</span>
          </span>
        </span>
      </h2>
    </header>
  );
}
