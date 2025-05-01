import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@itell/ui/button";
import { Errorbox } from "@itell/ui/callout";
import { RefreshCw } from "lucide-react";

import { Errors } from "@/lib/constants";

export function DashboardError({
  error,
  title = "Internal error occurred",
  children,
}: {
  error?: Error;
  title?: string;
  children?: React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  let t = title;
  let description: string | undefined = "";
  if (error) {
    switch (error.message) {
      case Errors.TEAHCER_ONLY:
        t = "You are not authorized to view this page.";
        break;
      case Errors.STUDENT_NOT_EXISTS:
        t = "The student does not exist in your class.";
        break;
      default:
        description = "Please contact lear.lab.vu@gmail.com if the problem persists.";
        break;
    }
  }

  return (
    <Errorbox title={t}>
      {children || <p>{description}</p>}

      <footer className="mt-4">
        <Button
          onClick={() => startTransition(() => router.refresh())}
          pending={pending}
          variant={"outline"}
          disabled={pending}
        >
          <span className="flex items-center gap-2">
            <RefreshCw className="size-4" />
            Refresh
          </span>
        </Button>
      </footer>
    </Errorbox>
  );
}
