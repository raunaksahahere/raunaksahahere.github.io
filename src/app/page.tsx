import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { About } from "@/components/sections/about";
import { Toolbox } from "@/components/sections/toolbox";
import { GitHubActivity, GitHubActivitySkeleton } from "@/components/sections/activity";
import { Contact } from "@/components/sections/contact";
import { Blog } from "@/components/sections/blog";
import { SectionHeading } from "@/components/ui/section-heading";
import { featuredProjects } from "@/data/projects";

export default function Home() {
  const ticker = featuredProjects.map((p) => ({ slug: p.slug, name: p.name, category: p.category }));

  return (
    <>
      <Hero ticker={ticker} />
      <Work />
      <About />

      <section id="toolbox" aria-labelledby="toolbox-title" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            id="toolbox-title"
            index="03"
            eyebrow="Toolbox"
            title={
              <>
                Tools I&apos;ve <span className="font-serif font-normal italic text-blue">actually</span> shipped with.
              </>
            }
          >
            Pulled from the repositories, not a wish list. Pick a drawer, then a tool, to see which projects it lives
            in.
          </SectionHeading>
          <Toolbox />
        </div>
      </section>

      <section id="activity" aria-labelledby="activity-title" className="pb-24 pt-4 sm:pb-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            id="activity-title"
            index="04"
            eyebrow="GitHub activity"
            title={
              <>
                Still <span className="font-serif font-normal italic text-orange">pushing</span>.
              </>
            }
          >
            Checked directly with GitHub when you open this page, then every five minutes while you&apos;re here.
            Public activity only; GitHub&apos;s event feed can lag behind recent pushes.
          </SectionHeading>
          <Suspense fallback={<GitHubActivitySkeleton />}>
            <GitHubActivity />
          </Suspense>
        </div>
      </section>

      <Blog />
      <Contact />
    </>
  );
}
