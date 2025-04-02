import { exec } from "node:child_process";
import { promisify } from "node:util";

import rehypeAddCri from "@itell/rehype-add-cri";
import rehypeWrapHeadingSection from "@itell/rehype-wrap-heading-section";
import rehypeFormat from "rehype-format";
import rehypeKatex from "rehype-katex";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkGfm from "remark-gfm";
import remarkHeadingAttrs from "remark-heading-attrs";
import remarkMath from "remark-math";
import { defineCollection, defineConfig, defineSchema, s } from "velite";

import { SurveySchema } from "@/lib/survey-data";

const execAsync = promisify(exec);
const timestamp = defineSchema(() =>
  s
    .custom<string | undefined>((i) => i === undefined || typeof i === "string")
    .transform<string | null>(async (value, { meta, addIssue }) => {
      if (value !== undefined) {
        addIssue({
          fatal: false,
          code: "custom",
          message:
            "`s.timestamp()` schema will resolve the value from `git log -1 --format=%cd`",
        });
      }
      const { stdout } = await execAsync(
        `git log -1 --format=%cd ${meta.path}`
      );
      if (stdout === "") {
        return null;
      }
      return new Date(stdout).toDateString();
    })
);

const pages = defineCollection({
  name: "Page",
  pattern: "textbook/**/*.md",
  schema: s
    .object({
      title: s.string(),
      order: s.number(),
      slug: s.slug(),
      next_slug: s.string().nullable(),
      parent: s
        .object({
          title: s.string(),
          slug: s.string(),
        })
        .nullable(),
      assignments: s.array(s.string()),
      description: s.string().optional(),
      chunks: s.array(
        s.object({
          title: s.string(),
          slug: s.string(),
          type: s.enum(["plain", "regular", "video"]),
          headings: s
            .array(
              s.object({
                title: s.string(),
                level: s.union([s.literal(3), s.literal(4)]),
                slug: s.string(),
              })
            )
            .optional(),
        })
      ),
      quiz: s
        .array(
          s.object({
            question: s.string(),
            answers: s.array(
              s.object({
                answer: s.string(),
                correct: s.boolean(),
              })
            ),
          })
        )
        .nullable(),
      excerpt: s.excerpt(),
      last_modified: timestamp(),
      cri: s.array(
        s.object({
          slug: s.string(),
          question: s.string(),
          answer: s.string(),
        })
      ),
      html: s.markdown({
        remarkPlugins: [remarkHeadingAttrs, remarkMath],
        rehypePlugins: [
          rehypeWrapHeadingSection,
          // @ts-expect-error plugin has wrong type
          rehypeKatex,
          rehypeAddCri,
          rehypeFormat,
        ],
      }),
    })
    .transform((data) => {
      return {
        ...data,
        summary: data.assignments.includes("summary"),
        href: `/${data.slug}`,
      };
    }),
});

const guides = defineCollection({
  name: "Guide",
  pattern: "guide/**/*.md",
  schema: s.object({
    condition: s.string(),
    html: s.markdown(),
  }),
});

const home = defineCollection({
  name: "Home",
  pattern: "home.md",
  single: true,
  schema: s.object({
    html: s.markdown(),
  }),
});

const surveys = defineCollection({
  name: "Survey",
  pattern: "survey/*.json",
  schema: SurveySchema,
});

const volume = defineCollection({
  name: "Volume",
  single: true,
  pattern: "textbook/volume.yaml",
  schema: s.object({
    title: s.string(),
    description: s.string(),
    slug: s.string(),
    free_pages: s.array(s.string()),
    latex: s.boolean().default(false),
    summary: s.string().nullable(),
  }),
});

export default defineConfig({
  root: "./content",
  collections: { pages, guides, surveys, home, volume },
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeUnwrapImages],
  },
});
