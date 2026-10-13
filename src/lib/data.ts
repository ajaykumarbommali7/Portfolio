/**
 * Every piece of text on the site comes from this file, and every value here
 * comes from the résumé (public/Ajay-Kumar-Bommali-Resume.pdf) or from project write-ups
 * supplied by Ajay (HRMS, built at CORtracker360; FitSphere, a personal project). Components only read.
 *
 * Not in the résumé, so deliberately absent: GitHub profile/repo links,
 * certifications, coding-platform achievements, grades/CGPA, school and
 * intermediate education. Their sections and nav links are therefore removed.
 */

export const PROFILE = {
  name: "Ajay Kumar Bommali",
  firstName: "Ajay",
  initials: "AK",
  role: "Full Stack Developer",
  experience: "2.11 years",
  email: "ajaykumarbommali7@gmail.com",
  phone: "+91 77993 34398",
  phoneHref: "tel:+917799334398",
  location: "Hyderabad, India",
  linkedin: "https://www.linkedin.com/in/ajay-kumar-bommali-055635270/",
  github: null as string | null,
  resume: "/Ajay-Kumar-Bommali-Resume.pdf",
  resumeSummary:
    "Full Stack Developer with 2.11 years of experience in developing web-based applications using Angular, TypeScript, .NET Core and SQL Server. Skilled in building scalable enterprise applications, RESTful APIs and responsive user interfaces. Experienced in database design, API integration, debugging, performance optimization and IIS deployment on Windows Server environments. Proficient in API documentation using Swagger, structured logging using Serilog and secure authentication using JWT tokens. Strong background in writing BRD and FRD, collaborating with cross-functional teams and delivering reliable software solutions using tools like Git, Visual Studio, VS Code, SSMS and JIRA.",
  /** Second line for About — résumé project highlight, verbatim. */
  aboutLine:
    "Contributed to frontend and backend development for ERP enterprise systems at CORtracker360.",
  /** Paraphrase of the summary's own wording, not a new claim. */
  quote: "Scalable enterprise applications, clean RESTful APIs and responsive interfaces, delivered reliably.",
  currentRole: "Software Developer · CORtracker360",
  education: "B.Tech, Electronics & Communication Engineering — JNTUK, 2021",
  degreeShort: "B.Tech ECE · JNTUK",
  gradYear: "2021",
} as const;

export type NavItem = { id: string; label: string };

export const NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export type Skill = {
  name: string;
  symbol: string;
  /** key into TechLogo BRAND or CONCEPT maps */
  logo: string;
};

export type SkillGroup = { family: string; skills: Skill[] };

