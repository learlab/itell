import { Skeleton } from "@itell/ui/skeleton";

export default function OffboardingLoading() {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center gap-4 px-4">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-[80vh] w-full" />
    </div>
  );
}
