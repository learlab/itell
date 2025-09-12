"use client";

import { useEffect, useState } from "react";
import { cn, getChunkElement } from "@itell/utils";

import { scrollToElement } from "@/lib/utils";

const chunkSlugRegex = /{#(.+?)}/;

interface TocItem {
  title: string;
  url: string;
  items: TocItem[];
}

interface TableOfContentsProps {
  toc: TocItem[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((top, entry) => {
            return entry.boundingClientRect.top < top.boundingClientRect.top
              ? entry
              : top;
          });
          
          const chunkSlug = topEntry.target.getAttribute("data-chunk-slug");
          if (chunkSlug) {
            setActiveId(chunkSlug);
          }
        }
      },
      {
        rootMargin: "-10% 0% -10% 0%",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      }
    );

    const chunkElements = toc.map((item) => {
      const match = chunkSlugRegex.exec(item.title);
      const chunkSlug = match && match[1] ? match[1] : item.url;
      return getChunkElement(chunkSlug);
    }).filter(Boolean);

    chunkElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    // Set initial active section
    const findInitialActiveSection = () => {
      const viewportTop = window.scrollY;
      const viewportBottom = viewportTop + window.innerHeight;
      
      for (let i = 0; i < chunkElements.length; i++) {
        const element = chunkElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          
          if (elementTop < viewportBottom && elementBottom > viewportTop) {
            const chunkSlug = element.getAttribute('data-chunk-slug');
            if (chunkSlug) {
              setActiveId(chunkSlug);
              break;
            }
          }
        }
      }
    };

    findInitialActiveSection();

    return () => {
      chunkElements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [toc]);

  const handleClick = (chunkSlug: string) => {
    const element = getChunkElement(chunkSlug);
    if (element) scrollToElement(element);
  };

  // Clean title by removing the {#...} part
  const cleanTitle = (title: string) => {
    return title.replace(/\s*\{#[^}]*\}$/, "");
  };

  if (toc.length === 0) return null;

  return (
    <nav className="sticky top-20 hidden h-fit w-64 lg:block">
      <div className="bg-card rounded-lg border p-4">
        <h3 className="text-muted-foreground mb-4 text-sm font-semibold">
          Table of Contents
        </h3>
        <ul className="space-y-2">
          {toc.map((item) => {
            const match = chunkSlugRegex.exec(item.title);
            const chunkSlug = match && match[1] ? match[1] : item.url;
            const isActive = activeId === chunkSlug;

            return (
              <li key={item.url} data-target={chunkSlug}>
                <button
                  onClick={() => handleClick(chunkSlug)}
                  className={cn(
                    "hover:text-foreground block w-full text-left text-sm transition-colors",
                    isActive
                      ? "text-foreground border-primary -ml-1 border-l-2 pl-3 font-medium"
                      : "text-muted-foreground pl-2"
                  )}
                >
                  {cleanTitle(item.title)}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
