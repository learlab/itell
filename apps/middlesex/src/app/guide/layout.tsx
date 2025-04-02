import { Metadata } from "next";
import { volume } from "#content";

import { MainNav } from "@/components/main-nav";
import { Meta } from "@/config/metadata";
import { env } from "@/env.mjs";

export const generateMetadata = async (): Promise<Metadata> => {
  const title = Meta.guide.title;
  const description = Meta.guide.description;
  const ogUrl = new URL(`${env.NEXT_PUBLIC_HOST}/og`);

  ogUrl.searchParams.set("title", title);
  ogUrl.searchParams.set("description", description);

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${volume.title}`,
      description,
      type: "article",
      url: `${env.NEXT_PUBLIC_HOST}/guide`,
      images: [
        {
          url: ogUrl,
        },
      ],
    },
  };
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainNav scrollProgress />
      <main className="mx-auto min-h-screen max-w-4xl p-4 lg:p-8">
        {children}
      </main>
    </>
  );
}
