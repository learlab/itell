import { getNotes } from "@/db/note";
import { NoteList } from "./note-list";

type Props = {
  userId: string;
  pageSlug: string;
};

export async function NoteLoader({ userId, pageSlug }: Props) {
  const data = await getNotes(userId, pageSlug);
  return <NoteList notes={data} pageSlug={pageSlug} />;
}