// Grouped exactly as the résumé's "Technical Skillset", plus tools named in the
// summary (IIS, Windows Server, REST APIs) and project tech (jQuery).
export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Languages",
    skills: [
      { name: "C#", symbol: "C#", logo: "csharp" },
      { name: "TypeScript", symbol: "Ts", logo: "typescript" },
    ],
  },
  {
    family: "Frontend",
    skills: [
      { name: "Angular", symbol: "Ng", logo: "angular" },
      { name: "HTML5", symbol: "Ht", logo: "html5" },
      { name: "CSS3", symbol: "Cs", logo: "css3" },
      { name: "Bootstrap", symbol: "Bs", logo: "bootstrap" },
      { name: "SCSS", symbol: "Sc", logo: "sass" },
      { name: "jQuery", symbol: "Jq", logo: "jquery" },
      { name: "React", symbol: "Rc", logo: "react" },
      { name: "Next.js", symbol: "Nx", logo: "nextjs" },
      { name: "Tailwind CSS", symbol: "Tw", logo: "tailwindcss" },
    ],
  },
  {
    family: "Backend",
    skills: [
      { name: ".NET Core", symbol: "Nc", logo: "dotnetcore" },
      { name: "ASP.NET Web API", symbol: "Wa", logo: "api" },
      { name: "Entity Framework", symbol: "Ef", logo: "orm" },
      { name: "LINQ", symbol: "Lq", logo: "linq" },
      { name: "REST APIs", symbol: "Ra", logo: "rest" },
      { name: "Dependency Injection", symbol: "Di", logo: "di" },
      { name: "DTOs", symbol: "Dt", logo: "dto" },
    ],
  },
  {
    family: "Databases",
    skills: [
      { name: "SQL Server", symbol: "Sq", logo: "microsoftsqlserver" },
      { name: "PostgreSQL", symbol: "Pg", logo: "postgresql" },
      { name: "Supabase", symbol: "Su", logo: "supabase" },
      { name: "Stored Procedures", symbol: "Sp", logo: "procedure" },
      { name: "Views", symbol: "Vw", logo: "views" },
      { name: "Indexing", symbol: "Ix", logo: "index" },
      { name: "Query Optimization", symbol: "Qo", logo: "speed" },
    ],
  },
  {
    family: "Security",
    skills: [
      { name: "JWT Authentication", symbol: "Jw", logo: "jsonwebtokens" },
      { name: "SMTP Email (OTP)", symbol: "Sm", logo: "mail" },
      { name: "Row-Level Security", symbol: "Rl", logo: "shield" },
      { name: "Role-Based Access", symbol: "Rb", logo: "roles" },
    ],
  },
  {
    family: "Quality",
    skills: [
      { name: "Unit Testing (xUnit/NUnit)", symbol: "Ut", logo: "test" },
      { name: "pgTAP", symbol: "Pt", logo: "test" },
      { name: "Debugging", symbol: "Db", logo: "bug" },
      { name: "Serilog", symbol: "Sl", logo: "log" },
      { name: "Swagger", symbol: "Sw", logo: "swagger" },
    ],
  },
  {
    family: "Deploy",
    skills: [
      { name: "IIS", symbol: "Is", logo: "server" },
      { name: "Windows Server", symbol: "Ws", logo: "windows11" },
    ],
  },
  {
    family: "Tools",
    skills: [
      { name: "Git", symbol: "Gi", logo: "git" },
      { name: "GitHub", symbol: "Gh", logo: "github" },
      { name: "Visual Studio", symbol: "Vs", logo: "visualstudio" },
      { name: "VS Code", symbol: "Vc", logo: "vscode" },
      { name: "SSMS", symbol: "Ss", logo: "microsoftsqlserver" },
      { name: "JIRA", symbol: "Ji", logo: "jira" },
      { name: "Coda", symbol: "Co", logo: "coda" },
    ],
  },
  {
    family: "Docs",
    skills: [
      { name: "BRD", symbol: "Br", logo: "doc" },
      { name: "FRD", symbol: "Fr", logo: "doc" },
    ],
  },
];

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  tech: { name: string; logo: string }[];
  github: string | null;
  mock: "erp" | "news" | "hrms" | "gym";
  /** short name for tight spots (ID card) */
  short: string;
};

