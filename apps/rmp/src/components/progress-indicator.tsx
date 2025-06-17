import { Progress } from "@itell/ui/progress";
import { User } from "lucia";
import { CheckCircle } from "lucide-react";

import { allPagesSorted } from "@/lib/pages/pages.server";

export async function UserProgressIndicator({ user }: { user: User }) {
  let progress = 0;
  const userIndex = allPagesSorted.findIndex(
    (page) => page.slug === user.pageSlug
  );
  const unlockedPages =
    userIndex === -1 ? 0 : userIndex + (user.finished ? 1 : 0);

  if (user.finished) {
    progress = 100;
  } else if (user.pageSlug) {
    progress = (unlockedPages / allPagesSorted.length) * 100;
  }

  return (
    <div className="hidden items-center gap-4 sm:flex">
      <div className="flex items-center gap-3">
        {user?.finished ? (
          <div
            className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3
              py-1.5 text-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium lg:text-lg">Textbook Completed</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-sm sm:flex sm:text-lg">
              <span>Progress:</span>
              <span className="font-medium">{progress.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={progress} className="h-2 w-20 sm:w-24" />
              <span className="text-sm font-medium sm:hidden">
                {progress.toFixed(0)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
