"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@itell/ui/spinner";

import { useScorm } from "@/components/provider/scorm-provider";

export default function ScormAuthPage() {
  const router = useRouter();
  const { scormUserId, isLoading } = useScorm();

  useEffect(() => {
    
    if (!isLoading && scormUserId) {
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