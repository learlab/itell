import qs from "qs";
import { cache } from "react";

const baseURL = "https://itell-strapi-um5h.onrender.com/api";

export type SearchPageResult = {
  id: string;
  title: string;
  volume?: string | null;
  slug: string;
};

export type Volume = {
  title: string;
  slug: string | undefined;
};
export const searchVolumes = cache(async () => {
  const response = await fetch(`${baseURL}/texts`);
  if (!response.ok) {
    return null;
  }
  const { data } = await response.json();
  return data.map((text: any) => ({
    title: text.Title,
    slug: text.Slug,
  }));
});

export const searchPages = cache(
  async ({
    volumeSlug,
  }: {
    volumeSlug: string;
  }): Promise<SearchPageResult[] | null> => {
    const filters = qs.stringify({
      fields: ["id", "Title", "Slug"],
      filters: {
        Volume: {
          Slug: {
            $eq: volumeSlug,
          },
        },
      },
    });
    const response = await fetch(`${baseURL}/pages?${filters}`);
    if (!response.ok) {
      return null;
    }

    const { data } = (await response.json()) as any;
    return data.map((page: any) => ({
      id: page.documentId,
      title: page.Title,
      slug: page.Slug,
    }));
  }
);

export const searchPage = cache(
  async (slug: string): Promise<SearchPageResult | null> => {
    const filters = qs.stringify({
      filters: {
        Slug: {
          $eq: slug,
        },
      },
    });

    const response = await fetch(`${baseURL}/pages?${filters}`);
    console.log(`${baseURL}/pages?${filters}`);
    if (!response.ok) {
      return null;
    }

    const { data } = await response.json();
    console.log("searched dta is", data);
    if (data.length === 0) {
      return null;
    }
    const id = data[0].documentId;
    const pageFilter = qs.stringify({
      fields: ["id", "Title", "Slug", "documentId"],
      populate: {
        Volume: true,
      },
    });
    const pageResponse = await fetch(`${baseURL}/pages/${id}?${pageFilter}`);
    if (!pageResponse.ok) {
      return null;
    }
    const { data: pageData } = (await pageResponse.json()) as any;
    return {
      id: pageData.documentId,
      title: pageData.Title,
      slug: pageData.Slug,
      volume: pageData.Volume?.data?.Title || null,
    };
  }
);

export type PageData = {
  id: string;
  title: string;
  volume: string | null;
  content: string[];
};

const pageFilter = qs.stringify({
  fields: ["Title", "Slug"],
  populate: {
    Content: true,
    Volume: true,
  },
});
export const getPage = cache(async (id: string) => {
  const response = await fetch(`${baseURL}/pages/${id}?${pageFilter}`);
  if (!response.ok) {
    return null;
  }
  const { data } = await response.json();
  return {
    id,
    title: data.Title,
    volume: data.Volume?.data?.Title || null,
    content:
      data.Content?.map((chunk: any) => getChunkContent(chunk, data.Slug)) ||
      [],
  };
});

const getChunkContent = (chunk: any, pageSlug: string) => {
  const question = chunk.Question;
  const answer = chunk.ConstructedResponse;
  const cri =
    question && answer
      ? `\n<i-question question='${question}' answer='${answer}' page-slug='${pageSlug}' chunk-slug='${chunk.Slug}' >\n</i-question>`
      : "";

  const heading = `## ${chunk.Header} {#${chunk.Slug}${
    chunk.ShowHeader ? "" : " .sr-only"
  }}`;
  const content = "MD" in chunk ? chunk.MD : chunk.MDX;
  return `${heading}\n${content}${cri}`;
};
