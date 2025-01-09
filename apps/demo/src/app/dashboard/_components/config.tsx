import {
  BarChartIcon,
  FileEditIcon,
  MessageCircleQuestion,
  SettingsIcon,
} from "lucide-react";

import { type MobileNavItem } from "@/components/mobile-nav";

export const dashboardConfig = {
  mobileNav: {
    teacher: [
      {
        title: "Summaries",
        href: "/dashboard/teacher/summaries",
      },
      {
        title: "Questions",
        href: "/dashboard/teacher/cri",
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
      },
    ],
    student: [
      {
        title: "Summaries",
        href: "/dashboard/summaries",
      },
      {
        title: "Questions",
        href: "/dashboard/questions",
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
      },
      {
        title: "Forms",
        href: "/dashboard/forms",
      },
    ],
  },
  sidebarNav: {
    teacher: [
      {
        title: "Overview",
        href: "/dashboard/teacher",
        icon: BarChartIcon,
      },
      {
        title: "Summaries",
        href: "/dashboard/teacher/summaries",
        icon: FileEditIcon,
      },
      {
        title: "Questions",
        href: "/dashboard/teacher/questions",
        icon: MessageCircleQuestion,
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: SettingsIcon,
      },
    ],
    student: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: BarChartIcon,
      },
      {
        title: "Summaries",
        href: "/dashboard/summaries",
        icon: FileEditIcon,
      },
      {
        title: "Questions",
        href: "/dashboard/questions",
        icon: MessageCircleQuestion,
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: SettingsIcon,
      },
      {
        title: "Forms",
        href: "/dashboard/forms",
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
