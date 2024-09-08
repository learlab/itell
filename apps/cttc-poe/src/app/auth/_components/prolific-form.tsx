"use client";

import { useSafeSearchParams } from "@/lib/navigation";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@itell/ui/alert-dialog";
import { Button } from "@itell/ui/button";
import { Input } from "@itell/ui/input";
import { Label } from "@itell/ui/label";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState, useTransition } from "react";

export const ProlificForm = () => {
	const { prolific_pid } = useSafeSearchParams("auth");
	const [pending, startTransition] = useTransition();
	const router = useRouter();
	const [showDialog, setShowDialog] = useState(Boolean(prolific_pid));
	const formRef = useRef<HTMLFormElement>(null);

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const pid = String(formData.get("pid"));

		startTransition(() => {
			router.push(`/auth/prolific?prolific_id=${pid}`);
		});
	};

	return (
		<>
			<form
				className="grid w-full max-w-sm items-center gap-2"
				onSubmit={onSubmit}
				ref={formRef}
			>
				<Label htmlFor="pid">One-time ID</Label>
				<Input
					type="text"
					name="pid"
					id="pid"
					placeholder="Enter your One-time ID here"
					defaultValue={prolific_pid}
				/>
				<Button disabled={pending} variant={"outline"}>
					{pending ? "Confirming..." : "Confirm"}
				</Button>
			</form>

			<AlertDialog open={showDialog} onOpenChange={setShowDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to login with one-time id {prolific_pid}?
						</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								formRef.current?.requestSubmit();
							}}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
