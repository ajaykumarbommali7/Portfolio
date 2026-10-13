# Ajay Kumar Bommali — Portfolio

A "talking-video" personal portfolio: a looping self-introduction in the hero, then one calm, continuous scroll through About, Skills, Work, Experience and Contact. Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 and Lenis. There is no GSAP, no WebGL and no external runtime script.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (type-check + lint)
npm start            # serve the build
```

### Checks

```bash
npm run build && npm start          # in one terminal
node scripts/screenshots.mjs        # 1440×900 + 390×844 screenshots → shots/, overflow + console-error check
node scripts/interactions.mjs       # ID card flip (keyboard/tap), lanyard swing, sound button, mobile menu
```

Both scripts use `playwright-core` with the locally installed Chrome (`channel: "chrome"`), so no browser download is needed.

Last measured (Lighthouse 12, mobile, local production build): Performance 94–95, Accessibility 100, Best Practices 100, SEO 100. First-load JS: 128 kB.

## Content

All text lives in **`src/lib/data.ts`**. It comes from the résumé (`public/Ajay-Kumar-Bommali-Resume.pdf`, converted from the supplied `.docx`) and from the HRMS and FitSphere project write-ups Ajay supplied later. Components only read from it.

| # | Section | Component | Data | Motion |
|---|---------|-----------|------|--------|
| — | Hero | `hero/Hero.tsx` | `PROFILE` | Looping talking video, multiply blend, ghost first name, ▶/❚❚ sound button |
| 01 | About | `sections/About.tsx` | `PROFILE`, `PROJECTS` | Lanyard ID card: damped pendulum + idle sway, 3D flip (hover / tap / Enter / Space) |
| 02 | Skills | `sections/Skills.tsx` | `SKILL_GROUPS` | Periodic table, diagonal wave reveal, family filter, sticky logo inspector |
| 03 | Work | `sections/Work.tsx` | `PROJECTS` (ERP, HRMS, FitSphere, Adhaan News) | Expanding accordion gallery, illustrative CSS mini-UIs with a clip-path wipe |
| — | Certifications | `sections/Certifications.tsx` | `CERTIFICATIONS` | Ink-flood rows. **Hidden: the résumé lists none.** |
| 04 | Experience | `sections/Experience.tsx` | `EDUCATION`, `EXPERIENCE` | Spine draws with scroll progress, stops light up |
| — | Achievements | `sections/Achievements.tsx` | `ACHIEVEMENTS` | Pinned horizontal gallery with count-up. **Hidden: the résumé lists none.** |
| 05 | Contact | `sections/Contact.tsx` | `PROFILE` | Hopping letters, copy-email chip, spinning badge |

Hidden sections, and their nav links and numbers, come back automatically once their arrays in `data.ts` have entries. The résumé has no GitHub URL, so every GitHub button is hidden too. Setting `PROFILE.github` brings them back.

## Rebuilding the hero video

```bash
pip install numpy imageio-ffmpeg     # imageio-ffmpeg ships an ffmpeg binary; a system ffmpeg on PATH also works
python -I scripts/build-hero-assets.py path/to/intro.mp4
# optional: --crop W:H:X:Y   --seconds 10
```

The script:

1. Detects the person (pixels darker than the backdrop across sampled frames) and crops a 4:5 box from head to toe, centred on them. It then scales the box to 768×960. For this video the crop is `864:1080:497:0`.
2. Whitens the backdrop with `colorlevels=rimax=0.98:gimax=0.98:bimax=0.98`, so that `mix-blend-mode: multiply` blends it into the paper.
3. Makes a seamless loop from the first ~10 s. Playback runs from 0.5 s to T, and the last 0.5 s cross-fades into the first 0.5 s using `xfade`. The audio gets the same equal-power cross-fade, done sample-accurately in numpy. Nothing is retimed, so the lips stay in sync.
4. Exports `public/hero/hero.webm` (VP9 CRF 36 + Opus 80k), `public/hero/hero.mp4` (H.264 CRF 24 slow + AAC 96k, faststart) and `public/hero/poster.webp`.
5. Exports `public/portrait-bust.webp` (480×600 head-to-shirt crop from the sharpest frame) and `public/og.jpg` (1200×630).

## Structure

```
src/app/            layout.tsx (metadata, OG, fonts, themeColor), page.tsx, globals.css
src/components/     App.tsx, Navigation.tsx, hero/, sections/, ui/ (TechLogo, SectionHead, RevealObserver)
src/lib/            data.ts, hooks.ts (useInView, useScrollProgress, prefersReducedMotion), scroll.tsx (Lenis + scrollToTarget)
src/fonts/          Inter Tight (variable), Instrument Serif (regular + italic), JetBrains Mono (variable), latin subsets
public/hero/        hero.webm, hero.mp4, poster.webp
public/logos/       devicon/ and simple-icons/ SVGs + licences
scripts/            build-hero-assets.py, screenshots.mjs, interactions.mjs
```

## Credits & licences

- **Brand logos:** [devicon](https://github.com/devicons/devicon) "original" SVGs (incl. Next.js, React, Tailwind CSS, Supabase, PostgreSQL), MIT licence (`public/logos/devicon/LICENSE`). [Simple Icons](https://github.com/simple-icons/simple-icons) (Coda, JSON Web Tokens), CC0 (`public/logos/simple-icons/LICENSE.md`). All trademarks belong to their owners and are used only to name technologies.
- **Fonts:** Inter Tight, Instrument Serif and JetBrains Mono, all SIL Open Font License 1.1. They are self-hosted, copied from the `@fontsource` packages.
- **Concept icons** (REST APIs, DTOs, indexing, etc.) were drawn for this site.
