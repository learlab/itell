"use client";

import { Spinner } from "@/components/spinner";
import { getTeacherWithClassId } from "@/lib/dashboard/actions";
import { Button } from "@itell/ui/client";
import { Errorbox, Input } from "@itell/ui/server";
import { User } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { ClassInviteModal } from "./class-invite-modal";

type Props = {
	user: User;
};

type FormState =
	| { teacher: User; error: null; classId: string }
	| { teacher: null; error: string; classId: string }
	| { teacher: null; error: null; classId: string };

const onSubmit = async (
	prevState: FormState,
	formData: FormData,
): Promise<FormState> => {
	const classId = formData.get("code") as string;
	const teacher = await getTeacherWithClassId(classId);

	if (!teacher) {
		return { teacher: null, error: "Invalid class code", classId };
	}

	return {
		teacher,
		error: null,
		classId,
	};
};

export const SubmitButton = () => {
	const { pending } = useFormStatus();
	return (
		<Button disabled={pending}>
			{pending && <Spinner className="inline-flex mr-2" />}Submit
		</Button>
	);
};

export const JoinClassForm = ({ user }: Props) => {
	const searchParams = useSearchParams();
	const [formState, formAction] = useFormState(onSubmit, {
		teacher: null,
		error: null,
		classId: searchParams?.get("join_class_code") || "",
	});

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground text-sm">
				If you are enrolled in a class that uses this textbook, you can ask your
				teacher for a class code to enter it here. This will allow you to
				receive class-based feedback.
			</p>
			<form action={formAction} className="space-y-2">
				{formState.error && (
					<Errorbox title="Error">{formState.error}</Errorbox>
				)}
				<Input
					name="code"
					placeholder="Enter your class code here"
					type="text"
					required
					defaultValue={formState.classId}
				/>
				<SubmitButton />
			</form>
			{/* dialog to confirm joining a class */}
			{formState.teacher && (
				<ClassInviteModal
					user={user}
					teacherToJoin={formState.teacher}
					classId={formState.classId}
				/>
			)}
		</div>
	);
};
