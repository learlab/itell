// apps/chevron/src/app/(textbook)/[slug]/_components/scorm-page-tracker.tsx
"use client";

import { useEffect } from "react";
import { useScorm } from "@/components/provider/scorm-provider";
import { 
  sendProgressUpdate, 
  sendScormUpdate, 
  markCourseCompleted 
} from "@/lib/scorm/scorm-communication";
import { allPagesSorted } from "@/lib/pages/pages.server";

type Props = {
  pageSlug: string;
  totalPages: number;
};

export function ScormPageTracker({ pageSlug, totalPages }: Props) {
  const { isScorm } = useScorm();
  
  useEffect(() => {
    // Only run in SCORM environment
    if (!isScorm) return;
    
    // Find current page and its index
    const currentPage = allPagesSorted.find(page => page.slug === pageSlug);
    if (!currentPage) return;
    
    const pageIndex = currentPage.order;
    const currentPageNumber = pageIndex + 1;
    
    // Calculate progress percentage
    const progressPercentage = Math.round((currentPageNumber / totalPages) * 100);
    
    // Update SCORM with progress
    sendScormUpdate({
      // Score represents percentage of content viewed
      score: progressPercentage,
      // Progress is the current page title
      progress: currentPage.title,
      // Mark as completed if this is the last page
      completion: pageIndex === totalPages - 1,
      // Update lesson status
      lessonStatus: pageIndex === totalPages - 1 ? "completed" : "incomplete"
    });
    
    // If this is the last page, explicitly mark as completed
    if (pageIndex === totalPages - 1) {
      markCourseCompleted(100);
    }
  }, [pageSlug, isScorm, totalPages]);
  
  // This is a tracking component, so it doesn't render anything
  return null;
}