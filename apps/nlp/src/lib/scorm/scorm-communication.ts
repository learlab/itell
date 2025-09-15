"use client";

/**
 * SCORM Communication Utility
 *
 * These functions allow communication with the SCORM parent container.
 * They send postMessage events to update the SCORM package with various statuses.
 * Matches the message format expected by launcher.html.
 */
import { Page } from "#content";
import { allPagesSorted } from "tests/utils";

import { isLastPage } from "@/lib/pages";

// Types for SCORM messages
export type ScormScoreMessage = {
  type: "scoreUpdate";
  score: number; // 0-100
};

export type ScormProgressMessage = {
  type: "progressUpdate";
  progress: string; // Usually a percentage or page identifier
};

export type ScormLessonStatusMessage = {
  type: "lessonStatusUpdate";
  lessonStatus: "incomplete" | "completed" | "passed" | "failed" | "browsed";
};

export type ScormCompletionMessage = {
  type: "completionUpdate";
  completion: boolean;
};

export type ScormUpdateMessage = {
  type: "scormUpdate";
  score?: number;
  progress?: string;
  lessonStatus?: string;
  completion?: boolean;
};

type ScormMessage =
  | ScormScoreMessage
  | ScormProgressMessage
  | ScormLessonStatusMessage
  | ScormCompletionMessage
  | ScormUpdateMessage;

/**
 * Checks if the app is running within an iframe
 */
export const isInIframe = (): boolean => {
  if (typeof window === "undefined") return false;
  return window !== window.parent;
};

/**
 * Send a ready message to the SCORM container
 * This is used to request the SCORM user ID
 */
export const sendScormReadyMessage = (): boolean => {
  if (!isInIframe()) {
    return false;
  }

  try {
    window.parent.postMessage({ type: "scormReady" }, "*");

    return true;
  } catch (error) {
    console.error("Error sending ready message:", error);
    return false;
  }
};

/**
 * Post a message to the SCORM container
 */
const postToScormContainer = (message: ScormMessage): boolean => {
  if (!isInIframe()) {
    return false;
  }

  try {
    window.parent.postMessage(message, "*");
    return true;
  } catch (error) {
    console.error("Error sending SCORM message:", error);
    return false;
  }
};

/**
 * Send a score update to the SCORM container
 * @param score - Score value (0-100)
 */
export const sendScoreUpdate = (score: number): boolean => {
  return postToScormContainer({
    type: "scoreUpdate",
    score: Math.min(Math.max(score, 0), 100), // Ensure score is between 0-100
  });
};

/**
 * Send a progress update to the SCORM container
 * @param progress - Progress indicator (e.g., "50%" or "page-3")
 */
export const sendProgressUpdate = (progress: string): boolean => {
  return postToScormContainer({
    type: "progressUpdate",
    progress,
  });
};

/**
 * Send a lesson status update to the SCORM container
 * @param lessonStatus - SCORM lesson status
 */
export const sendLessonStatusUpdate = (
  lessonStatus: "incomplete" | "completed" | "passed" | "failed" | "browsed"
): boolean => {
  return postToScormContainer({
    type: "lessonStatusUpdate",
    lessonStatus,
  });
};

/**
 * Send a completion update to the SCORM container
 * @param completion - Whether the course is completed
 */
export const sendCompletionUpdate = (completion: boolean): boolean => {
  return postToScormContainer({
    type: "completionUpdate",
    completion,
  });
};

/**
 * Send a combined SCORM update to the container
 * @param options - Various SCORM status options to update
 */
export const sendScormUpdate = (options: {
  score?: number;
  progress?: string;
  lessonStatus?: "incomplete" | "completed" | "passed" | "failed" | "browsed";
  completion?: boolean;
}): boolean => {
  // Validate score if provided

  if (options.score !== undefined) {
    options.score = Math.min(Math.max(options.score, 0), 100);
  }

  return postToScormContainer({
    type: "scormUpdate",
    ...options,
  });
};

/**
 * Mark the course as completed
 * This is a convenience function that sends both completion and lesson status
 */
export const markCourseCompleted = (score?: number): boolean => {
  const message: ScormUpdateMessage = {
    type: "scormUpdate",
    completion: true,
    lessonStatus: "completed",
  };

  if (score !== undefined) {
    message.score = Math.min(Math.max(score, 0), 100);
  }

  return postToScormContainer(message);
};

/**
 * Mark the course as passed with a score
 */
export const markCoursePassed = (score: number): boolean => {
  return sendScormUpdate({
    score: score,
    lessonStatus: "passed",
    completion: true,
  });
};

/**
 * Mark the course as failed with a score
 */
export const markCourseFailed = (score: number): boolean => {
  return sendScormUpdate({
    score: score,
    lessonStatus: "failed",
    completion: true,
  });
};

/**
 * Track a page visit and update progress
 * @param pageSlug - The slug of the visited page
 * @param totalPages - Total number of pages in the course
 * @param visitedPages - Array of visited page slugs
 */
export const trackPageVisit = (
  pageSlug: string,
  totalPages: number,
  visitedPages: string[]
): boolean => {
  // Calculate progress as percentage
  const uniqueVisitedPages = new Set([...visitedPages, pageSlug]);
  const progressPercentage = Math.round(
    (uniqueVisitedPages.size / totalPages) * 100
  );

  // Determine if course is complete based on visiting all pages
  const isComplete = uniqueVisitedPages.size === totalPages;

  return sendScormUpdate({
    progress: `${progressPercentage}%`,
    lessonStatus: isComplete ? "completed" : "incomplete",
    completion: isComplete,
  });
};

/**
 * Set up a listener for SCORM messages from the parent
 * @param callback - Function to call when a message is received
 */
export const listenForScormMessages = (
  callback: (message: any) => void
): (() => void) => {
  if (typeof window === "undefined") return () => {};

  const handler = (event: MessageEvent) => {
    // Call the callback with the message data
    callback(event.data);
  };

  window.addEventListener("message", handler);

  // Return a function to remove the listener
  return () => {
    window.removeEventListener("message", handler);
  };
};

/* advance scorm progress */
export const advanceScormProgress = (currentPage: Page) => {
  const totalPages = allPagesSorted.length;
  const currentPageIndex = currentPage.order;
  const progressPercentage = Math.round(
    ((currentPageIndex + 1) / totalPages) * 100
  );

  // Send SCORM updates
  sendScormUpdate({
    score: progressPercentage,
    progress: currentPage.title,
    lessonStatus: isLastPage(currentPage) ? "completed" : "incomplete",
    completion: isLastPage(currentPage),
  });
};
