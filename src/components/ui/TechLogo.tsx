/**
 * Brand logos are official SVGs copied into /public/logos (devicon "original",
 * MIT; simple-icons, CC0) and keep their colours. Concept skills get thin
 * line icons drawn in the same stroke style.
 */

type Brand = { src: string; tint: string };

export const BRAND: Record<string, Brand> = {
  angular: { src: "/logos/devicon/angular.svg", tint: "#dd0031" },
  typescript: { src: "/logos/devicon/typescript.svg", tint: "#3178c6" },
  html5: { src: "/logos/devicon/html5.svg", tint: "#e44d26" },
  css3: { src: "/logos/devicon/css3.svg", tint: "#1572b6" },
  bootstrap: { src: "/logos/devicon/bootstrap.svg", tint: "#7952b3" },
  sass: { src: "/logos/devicon/sass.svg", tint: "#cc6699" },
  jquery: { src: "/logos/devicon/jquery.svg", tint: "#0769ad" },
  dotnetcore: { src: "/logos/devicon/dotnetcore.svg", tint: "#512bd4" },
  csharp: { src: "/logos/devicon/csharp.svg", tint: "#68217a" },
  microsoftsqlserver: { src: "/logos/devicon/microsoftsqlserver.svg", tint: "#cc2927" },
  git: { src: "/logos/devicon/git.svg", tint: "#f05032" },
  github: { src: "/logos/devicon/github.svg", tint: "#181616" },
  visualstudio: { src: "/logos/devicon/visualstudio.svg", tint: "#5c2d91" },
  vscode: { src: "/logos/devicon/vscode.svg", tint: "#007acc" },
  jira: { src: "/logos/devicon/jira.svg", tint: "#2684ff" },
  swagger: { src: "/logos/devicon/swagger.svg", tint: "#85ea2d" },
  windows11: { src: "/logos/devicon/windows11.svg", tint: "#0078d4" },
  react: { src: "/logos/devicon/react.svg", tint: "#61dafb" },
  nextjs: { src: "/logos/devicon/nextjs.svg", tint: "#000000" },
  tailwindcss: { src: "/logos/devicon/tailwindcss.svg", tint: "#38bdf8" },
  supabase: { src: "/logos/devicon/supabase.svg", tint: "#3ecf8e" },
  postgresql: { src: "/logos/devicon/postgresql.svg", tint: "#336791" },
  coda: { src: "/logos/simple-icons/coda.svg", tint: "#f46a54" },
  jsonwebtokens: { src: "/logos/simple-icons/jsonwebtokens.svg", tint: "#d63aff" },
};

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const CONCEPT: Record<string, React.ReactNode> = {
  api: (
    <g {...S}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M7 10l-2 2 2 2M17 10l2 2-2 2M13.5 9l-3 6" />
    </g>
  ),
  rest: (
    <g {...S}>
      <circle cx="5" cy="12" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M7 11l10-4M7 13l10 4" />
    </g>
  ),
  orm: (
    <g {...S}>
      <ellipse cx="7" cy="6" rx="4" ry="1.8" />
      <path d="M3 6v8c0 1 1.8 1.8 4 1.8s4-.8 4-1.8V6" />
      <rect x="14" y="9" width="7" height="9" rx="1.5" />
      <path d="M11 11h3M14 12.5h7M14 15h7" />
    </g>
  ),
  di: (
    <g {...S}>
      <rect x="3" y="8" width="8" height="8" rx="2" />
      <path d="M11 12h4M15 9v6" />
      <path d="M17 7l4 5-4 5" />
    </g>
  ),
  dto: (
    <g {...S}>
      <rect x="3" y="4" width="7" height="16" rx="1.5" />
      <rect x="14" y="4" width="7" height="16" rx="1.5" />
      <path d="M5.5 8h2M5.5 11h2M16.5 8h2M16.5 11h2M10 15h4M12.5 13.5L14 15l-1.5 1.5" />
    </g>
  ),
  procedure: (
    <g {...S}>
      <ellipse cx="12" cy="5" rx="7" ry="2.5" />
      <path d="M5 5v14c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V5" />
      <path d="M9.5 11.5l-1.5 1.5 1.5 1.5M14.5 11.5l1.5 1.5-1.5 1.5" />
    </g>
  ),
  views: (
    <g {...S}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </g>
  ),
  index: (
    <g {...S}>
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M8 9h8M8 12h8M8 15h5" />
      <circle cx="17" cy="17" r="2.5" />
      <path d="M19 19l2 2" />
    </g>
  ),
  speed: (
    <g {...S}>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4-5" />
      <circle cx="12" cy="17" r="1.2" />
      <path d="M6.5 13.5l1 .6M12 9v1.2M17.5 13.5l-1 .6" />
    </g>
  ),
  mail: (
    <g {...S}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M4 7l8 6 8-6" />
    </g>
  ),
  test: (
    <g {...S}>
      <path d="M9 3h6M10 3v6l-5 9.5A1.6 1.6 0 0 0 6.4 21h11.2a1.6 1.6 0 0 0 1.4-2.5L14 9V3" />
      <path d="M9 15l2 2 4-4" />
    </g>
  ),
  bug: (
    <g {...S}>
      <rect x="7.5" y="8" width="9" height="11" rx="4.5" />
      <path d="M9.5 8a2.5 2.5 0 0 1 5 0M12 11v8M3.5 13h4M16.5 13h4M4.5 8.5l3.5 2M19.5 8.5l-3.5 2M4.5 18l3.5-2M19.5 18l-3.5-2" />
    </g>
  ),
  log: (
    <g {...S}>
      <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
      <path d="M7 8.5h1.5M10.5 8.5H17M7 12h1.5M10.5 12H15M7 15.5h1.5M10.5 15.5H17" />
    </g>
  ),
  server: (
    <g {...S}>
      <rect x="4" y="3.5" width="16" height="7" rx="2" />
      <rect x="4" y="13.5" width="16" height="7" rx="2" />
      <path d="M8 7h.01M8 17h.01M12 7h5M12 17h5" />
    </g>
  ),
  linq: (
    <g {...S}>
      <path d="M4 6h16M7 12h10M10 18h4" />
      <path d="M18 15l3 3-3 3" />
    </g>
  ),
  shield: (
    <g {...S}>
      <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z" />
      <rect x="9.5" y="10.5" width="5" height="4.5" rx="1" />
      <path d="M10.5 10.5V9a1.5 1.5 0 0 1 3 0v1.5" />
    </g>
  ),
  roles: (
    <g {...S}>
      <circle cx="8" cy="8" r="2.5" />
      <path d="M3.5 18a4.5 4.5 0 0 1 9 0" />
      <circle cx="17" cy="9.5" r="2" />
      <path d="M14 18a3.5 3.5 0 0 1 7 0" />
    </g>
  ),
  doc: (
    <g {...S}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 11h6M9 14h6M9 17h4" />
    </g>
  ),
};

export const isBrand = (key: string) => key in BRAND;

export default function TechLogo({
  name,
  logo,
  size = 24,
  className = "",
}: {
  name: string;
  logo: string;
  size?: number;
  className?: string;
}) {
  const brand = BRAND[logo];
  if (brand) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={brand.src} alt={`${name} logo`} width={size} height={size} className={className} loading="lazy" decoding="async" />;
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} role="img" aria-label={`${name} icon`} className={className}>
      {CONCEPT[logo] ?? CONCEPT.api}
    </svg>
  );
}
