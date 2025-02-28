"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDebounce } from "@itell/core/hooks";
import { Button } from "@itell/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@itell/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@itell/ui/tooltip";
import { cn } from "@itell/utils";
import { Page } from "#content";
import { PinIcon, TableOfContentsIcon } from "lucide-react";

import { PAGE_HEADER_PIN_COOKIE } from "@/lib/constants";
import { setCookie } from "@/lib/cookie";
import { PageStatus } from "@/lib/page-status";
import { NoteCount } from "./_components/note/note-count";
import { PageStatusInfo } from "./_components/page-status-info";

export function PageHeader({
  page,
  pageStatus,
  hide,
}: {
  page: Page;
  pageStatus: PageStatus;
  hide: boolean;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [shouldAutoHide, setShouldAutoHide] = useState(hide);

  useEffect(() => {
    const controlNavbar = () => {
      if (!shouldAutoHide) return;
      if (window.scrollY > lastScrollY) {
        // if scroll down hide the navbar
        setIsVisible(false);
      } else {
        // if scroll up show the navbar
        setIsVisible(true);
      }

      // remember current page location to use in the next move
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    // cleanup function
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY, shouldAutoHide]);

  return (
    <header
      id="page-header"
      className={cn(
        `bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky
        top-[calc(var(--nav-height))] z-40 col-span-full flex items-center
        justify-between border-b-2 px-4 py-3 backdrop-blur transition-all duration-300
        ease-in-out`,
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="flex items-center gap-2">
        <HeaderControl
          hide={shouldAutoHide}
          onHideToggle={() => {
            setCookie(
              PAGE_HEADER_PIN_COOKIE,
              !shouldAutoHide ? "true" : "false"
            );
            setShouldAutoHide(!shouldAutoHide);
          }}
        />
        <h2 className="text-balance text-lg font-medium tracking-tight">
          {page.title}
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <TableOfContents page={page} />
        <NoteCount />
        <PageStatusInfo status={pageStatus} />
      </div>
    </header>
  );
}

function HeaderControl({
  hide,
  onHideToggle,
}: {
  hide: boolean;
  onHideToggle: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="size-6"
          onClick={onHideToggle}
        >
          <PinIcon
            className={cn("size-4 shrink-0 rotate-45 transition-all", {
              "rotate-0": !hide,
            })}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={12} side="bottom">
        {hide ? "Display" : "Hide"} header
      </TooltipContent>
    </Tooltip>
  );
}

function TableOfContents({ page }: { page: Page }) {
  const [_activeHeading, setActiveHeading] = useState<string | null>(
    page.chunks[0].slug
  );
  const activeHeading = useDebounce(_activeHeading, 100);
  const activeHeadingTitle = page.chunks.find(
    (chunk) => chunk.slug === activeHeading
  )?.title;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const chunkSlug = el.dataset.chunkSlug;
            if (chunkSlug) {
              setActiveHeading(chunkSlug);
            }
          }
        });
      },
      { rootMargin: "-10% 0% -80% 0%" }
    );

    page.chunks.forEach((chunk) => {
      const el = document.querySelector(
        `section[data-chunk-slug='${chunk.slug}']`
      );
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Popover>
        <PopoverTrigger aria-label="Table of Contents" asChild>
          <Button
            className="items-center px-1.5 text-sm"
            variant={"ghost"}
            size={"sm"}
          >
            <TableOfContentsIcon className="mr-1 size-4" />
            <span
              className={cn(
                // add a fade-in effect except when activeHeading is the first section heading
                _activeHeading !== page.chunks[0].slug && "fade-in2"
              )}
              key={activeHeadingTitle}
            >
              {activeHeadingTitle}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <ul className="flex flex-col gap-2">
            {page.chunks.map((chunk) => (
              <li key={chunk.slug}>
                <Link
                  href={`#${chunk.slug}`}
                  className={cn(
                    "text-sm hover:underline",
                    chunk.slug === activeHeading && "font-semibold"
                  )}
                >
                  {chunk.title}
                </Link>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
