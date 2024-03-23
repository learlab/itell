import { PageStatus } from "@/lib/page-status";
import { User } from "@prisma/client";
import { PageLockedModal } from "./page-locked-modal";
import { PageUnauthorizedModal } from "./page-unauthorized-modal";

type Props = {
	user: User | null;
	pageStatus: PageStatus;
};

export const PageStatusModal = ({ user, pageStatus }: Props) => {
	const { isPageLatest, isPageUnlocked } = pageStatus;

	if (isPageUnlocked) {
		return null;
	}

	// user with locked page
	if (user) {
		if (isPageLatest) {
			return null;
		}

		return <PageLockedModal userPageSlug={user.pageSlug} />;
	}

	// no user, and page is locked
	return <PageUnauthorizedModal />;
};
