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
      <main>{children}</main>
    </>
  );
}
