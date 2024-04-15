import { Separator } from "@/components/client-components";
import { getCurrentUser } from "@/lib/auth";
import { getTeacherWithClassId } from "@/lib/dashboard/actions";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@itell/ui/server";
import { User } from "@prisma/client";
import { ClassInfo } from "./settings/class-info";
import { ClassRegister } from "./settings/class-register";
import { ClassRequestModal } from "./settings/class-request-modal";
import { Profile } from "./settings/profile";
import { WebsiteSettings } from "./settings/website-settings";

export const SettingsForm = async ({ user }: { user: User }) => {
	const teacher = await getTeacherWithClassId(user.classId);
	const sessionUser = await getCurrentUser();
	if (!sessionUser) {
		return null;
	}

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Edit your settings</CardTitle>
					<CardDescription>configure the textbook to your need</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Profile user={sessionUser} />
					<Separator />
					<WebsiteSettings user={user} />
					<Separator />
					{teacher ? (
						<ClassInfo teacher={teacher} user={user} />
					) : (
						<ClassRegister user={user} />
					)}
				</CardContent>
			</Card>
			{/* <ClassRequestModal user={user} /> */}
		</div>
	);
};
