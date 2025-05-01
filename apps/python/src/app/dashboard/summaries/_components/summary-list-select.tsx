"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@itell/ui/select";
import { type Page } from "#content";

export function SummaryListSelect({
  defaultValue,
  pages,
}: {
  defaultValue: string | undefined;
  pages: Page[];
}) {
  const router = useRouter();
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(val) => {
        if (val === "all") {
          router.push("/dashboard/summaries");
        } else {
          const url = new URL(window.location.href);
          url.searchParams.set("page", val);
          router.push(url.toString());
        }
      }}
    >
      <SelectTrigger className="w-72">
        <SelectValue placeholder="Page" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select a page</SelectLabel>
          <SelectItem value="all">All pages</SelectItem>
          {pages.map((p) => (
            <SelectItem key={p.slug} value={p.slug}>
              {p.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
