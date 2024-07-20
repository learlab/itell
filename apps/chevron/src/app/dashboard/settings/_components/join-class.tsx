"use client";

import { getTeacherByClassAction } from "@/actions/dashboard";
import { InternalError } from "@/components/interval-error";
import { Spinner } from "@/components/spinner";
import { useSafeSearchParams } from "@/lib/navigation";
import { JoinClassModal } from "@dashboard/join-class-modal";
import { Button } from "@itell/ui/client";
import { Input } from "@itell/ui/server";
import { User } from "lucia";
import { useState } from "react";
import { useServerAction } from "zsa-react";

type Props = {
	user: User;
};

export const JoinClassForm = ({ user }: Props) => {
	const { join_class_code } = useSafeSearchParams("settings");
	const { execute, isPending, isError } = useServerAction(
		getTeacherByClassAction,
	);
	const [teacher, setTeacher] = useState<User | null>(null);
	const [classId, setClassId] = useState<string>(join_class_code || "");

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const code = String(formData.get("code"));

		const [teacher, err] = await execute({
			classId: code,
		});
		if (!err) {
			setTeacher(teacher);
			setClassId(code);
		}
	};

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground text-sm">
				If you are enrolled in a class that uses this textbook, you can ask your
				teacher for a class code to enter it here. This will allow you to
				receive class-based feedback.
			</p>
			<form className="grid gap-2" onSubmit={onSubmit}>
				<Input
					name="code"
					placeholder="Enter your class code here"
					type="text"
					required
					defaultValue={join_class_code || ""}
				/>
				{isError && <InternalError />}
				<footer>
					<Button disabled={isPending} type="submit">
						{isPending && <Spinner className="inline-flex mr-2" />}Submit
					</Button>
				</footer>
			</form>
			{/* dialog to confirm joining a class */}
			{teacher && (
				<JoinClassModal
					userClassId={user.classId}
					teacher={teacher}
					classId={classId}
				/>
			)}
		</div>
	);
};