export const PROJECTS: Project[] = [
  {
    id: "erp",
    index: "01",
    title: "Enterprise Resource Planning",
    kicker: "CORtracker360 · Full Stack Developer",
    description:
      "Developed and maintained frontend features using Angular, Typescript and Bootstrap, and built and integrated REST APIs using .NET Core and ASP.NET Web API, enabling smooth communication between the frontend and backend.",
    features: [
      "Global CSS styles with Bootstrap for UI consistency",
      "Mock UI designs from business requirements",
      "Optimized stored procedures, views and queries",
      "Database schemas and layer-to-layer data flow",
      "DTOs for complex data transformations",
      "Dynamic web forms and new REST APIs",
      "Critical bug and production-issue fixes",
    ],
    tech: [
      { name: "Angular", logo: "angular" },
      { name: "TypeScript", logo: "typescript" },
      { name: "HTML", logo: "html5" },
      { name: "CSS", logo: "css3" },
      { name: "Bootstrap", logo: "bootstrap" },
      { name: ".NET Core", logo: "dotnetcore" },
      { name: "ASP.NET Web API", logo: "api" },
      { name: "SQL Server", logo: "microsoftsqlserver" },
    ],
    github: null,
    mock: "erp",
    short: "ERP",
  },
  {
    id: "hrms",
    index: "02",
    title: "Human Resource Management System",
    kicker: "CORtracker360 · Full Stack .NET Developer",
    description:
      "Developed and enhanced an enterprise HRMS application to streamline employee management, attendance, leave administration, recruitment, timesheets, and performance management.",
    features: [
      "Employee, attendance, recruitment and timesheet workflows",
      "Leave application and approval with email notifications",
      "Role-based access, menu permissions and business rules",
      "Search, filtering and Excel/PDF exports",
      "Duplicate validation and soft delete",
      "REST APIs with ASP.NET Core and EF Core + LINQ",
      "Reusable, responsive Angular UI components",
    ],
    tech: [
      { name: "Angular", logo: "angular" },
      { name: "TypeScript", logo: "typescript" },
      { name: "C#", logo: "csharp" },
      { name: "ASP.NET Core Web API", logo: "api" },
      { name: "Entity Framework Core", logo: "orm" },
      { name: "LINQ", logo: "linq" },
      { name: "SQL Server", logo: "microsoftsqlserver" },
      { name: "HTML5", logo: "html5" },
      { name: "CSS3", logo: "css3" },
      { name: "Bootstrap", logo: "bootstrap" },
    ],
    github: null,
    mock: "hrms",
    short: "HRMS",
  },
  {
    id: "fitsphere",
    index: "03",
    title: "FitSphere",
    kicker: "Personal project · Multi-tenant gym SaaS",
    description:
      "A multi-tenant gym management SaaS platform designed to streamline gym operations, membership management, staff administration, and financial tracking across multiple branches, with role-based architecture and secure data isolation.",
    features: [
      "RBAC for five roles, Platform Owner to Client",
      "Tenant isolation and branch-level PostgreSQL RLS",
      "Membership lifecycle, transfers and upgrades",
      "Staff shifts, leave, checklists and payroll inputs",
      "Inventory and equipment maintenance",
      "Payments, revenue reconciliation and partner settlements",
      "At-risk clients, milestones, complaints and SMS",
      "pgTAP tests for authorization and cross-tenant isolation",
    ],
    tech: [
      { name: "Next.js", logo: "nextjs" },
      { name: "React", logo: "react" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Tailwind CSS", logo: "tailwindcss" },
      { name: "Supabase", logo: "supabase" },
      { name: "PostgreSQL", logo: "postgresql" },
      { name: "Row-Level Security", logo: "shield" },
      { name: "pgTAP", logo: "test" },
    ],
    github: null,
    mock: "gym",
    short: "FitSphere",
  },
  {
    id: "adhaan",
    index: "04",
    title: "Adhaan News",
    kicker: "IBEE Software Solutions · Short-form news app",
    description:
      "A short-form news delivery app. Developed and optimized RESTful APIs for delivering real-time, personalized news feeds.",
    features: [
      "Real-time, personalized news-feed APIs",
      "Responsive, dynamic UI with frontend devs",
      "Optimized SQL procedures for query efficiency",
    ],
    tech: [
      { name: ".NET Core", logo: "dotnetcore" },
      { name: "Web API", logo: "api" },
      { name: "C#", logo: "csharp" },
      { name: "SQL Server", logo: "microsoftsqlserver" },
      { name: "jQuery", logo: "jquery" },
      { name: "Bootstrap", logo: "bootstrap" },
    ],
    github: null,
    mock: "news",
    short: "Adhaan News",
  },
];

export type Stop = {
  kind: "education" | "experience";
  year: string;
  title: string;
  place: string;
  detail: string;
};

export const EDUCATION: Stop[] = [
  {
    kind: "education",
    year: "2021",
    title: "B.Tech, Electronics & Communication Engineering",
    place: "JNTUK",
    detail: "Bachelor of Technology.",
  },
];

export const EXPERIENCE: Stop[] = [
  {
    kind: "experience",
    year: "Jun – Aug 2023",
    title: "Software Developer",
    place: "IBEE Software Solutions · Remote",
    detail:
      "Adhaan News — developed and optimized RESTful APIs for real-time, personalized news feeds and improved query efficiency with optimized SQL procedures.",
  },
  {
    kind: "experience",
    year: "Sep 2023 – Present",
    title: "Software Developer",
    place: "CORtracker360 · Hyderabad",
    detail:
      "ERP and HRMS. Angular frontends with reusable components, pipes and lazy loading; .NET Core REST APIs, SQL Server design and tuning, DTOs and Entity Framework."
  },
];

export type Certification = { title: string; issuer: string; href?: string };
/** None listed in the résumé — section is not rendered. */
export const CERTIFICATIONS: Certification[] = [];

export type Achievement = { label: string; value: number; suffix?: string; caption: string; detail: string; logo: string };
/** None listed in the résumé — section is not rendered. */
export const ACHIEVEMENTS: Achievement[] = [];
