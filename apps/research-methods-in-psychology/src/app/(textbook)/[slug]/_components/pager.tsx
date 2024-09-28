import { getPageData, PageData } from "@/lib/pages/pages.client";
import { allPagesSorted } from "@/lib/pages/pages.server";
import { Elements } from "@itell/constants";
import { buttonVariants } from "@itell/ui/button";
import { cn } from "@itell/utils";
import { BanIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const getPagerLinks = ({
  pageIndex,
  userPageSlug,
}: {
  pageIndex: number;
  userPageSlug: string | null;
}) => {
  const userPage = getPageData(userPageSlug);
  const links: { prev: PageLinkData | null; next: PageLinkData | null } = {
    prev: pageIndex > 0 ? getPageLink(pageIndex - 1, userPage) : null,
    next:
      pageIndex < allPagesSorted.length - 1
        ? getPageLink(pageIndex + 1, userPage)
        : null,
  };

  return links;
};

const getPageLink = (
  index: number,
  userPage: PageData | null
): PageLinkData | null => {
  const page = allPagesSorted[index];
  if (!page) return null;

  const disabled = userPage ? userPage.order < index : index !== 0 && index > 1;
  return {
    text: page.title,
    href: page.href,
    disabled,
  };
};

export type PageLinkData = {
  text: string;
  href: string;
  disabled: boolean;
  icon?: React.ReactNode;
};
const PageLink = ({
  href,
  disabled,
  children,
  dir,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
  dir: "prev" | "next";
}) => {
  return (
    <Link
      className={cn(
        buttonVariants({ variant: "outline" }),
        "flex h-14 max-w-sm items-center gap-2 text-balance xl:h-20 xl:text-lg",
        { "pointer-events-none opacity-50": disabled }
      )}
      data-no-events={true}
      aria-disabled={disabled}
      aria-label={`Go to ${dir === "prev" ? "previous" : "next"} page`}
      href={href}
    >
      {children}
    </Link>
  );
};

type Props = {
  userPageSlug: string | null;
  pageIndex: number;
};

export const Pager = ({ userPageSlug, pageIndex }: Props) => {
  const { prev, next } = getPagerLinks({
    pageIndex,
    userPageSlug,
  });
  return (
    <nav
      className={cn("pager mt-5 flex flex-row items-center justify-between", {
        "justify-end": next && !prev,
        "justify-start": prev && !next,
      })}
      id={Elements.PAGE_PAGER}
      aria-label="pagination"
    >
      {prev && (
        <PageLink href={prev.href} disabled={prev.disabled} dir="prev">
          {prev.disabled ? (
            <BanIcon className="size-4 shrink-0" />
          ) : (
            <ChevronLeftIcon className="size-4 shrink-0" />
          )}
          <span className="line-clamp-2">{prev.text}</span>
        </PageLink>
      )}
      {next && (
        <PageLink href={next.href} disabled={next.disabled} dir="next">
          <span className="line-clamp-2">{next.text}</span>
          {next.disabled ? (
            <BanIcon className="size-4 shrink-0" />
          ) : (
            <ChevronRightIcon className="size-4 shrink-0" />
          )}
        </PageLink>
      )}
    </nav>
  );
};
