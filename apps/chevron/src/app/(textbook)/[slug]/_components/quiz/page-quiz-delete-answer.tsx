"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteQuizAction } from "@/actions/quiz";
import { AdminButton } from "@/components/admin-button";

export function DeleteQuiz({ pageSlug }: { pageSlug: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <AdminButton
      size={"lg"}
      pending={pending}
      disabled={pending}
      variant={"outline"}
      onClick={() =>
        startTransition(async () => {
          await deleteQuizAction({ pageSlug });
          router.refresh();
        })
      }
    >
      Delete Quiz Answer
    </AdminButton>
  );
}
