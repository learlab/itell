"use client";

import { useEffect, useState } from "react";

export function useScrollThreshold(elementId: string, threshold = 0.95) {
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);

  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const handleScroll = () => {
      const container = document.documentElement;
      const scrollPosition = container.scrollTop + window.innerHeight;
      const elementBottom = element.offsetTop + element.offsetHeight;

      // Calculate if we've scrolled to the threshold percentage of the element
      const scrollPercentage = scrollPosition / elementBottom;

      if (scrollPercentage >= threshold && !hasReachedThreshold) {
        setHasReachedThreshold(true);
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [elementId, threshold, hasReachedThreshold]);

  return hasReachedThreshold;
}
