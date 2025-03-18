import { Card, CardContent } from "@itell/ui/card";

import { MainNav } from "@/components/main-nav";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";

export default async function ConsentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.quizme(),
    });
  }
  return (
    <>
      <MainNav />
      <Card className="mx-auto mt-4 h-1/2 w-2/3 max-w-6xl border-transparent">
        <CardContent className="relative flex flex-col gap-6 border-transparent">
          <main>{children}</main>
        </CardContent>
      </Card>
    </>
  );
}
