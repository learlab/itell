import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const RequestSchema = z.object({
  page_slug: z.string(),
  summary: z.string(),
  focus_time: z.record(z.string(), z.number()).optional(),
  chat_history: z
    .array(z.object({ agent: z.string(), text: z.string() }))
    .optional(),
  excluded_chunks: z.array(z.string()).optional(),
  score_history: z.array(z.number()).optional(),
  class_id: z.string().optional(),
});

export const createSummaryRouter = ({
  fetcher,
  apiUrl,
}: {
  fetcher: typeof fetch;
  apiUrl: string;
}) => {
  return new Hono()
    .post("/", zValidator("json", RequestSchema), async (c) => {
      const json = c.req.valid("json");
      const response = await fetcher(`${apiUrl}/score/summary`, {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    })
    .post("/stairs", zValidator("json", RequestSchema), async (c) => {
      const json = c.req.valid("json");
      const response = await fetcher(`${apiUrl}/score/summary/stairs`, {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    });
};
