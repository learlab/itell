import { type Message } from "@itell/core/chat";
import { Avatar, AvatarImage } from "@itell/ui/avatar";
import { type User } from "lucia";

import { Spinner } from "@/components/spinner";
import { getPageChats } from "@/db/chat";
import { getUserCondition } from "@/lib/auth/conditions";
import { Condition } from "@/lib/constants";
import { Chat } from "./chat/chat";

type Props = {
  user: User | null;
  pageSlug: string;
  pageTitle: string;
};

export async function ChatLoader({ user, pageSlug, pageTitle }: Props) {
  if (!user || getUserCondition(user, pageSlug) !== Condition.STAIRS) {
    return null;
  }
  const chats = await getPageChats(user.id, pageSlug);

  const { data, updatedAt } = chats;
  const messages = data.map((d) => ({
    id: crypto.randomUUID(),
    text: d.text,
    isUser: d.is_user,
    context: d.context,
    transform: d.transform,
  })) as Message[];

  return (
    <Chat
      pageSlug={pageSlug}
      updatedAt={new Date(updatedAt)}
      data={messages}
      pageTitle={pageTitle}
    />
  );
}

ChatLoader.Skeleton = function ChatLoaderSkeleton() {
  return (
    <div className="fixed bottom-12 right-8 z-30 flex w-80 items-center gap-2 rounded-lg border border-border bg-background p-4 shadow-lg lg:w-96">
      <Avatar className="h-8 w-8 rounded-none">
        <AvatarImage src="/images/itell-ai.svg" />
      </Avatar>
      <span>ITELL AI</span>
      <Spinner />
    </div>
  );
};
