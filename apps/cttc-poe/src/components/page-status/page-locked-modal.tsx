"use client";

import { isProduction } from "@/lib/constants";
import { firstSummaryPage } from "@/lib/pages";
import { makePageHref } from "@/lib/utils";
import { Button } from "@itell/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@itell/ui/dialog";
import Link from "next/link";
import { useState } from "react";

type Props = {
	userPageSlug: string | null;
};

export const PageLockedModal = ({ userPageSlug }: Props) => {
	const [open, setOpen] = useState(true);
	const href = makePageHref(userPageSlug || firstSummaryPage.page_slug);
	return (
		<Dialog
			open={open}
			onOpenChange={() => {
				if (!isProduction) {
					setOpen(false);
				}
			}}
		>
			<DialogContent canClose={!isProduction}>
				<DialogHeader>
					<DialogTitle>You haven't unlocked this page yet</DialogTitle>
				</DialogHeader>
				<div>
					Submit a passing summary for
					<Link href={href} className="mx-1 underline font-semibold">
						<span> this page </span>
					</Link>
					first.
				</div>
				<DialogFooter>
					<Button>
						<Link href={href}>Go to page</Link>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
