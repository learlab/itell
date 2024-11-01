import { Editor } from "@/components/editor";
import { ExampleSelect } from "@/components/example-select";
import { PageCard } from "@/components/page-card";
import { PreviewController } from "@/components/preview-controller";
import { Reference } from "@/components/reference";
import { SearchStrapi } from "@/components/search-strapi";
import { Share } from "@/components/share";
import { ThemeToggle } from "@/components/theme-toggle";
import { Split } from "@/components/ui/split";
import { routes } from "@/lib/navigation";
import { PageData, getPage } from "@/lib/strapi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@itell/ui/tabs";
import Link from "next/link";
import { examples } from "#content";
import { HomeProvider } from "./home-provider";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

examples.sort((a, b) => a.order - b.order);
const defaultExample = examples.find(
  (example) => example.slug === "basic-markdown"
);

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  const { page, text, example } = routes.home.$parseSearchParams(searchParams);
  let initialValue = defaultExample?.content || "";
  let initialSlug: string | undefined = defaultExample?.slug || undefined;
  let pageData: PageData | null = null;

  try {
    if (page !== undefined) {
      pageData = await getPage(page);
      if (pageData) {
        initialValue = pageData.content.join("\n");
        initialSlug = undefined;
      }
    } else if (text !== undefined) {
      initialValue = atob(text);
      initialSlug = undefined;
    } else if (example !== undefined) {
      const exampleData = examples.find((e) => e.slug === example);
      if (exampleData) {
        initialValue = exampleData.content;
        initialSlug = exampleData.slug;
      }
    }
  } catch (err) {
    console.log(err);
    initialValue = defaultExample?.content || "";
    initialSlug = defaultExample?.slug || undefined;
  }

  return (
    <HomeProvider initialValue={initialValue}>
      <div className="flex justify-center gap-4 items-center">
        <h1 className="text-2xl tracking-tight font-extrabold leading-tight text-center">
          iTELL Markdown Preview
        </h1>
        <ThemeToggle />
      </div>

      {pageData && (
        <Link href={routes.preview({ search: { page: pageData.id } })}>
          <PageCard
            className="hover:bg-accent"
            title={pageData.title}
            volume={pageData.volume}
          />
        </Link>
      )}

      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor">Preview</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <div className="flex items-center justify-between">
            <ExampleSelect initialSlug={initialSlug} />
            <div className="space-x-2">
              <SearchStrapi />
              <Share />
            </div>
          </div>
          <Split
            direction="horizontal"
            minSize={100}
            expandToMin={false}
            sizes={[50, 50]}
            gutterSize={10}
            snapOffset={30}
            className="flex gap-4"
          >
            <section aria-label="editor" className="basis-[100%]">
              <Editor />
            </section>
            <section aria-label="preview" className="basis-[100%]">
              <PreviewController />
            </section>
          </Split>
        </TabsContent>
        <TabsContent value="reference">
          <Reference />
        </TabsContent>
      </Tabs>
    </HomeProvider>
  );
}
