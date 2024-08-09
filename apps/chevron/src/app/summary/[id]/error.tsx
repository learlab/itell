"use client";

import { ContinueReading } from "@/components/continue-reading";
import { InternalError } from "@/components/interval-error";

export default function () {
	return (
		<InternalError className="flex flex-col gap-2">
			Failed to retreive your summary at this point, please try again later.
			<ContinueReading text="Back to textbook" />
		</InternalError>
	);
}
