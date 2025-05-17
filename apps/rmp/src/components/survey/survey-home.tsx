import { Badge } from "@itell/ui/badge";
import { buttonVariants } from "@itell/ui/button";
import { Errorbox } from "@itell/ui/callout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import { Label } from "@itell/ui/label";
import { ScrollArea } from "@itell/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@itell/ui/select";
import { cn } from "@itell/utils";
import { pages, Survey as SurveyType } from "#content";
import { User } from "lucia";

import { updateUserAction } from "@/actions/user";
import { getSurveySessions } from "@/db/survey";
import { surveySectionRoute } from "@/lib/navigation";
import { getSurvey } from "@/lib/survey-question";
import { NavigationButton } from "../navigation-button";
import { SetProgressSubmitButton } from "./set-progress-submit-button";

export async function SurveyHome({
  user,
  surveyId,
}: {
  user: User;
  surveyId: string;
}) {
  const survey = getSurvey(surveyId);
  if (!survey) {
    return <Errorbox title="Survey not found" />;
  }

  const session = await getSurveySessions(user.id, surveyId);

  const targetSectionId =
    !session || !session.data
      ? survey.sections[0].id
      : getTargetSectionId(survey, session.data);

  return (
    <Card className="border-info">
      <CardHeader>
        <CardTitle className="xl:text-xl">{survey.survey_name}</CardTitle>
        <CardDescription className="xl:text-lg">
          {survey.survey_description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NavigationButton
          href={surveySectionRoute(surveyId, targetSectionId)}
          className={cn(buttonVariants({ size: "lg" }), "md:text-lg")}
        >
          {session ? "Continue Survey" : "Start Survey"}
        </NavigationButton>
      </CardContent>
    </Card>
  );
}

/**
 * Get the latest unvisited survey section
 */
const getTargetSectionId = (
  survey: SurveyType,
  data: Record<string, unknown>
) => {
  const visitedSections = Object.keys(data);
  const lastIdx = visitedSections.reduce((acc, sectionId) => {
    const idx = survey.sections.findIndex(
      (section) => section.id === sectionId
    );
    return Math.max(acc, idx);
  }, 0);
  if (lastIdx === survey.sections.length - 1) {
    return survey.sections[lastIdx].id;
  }
  return survey.sections[lastIdx + 1].id;
};

function SetProgress({ user }: { user: User }) {
  return (
    <form
      className="relative mt-8 w-full space-y-4 rounded-md border p-2"
      action={async (formData: FormData) => {
        "use server";

        const pageSlug = String(formData.get("page-progress"));

        await updateUserAction({ pageSlug });
      }}
    >
      <Badge className="absolute right-1/2 top-0 -translate-y-1/2 translate-x-1/2">
        Admin
      </Badge>
      <Label className="flex flex-col gap-3">
        <span>Set progress</span>
        <Select name="page-progress" defaultValue={user.pageSlug ?? undefined}>
          <SelectTrigger className="h-fit text-left">
            <SelectValue placeholder="Select page" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Page</SelectLabel>
              <ScrollArea className="max-h-[300px]">
                {pages.map((page) => (
                  <SelectItem key={page.slug} value={page.slug}>
                    {page.title}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Label>
      <footer className="flex justify-end">
        <SetProgressSubmitButton />
      </footer>
    </form>
  );
}
