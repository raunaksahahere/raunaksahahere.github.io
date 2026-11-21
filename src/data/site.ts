/**
 * Site-wide configuration and public profiles.
 */
export const site = {
  name: "Raunak Saha",
  shortName: "Raunak",
  /** Set NEXT_PUBLIC_SITE_URL in production; Vercel's production URL is used as a fallback. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  title: "Raunak Saha — builds things that probably shouldn't exist yet",
  description:
    "Raunak Saha is a developer from Kolkata building developer tools, applied-AI systems and offline-first apps: CodeMeet, Kavach Pay, Parity, PlanTwin, cfgcanary and more.",
  location: "Kolkata, India",
  resume: {
    href: "/resume/Raunak_Saha_Resume.pdf",
    fileName: "Raunak_Saha_Resume.pdf",
  },
  email: "raunaksaha22@gmail.com",
  githubUser: "raunaksahahere",
  socials: {
    github: "https://github.com/raunaksahahere",
    linkedin: "https://www.linkedin.com/in/raunak-saha-33aa46406/",
    youtube: "https://www.youtube.com/@raunaksahahere",
  },
} as const;

export const navLinks = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#toolbox", label: "Toolbox" },
  { href: "/#activity", label: "Activity" },
  { href: "/#blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
] as const;
