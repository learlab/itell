import { allPages } from "contentlayer/generated";

export const allPagesSorted = allPages.slice(0).sort((a, b) => {
	if (a.location.chapter === b.location.chapter) {
		if (!a.location.section) {
			return -1;
		}
		if (!b.location.section) {
			return 1;
		}

		return a.location.section - b.location.section;
	}
	return a.location.chapter - b.location.chapter;
});
