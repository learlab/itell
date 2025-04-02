import { createNavigationConfig } from "next-safe-navigation";
import { z } from "zod";

export const { routes, useSafeParams, useSafeSearchParams } =
  createNavigationConfig((defineRoute) => ({
    home: defineRoute("/", {
      search: z.object({
        text: z.string().optional(),
        page: z.string().optional(),
        example: z.string().optional(),
      }),
    }),
    preview: defineRoute("/preview", {
      search: z.object({
        page: z.coerce.string(),
      }),
    }),
  }));
