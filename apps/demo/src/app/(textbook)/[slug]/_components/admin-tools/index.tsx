import { type User } from "lucia";

import { allPagesSorted } from "@/lib/pages/pages.server";
import { AdminToolsClient } from "./admin-tools.client";

type Props = {
  user: User;
  pageSlug: string;
};

export function AdminTools({ user, pageSlug }: Props) {
  return (
    <AdminToolsClient user={user} pageSlug={pageSlug} pages={allPagesSorted} />
  );
}
