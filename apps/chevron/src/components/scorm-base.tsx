// apps/chevron/src/components/scorm-base.tsx
"use client";

import { Spinner } from "@itell/ui/spinner";
import { useScorm } from "./provider/scorm-provider";

interface ScormBaseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Base component for SCORM integration
 * Shows loading state while SCORM initializes
 * Shows fallback or children based on SCORM environment
 */
export function ScormBase({ children, fallback }: ScormBaseProps) {
  const { isScorm, scormUserId, isLoading } = useScorm();

  // Show loading state while determining SCORM status
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-sm text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  // If we're not in SCORM mode, show the fallback or children
  if (!isScorm) {
    return fallback ? <>{fallback}</> : <>{children}</>;
  }

  // If we're in SCORM mode but don't have a user ID, show error
  if (!scormUserId) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error: No SCORM user ID provided</p>
          <p className="mt-2 text-sm text-gray-600">
            Please make sure you're accessing this content through your learning management system.
          </p>
        </div>
      </div>
    );
  }

  // We have a SCORM user ID, render the children
  return <>{children}</>;
}