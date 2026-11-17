import snapshot from "../../../public/medium-posts.json";
import { SectionHeading } from "../ui/section-heading";
import { BlogStories } from "./blog-stories";

export function Blog() {
  return (
    <section id="blog" aria-labelledby="blog-title" className="relative border-t border-ink/10 bg-paper/50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="blog-title"
          index="05"
          eyebrow="Blog / field notes"
          title={<>Behind the <span className="font-serif font-normal italic text-blue">build.</span></>}
        >
          The research, decisions and discoveries that turn a question into something worth building.
        </SectionHeading>
        <BlogStories initialData={snapshot} />
      </div>
    </section>
  );
}
