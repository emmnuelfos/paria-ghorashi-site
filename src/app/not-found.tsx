import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageSections";
import { NOT_FOUND } from "@/data/pages-content-3";

/** Static export writes this to 404.html, which GitHub Pages serves. */
export default function NotFound() {
  return (
    <PageShell>
      <PageHero
        eyebrow="404"
        headline={NOT_FOUND.headline}
        body={[NOT_FOUND.body]}
        buttons={NOT_FOUND.buttons}
      />
    </PageShell>
  );
}
