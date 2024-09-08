import { DashboardHeader, DashboardShell } from "@dashboard//shell";
import { Skeleton } from "@itell/ui/skeleton";

const title = "Question Answering";
const description =
	"You will receive content-related questions as assessment items throughout the read";

export default function () {
	return (
		<DashboardShell>
			<DashboardHeader heading={title} text={description} />
			<div className="space-y-6">
				<Skeleton className="h-[350px] w-full" />
				<Skeleton className="h-[200px] w-full" />
			</div>
		</DashboardShell>
	);
}
