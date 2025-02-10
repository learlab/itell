import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/auth/role";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { Card, CardContent } from "@itell/ui/card";


export default async function ConsentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.consent(),
    });
  }
  // const hasConsent = user.consentGiven === true;
  // const consentDone = user.consentGiven !== null;
  // const intakeSession = await getSurveySessions(user, Survey.INTAKE);
  // const intakeDone = isSurveySessionFinished(intakeSession);

  return (
    <>
      <Card className="mx-auto mt-4 w-2/3 h-1/2 max-w-6xl border-transparent">
        <CardContent className="relative flex flex-col gap-6 border-transparent">
            <main>{children}</main>
        </CardContent>
      </Card>
    </>
  );
}

// function DeleteConsent() {
//   return (
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         <AdminButton variant="outline" size={"lg"}>
//           Delete Consent Record
//         </AdminButton>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Delete consent record?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This will delete your consetn submission and you will be able to see
//             a fresh consent form. This is for admin testing only.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             onClick={async () => {
//               "use server";
//               await updateUserAction({ consentGiven: null });

//               redirect(routes.consent());
//             }}
//           >
//             Continue
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }