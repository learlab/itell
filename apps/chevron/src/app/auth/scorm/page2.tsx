"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@itell/ui/spinner";

import { useScorm } from "@/components/provider/scorm-provider";

export default function ScormAuthPage() {
  const router = useRouter();
  const { scormUserId, isLoading } = useScorm();

  useEffect(() => {
    console.log("ScormAuthPage useEffect, isLoading:", isLoading, "scormUserId:", scormUserId);
    if (!isLoading && scormUserId) {
      // Redirect to the route handler with the scormUserId as a query param
      console.log("Redirecting to /auth/scorm with scormUserId:", scormUserId);
      router.replace(`/auth/scorm?scormUserId=${scormUserId}`);
    }
  }, [isLoading, scormUserId, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
        <p>Authenticating with SCORM...</p>
      </div>
    </div>
  );
} 