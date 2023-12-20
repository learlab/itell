import { cn } from "@itell/core/utils";
import { buttonVariants } from "@itell/ui/server";

export const PageTitle = ({ children }: { children: React.ReactNode }) => {
	return (
		<h1
			className={cn(
				buttonVariants({ variant: "ghost" }),
				"text-3xl font-semibold mb-4 text-center flex items-center justify-center gap-2 h-fit text-pretty",
			)}
			id="page-title"
		>
			{children}
		</h1>
	);
};
