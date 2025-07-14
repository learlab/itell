import {
  BarChartIcon,
  FileEditIcon,
  MessageCircleQuestion,
  SettingsIcon,
} from "lucide-react";

import { type MobileNavItem } from "@/components/mobile-nav";
import { routes } from "@/lib/navigation";

export const dashboardConfig = {
  mobileNav: {
    teacher: [
      {
        title: "Summaries",
        href: routes.dashboardSummariesTeacher(),
      },
      {
        title: "Questions",
        href: routes.dashboardCRITeacher(),
      },
      {
        title: "Settings",
        href: routes.dashboardSettings(),
      },
    ],
    student: [
      {
        title: "Summaries",
        href: routes.dashboardSummaries(),
      },
      {
        title: "Questions",
        href: routes.dashboard(),
      },
      {
        title: "Settings",
        href: routes.dashboardSettings(),
      },
      {
        title: "Forms",
        href: routes.dashboardForms(),
      },
    ],
  },
  sidebarNav: {
    teacher: [
      {
        title: "Overview",
        href: routes.dashboardTeacher(),
        icon: BarChartIcon,
      },
      {
        title: "Summaries",
        href: routes.dashboardSummariesTeacher(),
        icon: FileEditIcon,
      },
      {
        title: "Questions",
        href: routes.dashboardCRITeacher(),
        icon: MessageCircleQuestion,
      },
      {
        title: "Settings",
        href: routes.dashboardSettings(),
        icon: SettingsIcon,
      },
    ],
    student: [
      {
        title: "Overview",
        href: routes.dashboard(),
        icon: BarChartIcon,
      },
      {
        title: "Summaries",
        href: routes.dashboardSummaries(),
        icon: FileEditIcon,
      },
      {
        title: "Questions",
        href: routes.dashboardCRI(),
        icon: MessageCircleQuestion,
      },
      {
        title: "Quizzes",
        href: routes.dashboardQuiz(),
        icon: MessageCircleQuestion,
      },
      {
        title: "Settings",
        href: routes.dashboardSettings(),
        icon: SettingsIcon,
      },
      {
        title: "Forms",
        href: routes.dashboardForms(),
        icon: FileEditIcon,
      },
    ],
  },
};

export type DashboardNavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type SidebarNavItem = {
  title: string;
  href: string;
  external?: boolean;
  icon: () => React.ReactNode;
};

export type DashboardConfig = {
  mobileNav: MobileNavItem[];
  sidebarNav: SidebarNavItem[];
};
