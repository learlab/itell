import Link from "next/link";

import { makePageHref } from "@/lib/utils";

interface Props {
  pageSlug: string;
  children: React.ReactNode;
  className?: string;
  chunkSlug?: string;
}

export function PageLink({ children, pageSlug, chunkSlug, className }: Props) {
  return (
    <Link
      href={makePageHref(pageSlug, chunkSlug)}
      className={className}
      data-on-event
    >
      {children}
    </Link>
  );
}
