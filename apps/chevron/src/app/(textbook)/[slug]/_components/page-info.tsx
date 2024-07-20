"use client";
import { useSession } from "@/components/provider/session-provider";
import { getPageStatus } from "@/lib/page-status";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@itell/ui/client";
import { EyeIcon, LockIcon, UnlockIcon } from "lucide-react";

type Props = {
	pageSlug: string;
};

export const PageInfo = ({ pageSlug }: Props) => {
	const { user } = useSession();
	const status = getPageStatus({
		pageSlug,
		userPageSlug: user?.pageSlug || null,
		userFinished: user?.finished || false,
	});

	return (
		<HoverCard>
			<HoverCardTrigger>
				<Button className="text-left text-sm px-0 " variant="link">
					{status.unlocked ? (
						<span>
							<UnlockIcon className="size-4 mr-1 inline" />
							Unlocked
						</span>
					) : status.latest ? (
						<span>
							<EyeIcon className="size-4 mr-1 inline" />
							In progress
						</span>
					) : (
						<span>
							<LockIcon className="size-4 mr-1 inline" />
							Locked
						</span>
					)}
				</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-48 text-sm">
				{status.latest
					? "Answer questions and summarize this chapter to move forward"
					: status.unlocked
						? "You have completed this page. You can now view all its content"
						: "You haven't got access to this page yet"}
			</HoverCardContent>
		</HoverCard>
	);
};