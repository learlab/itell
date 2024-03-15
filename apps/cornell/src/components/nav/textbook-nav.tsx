import { getSiteConfig } from "@/lib/config";
import { firstPage } from "@/lib/pages";
import { makePageHref } from "@/lib/utils";
import { cn } from "@itell/core/utils";
import { buttonVariants } from "@itell/ui/server";
import Image from "next/image";
import Link from "next/link";
import { CommandMenu } from "../command-menu";
import ThemeToggle from "../theme/theme-toggle";
import { UserAccountNav } from "../user-account-nav";
import SiteNav from "./site-nav";
import { ScrollProgress } from "./textbook-scroll-progress";

export default async function TextbookNavbar() {
	const { title } = await getSiteConfig();

	return (
		<SiteNav>
			<div className="container flex h-16 w-full items-center space-x-4 justify-between sm:space-x-0">
				<div className="flex gap-4 items-center">
					<Image
						src="/images/itell.svg"
						alt="itell logo"
						width={24}
						height={32}
						className="mr-2"
					/>
					<Link href="/" className="hidden items-center space-x-2 md:flex">
						<span className="hidden font-bold sm:inline-block">{title}</span>
					</Link>
					<Link
						href={makePageHref(firstPage.page_slug)}
						className={cn(
							buttonVariants({ variant: "outline" }),
							"flex items-center space-x-2 text-base",
						)}
					>
						<span className="font-bold sm:inline-block">Read</span>
					</Link>
				</div>

				<div className="ml-auto flex items-center gap-2">
					<CommandMenu />
					<ThemeToggle />
					<UserAccountNav />
				</div>
			</div>

			<ScrollProgress />
		</SiteNav>
	);
}
