import { type Message } from "@itell/core/chat";
import { type User } from "lucia";
import { MessageCircleIcon } from "lucide-react";

import { getPageChats } from "@/db/chat";
import { getUserCondition } from "@/lib/auth/conditions";
import { Condition } from "@/lib/constants";
import { ChatPopover } from "./chat/chat-popover";

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
    <ChatPopover
      pageSlug={pageSlug}
      updatedAt={new Date(updatedAt)}
      data={messages}
      pageTitle={pageTitle}
    />
  );
}

ChatLoader.Skeleton = function ChatLoaderSkeleton() {
  return (
    <button className="fixed bottom-12 right-8 z-20 flex items-center justify-center gap-2 rounded-lg border-2 bg-background px-6 py-4 text-foreground">
      <MessageCircleIcon className="size-6" />
      <span>Chat with AI</span>
    </button>
  );
};
