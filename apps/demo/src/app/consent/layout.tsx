import Link from "next/link";
import { redirect } from "next/navigation";
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
import { Button, buttonVariants } from "@itell/ui/button";
import { Card, CardContent } from "@itell/ui/card";
import { User } from "lucia";

import { getSurveyAction } from "@/actions/survey";
import { updateUserAction } from "@/actions/user";
import { AdminButton } from "@/components/admin-button";
import { ContinueReading } from "@/components/continue-reading";
import { MainNav } from "@/components/main-nav";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/auth/role";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";

export default async function ConsentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams("/auth", { redirect_to: "/consent" });
  }
  const [intakeSession] = await getSurveyAction({ surveyId: "intake" });
  const hasConsent = user.consentGiven === true;
  const consentDone = user.consentGiven !== null;
  const intakeDone = intakeSession && intakeSession.finishedAt !== null;

  return (
    <>
      <MainNav />
      <Card className="mx-auto mt-4 min-h-screen max-w-6xl">
        <CardContent className="relative flex flex-col gap-6 sm:flex-row lg:text-lg">
          <aside className="top-20 flex h-fit basis-1/3 flex-col gap-4 sm:sticky">
            {hasConsent ? (
              intakeDone ? (
                <NoAction user={user} />
              ) : (
                <GoIntake />
              )
            ) : consentDone ? (
              <p className="text-muted-foreground">
                You have chosen to not give consent, you could still read the
                textbook. If you change your mind, you can give consent at any
                time.
              </p>
            ) : (
              <p className="text-muted-foreground">
                Please complete the following consent form before you start the
                textbook.
              </p>
            )}
            {consentDone && isAdmin(user.role) && <DeleteConsent />}
          </aside>
          <main className="basis-2/3">{children}</main>
        </CardContent>
      </Card>
    </>
  );
}

function GoIntake() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground">
        Thank you for giving consent. To customize your learning experience,
        please take the following survey to help us know more about you.
      </p>
      <Link
        className={buttonVariants()}
        href={routes.surveyHome({ surveyId: "intake" })}
      >
        Take Survey
      </Link>
    </div>
  );
}

function NoAction({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground">
        Thank you for giving consent, you can review our policies or go back to
        the textbook.
      </p>
      <ContinueReading user={user} />
    </div>
  );
}

function DeleteConsent() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <AdminButton variant="outline" size={"lg"}>
          Delete Consent Record
        </AdminButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete consent record?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete your consetn submission and you will be able to see
            a fresh consent form. This is for admin testing only.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              "use server";
              await updateUserAction({ consentGiven: null });

              redirect(routes.consent());
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
