import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@itell/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@itell/ui/alert-dialog";
import { Badge } from "@itell/ui/badge";
import { Button } from "@itell/ui/button";
import { Label } from "@itell/ui/label";
import { ScrollArea } from "@itell/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@itell/ui/select";
import { SidebarInset, SidebarProvider } from "@itell/ui/sidebar";
import { pages } from "#content";
import { User } from "lucia";
import { BanIcon } from "lucide-react";

import { deleteSurveyAction } from "@/actions/survey";
import { updateUserAction } from "@/actions/user";
import { AdminButton } from "@/components/admin-button";
import { ContinueReading } from "@/components/continue-reading";
import {
  getSurveySessions,
  isOuttakeReady,
  isSurveySessionFinished,
} from "@/db/survey";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/auth/role";
import { Survey } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { SetProgressSubmitButton } from "./_components/set-progress-submit-button";
import { SurveyHomeShell } from "./shell";
import { SurveySidebar } from "./survey-sidebar";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<unknown>;
}) {
  const { surveyId } = routes.surveyHome.$parseParams(await params);
  const { user } = await getSession();

  if (!user) {
    return redirectWithSearchParams("/auth", {
      redirect_to: routes.surveyHome({ surveyId }),
    });
  }

  const isReady = isSurveyReady(user, surveyId);
  const admin = isAdmin(user.role);
  if (!isReady) {
    return (
      <SidebarProvider>
        <SurveySidebar
          variant="inset"
          surveyId={surveyId}
          surveySession={undefined}
        />
        <SidebarInset>
          <SurveyHomeShell surveyId={surveyId} user={user}>
            <Alert className="max-w-lg">
              <BanIcon className="size-4" />
              <AlertTitle>Survey not applicable</AlertTitle>
              <AlertDescription>
                This survey is not applicable yet based on your progress. You
                will receive a notice when it&apos;s ready as you continue
                reading the textbook.
              </AlertDescription>
              {admin && <SetProgress user={user} />}
            </Alert>
            <ContinueReading user={user} />
          </SurveyHomeShell>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const session = await getSurveySessions(user, surveyId);
  if (isSurveySessionFinished(session)) {
    return (
      <SidebarProvider>
        <SurveySidebar
          variant="inset"
          surveyId={surveyId}
          surveySession={session ?? undefined}
        />
        <SidebarInset>
          <SurveyHomeShell user={user} surveyId={surveyId}>
            <p className="text-lg font-medium">
              Thank you for completing the survey. You can now go to the
              textbook.
            </p>
            <div className="flex items-center gap-2">
              <ContinueReading user={user} />
              {admin && <DeleteSurvey surveyId={surveyId} />}
            </div>
          </SurveyHomeShell>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return children;
}

function DeleteSurvey({ surveyId }: { surveyId: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <AdminButton variant={"outline"} size={"lg"}>
          Delete Survey Record
        </AdminButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete previous survey record?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete your previous survey submission and allow you to
            re-take the survey. This is for admin testing only.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              "use server";
              await deleteSurveyAction({ surveyId });

              redirect(routes.surveyHome({ surveyId }));
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SetProgress({ user }: { user: User }) {
  return (
    <form
      className="relative mt-8 w-full space-y-4 rounded-md border p-2"
      action={async (formData: FormData) => {
        "use server";

        const pageSlug = String(formData.get("page-progress"));

        await updateUserAction({ pageSlug });
      }}
    >
      <Badge className="absolute right-1/2 top-0 -translate-y-1/2 translate-x-1/2">
        Admin
      </Badge>
      <Label className="flex flex-col gap-3">
        <span>Set progress</span>
        <Select name="page-progress" defaultValue={user.pageSlug ?? undefined}>
          <SelectTrigger className="h-fit text-left">
            <SelectValue placeholder="Select page" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Page</SelectLabel>
              <ScrollArea className="h-[300px]">
                {pages.map((page) => (
                  <SelectItem key={page.slug} value={page.slug}>
                    {page.title}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Label>
      <footer className="flex justify-end">
        <SetProgressSubmitButton />
      </footer>
    </form>
  );
}

function isSurveyReady(user: User, surveyId: string) {
  if (surveyId === Survey.INTAKE) {
    return true;
  }

  if (surveyId === Survey.OUTTAKE) {
    return isOuttakeReady(user);
  }

  return true;
}
