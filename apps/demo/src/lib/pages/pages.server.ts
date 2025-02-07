import "server-only";

import { cache } from "react";
import { pages } from "#content";
import { groupBy } from "es-toolkit";

import { PageData } from ".";

export const getPageData = cache((slug: string | null): PageData | null => {
  if (slug === null) {
    return null;
  }
  const index = pages.findIndex((s) => s.slug === slug);
  if (index === -1) {
    return null;
  }
  const page = pages[index];

  return {
    title: page.title,
    slug: page.slug,
    next_slug: page.next_slug,
    order: page.order,
    quiz: page.quiz,
  };
});

export const allPagesSorted = pages.sort((a, b) => {
  return a.order - b.order;
});

export const quizPages = allPagesSorted.filter((page) => page.quiz);

export const allAssignmentPagesSorted = allPagesSorted.filter(
  (page) => page.assignments.length > 0
);
export const firstPage = allPagesSorted[0];

export const getPage = (slug: string) =>
  allPagesSorted.find((p) => p.slug === slug);

export const tocPages = pages.reduce<(TocPageItem | TocGroup)[]>(
  (acc, page) => {
    const item: TocPageItem = {
      group: false,
      title: page.title,
      slug: page.slug,
      href: page.href,
    };
    if (!page.parent) {
      acc.push(item);
      return acc;
    }

    // if page have a parent, treat it as the children of the latest group
    const group = acc.at(-1);
    if (group?.group && group.slug === page.parent.slug) {
      group.pages.push(item);
    } else {
      acc.push({
        group: true,
        slug: page.parent.slug,
        title: page.parent.title,
        pages: [item],
      });
    }

    return acc;
  },
  []
);

export type TocPageItem = {
  group: false;
  title: string;
  slug: string;
  href: string;
};

type TocGroup = {
  group: true;
  title: string;
  slug: string;
  pages: TocPageItem[];
};

export const pagesByParent = groupBy(
  pages.map((page) => ({
    parentTitle: page.parent?.title ?? "root",
    title: page.title,
    slug: page.slug,
    href: page.href,
  })),
  (page) => page.parentTitle
);

export const isPageAfter = (a: string | undefined, b: string | null) => {
  const aIndex = allPagesSorted.findIndex((s) => s.slug === a);
  const bIndex = allPagesSorted.findIndex((s) => s.slug === b);

  return aIndex > bIndex;
};

export const nextPage = (slug: string): string => {
  const currentPageIndex = allPagesSorted.findIndex((s) => s.slug === slug);

  // If current page is the last one or not found, return the same location
  if (
    currentPageIndex === -1 ||
    currentPageIndex === allPagesSorted.length - 1
  ) {
    return slug;
  }

  // Get the next page
  const nextPage = allPagesSorted[currentPageIndex + 1];

  return nextPage.slug;
};
