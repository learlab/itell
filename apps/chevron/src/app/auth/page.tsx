import { type Metadata } from "next";
import Link from "next/link";
import { Button } from "@itell/ui/button";
import { Errorbox } from "@itell/ui/callout";
import { AuthForm, LogoutButton } from "@auth/auth-form";
import { KnowledgeCarousel } from "@auth/knowledge-carousel";
import { volume } from "#content";
import { ChevronLeftIcon, CommandIcon } from "lucide-react";

import { env } from "@/env.mjs";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { DeleteAccount } from "./_components/delete-account";

const ErrorDict: Record<string, string> = {
  oauth: "A problem occurred while logging in. Please try again later.",
  access_denied:
    "This application needs your consent to access your social account. You may come back at any time.",
  wrong_email: "Please sign in with your company email.",
};

export const generateMetadata = async (props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> => {
  const searchParams = routes.auth.$parseSearchParams(await props.searchParams);
  const dst = searchParams.redirect_to;
  const fromDashboard = dst === "/dashboard";
  if (fromDashboard) {
    const title = "Dashboard";
    const description = `Learning statistics on the ${volume.title} intelligent textbook`;
    return {
      title,
      description,
      metadataBase: new URL(env.NEXT_PUBLIC_HOST),
      openGraph: {
        title: `${title} | ${volume.title}`,
        description,
        type: "article",
        url: `${env.NEXT_PUBLIC_HOST}/dashboard`,
        images: [
          {
            url: "/og?dashboard=true",
          },
        ],
      },
    };
  }

  const title = "Create an account";
  const description = "Getting started with the textbook";
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${volume.title}`,
      description,
      type: "article",
      url: `${env.NEXT_PUBLIC_HOST}/auth`,
      images: [
        {
          url: "/og?auth=true",
        },
      ],
    },
  };
};

export default async function Page(props: {
  searchParams: Promise<Record<string, string> | undefined>;
}) {
  const searchParams = await props.searchParams;
  const { error, join_class_code } =
    routes.auth.$parseSearchParams(searchParams);
  const { user } = await getSession();
  let errorMessage: string | null = null;
  if (error) {
    if (error in ErrorDict) {
      errorMessage = ErrorDict[error];
    } else {
      errorMessage = "An internal error occurred. Please try again later.";
    }
  }

  return (
    <div className="grid h-screen w-screen items-center lg:grid-cols-2">
      <div className="col-span-2 lg:col-span-1 lg:p-8">
        <header>
          <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
            <Button variant="ghost" className="gap-2">
              <ChevronLeftIcon />
              Home
            </Button>
          </Link>
        </header>
        <main className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <CommandIcon className="mx-auto size-6" />
            <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
            <p className="text-lg font-light tracking-tight">{volume.title}</p>
          </div>
          {error ? (
            <Errorbox role="alert">
              {errorMessage ? errorMessage : error}
            </Errorbox>
          ) : null}
          {user ? (
            <div className="flex flex-col gap-2 text-center">
              <p className="font-light">
                You are logged in as{" "}
                <span className="font-semibold">{user.name}</span>
              </p>
              <LogoutButton />
              <DeleteAccount />
            </div>
          ) : (
            <AuthForm joinClassCode={join_class_code} />
          )}
        </main>
      </div>
      <div
        aria-hidden="true"
        className="hidden h-full bg-muted lg:col-span-1 lg:flex lg:items-center"
      >
        <KnowledgeCarousel />
      </div>
    </div>
  );
}
