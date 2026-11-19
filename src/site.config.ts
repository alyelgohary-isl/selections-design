/* Everything that changes per client, in one place. The layout, header,
   footer and head tags read from here; pages only carry their own copy.
   Paths are site-relative ("contact/", "assets/img/x.webp"); the base path
   is added at build time; mailto:/https: links are left alone. */

const email = "info@selectionsdesign.com";
const office = "(905) 629-0001";
const cell = "(416) 562-3721";

export const site = {
  /** Legal/brand name: page titles, Organization schema, footer copyright */
  name: "Selections Interiors & Design",
  /** Header and footer lockup: wordmark, then the small drafting-label tag */
  brand: ["Selections", "Interiors & Design"],
  /** Production domain, used for canonical and OG URLs (not where the preview is hosted) */
  url: "https://selectionsdesign.com",
  email,
  office,
  cell,
  address: ["19-5200 Dixie Rd.", "Mississauga, Ontario L4W 1E4"],
  hours: ["Monday to Friday, 9am to 7pm", "Weekends by appointment"],
  tagline: "Drawn, cut, fitted.",
  /** Footer blurb and Organization schema description */
  description: "Custom millwork and design-build for homes, restaurants and institutions across the GTA and Muskoka, for over 30 years.",

  /** Google Fonts stylesheet; change together with --font-display / --font-body / --font-mono in src/styles/style.css */
  fonts: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&display=swap",
  /** Letter favicon drawn as an inline SVG */
  favicon: { letter: "S", background: "#1c1713", color: "#ece5d6" },
  /** Default OG image in public/ */
  ogImage: "assets/img/og.jpg",
  /** Concept build: keep it out of search so it never competes with the client's live site. Set false at launch. */
  noindex: true,

  /** 3–4 links; the CTA repeats inside the nav for the mobile drawer */
  nav: [
    { key: "work", href: "work/", label: "Work" },
    { key: "millwork", href: "millwork/", label: "Millwork" },
    { key: "studio", href: "studio/", label: "Studio" },
    { key: "contact", href: "contact/", label: "Contact" },
  ],
  cta: { label: "Free consultation", href: "contact/" },

  footer: {
    columns: [
      { title: "Sheets", links: [{ label: "Work", href: "work/" }, { label: "Millwork & process", href: "millwork/" }, { label: "Studio", href: "studio/" }, { label: "Contact", href: "contact/" }] },
      { title: "Reach us", links: [{ label: email, href: `mailto:${email}` }, { label: `Office ${office}`, href: "tel:+19056290001" }, { label: `Cell ${cell}`, href: "tel:+14165623721" }] },
    ],
    social: [
      { label: "Instagram", href: "https://www.instagram.com/selectionsdesign/" },
      { label: "Facebook", href: "https://www.facebook.com/selectionsdesign/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/selections-interiors-and-design/" },
    ],
    /** Copyright line tail: disclaimers, E.&O.E. */
    legal: "",
  },

  /** Extra Organization JSON-LD fields (@type, areaServed, address…) merged over the defaults */
  schema: {
    "@type": "HomeAndConstructionBusiness",
    telephone: "+1-905-629-0001",
    address: {
      "@type": "PostalAddress",
      streetAddress: "19-5200 Dixie Rd.",
      addressLocality: "Mississauga",
      addressRegion: "ON",
      postalCode: "L4W 1E4",
      addressCountry: "CA",
    },
    areaServed: ["Greater Toronto Area", "Muskoka"],
    sameAs: [
      "https://www.instagram.com/selectionsdesign/",
      "https://www.facebook.com/selectionsdesign/",
      "https://www.linkedin.com/company/selections-interiors-and-design/",
    ],
  } as Record<string, unknown>,

  /** Tracking IDs come from the environment, never this file: .env locally, repo variables
      in CI (tools/deploy.sh copies them over). Empty = that snippet is left out. Only
      production builds get them, so `npm run dev` visits never reach the client's reports. */
  tracking: {
    /** GTM-XXXXXXX. GA4 and the form key event are configured inside the container */
    gtm: env("PUBLIC_GTM_ID"),
    /** G-XXXXXXXXXX. Loaded directly with gtag.js only when there is no GTM container */
    ga4: env("PUBLIC_GA4_ID"),
    /** Search Console HTML-tag token (the content="…" value). Not needed if GSC is verified via GTM or DNS */
    gscVerification: env("PUBLIC_GSC_VERIFICATION"),
  },
};

function env(name: string): string {
  return import.meta.env.PROD ? String(import.meta.env[name] ?? "").trim() : "";
}

export type NavKey = (typeof site.nav)[number]["key"];
