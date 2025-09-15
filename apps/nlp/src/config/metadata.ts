import { type Metadata } from "next";

type PageMeta = Metadata & { slug: string };

export const Meta = {
  home: {
    title: "Learning Statistics",
    description: "Understand your learning journey",
    slug: "dashboard",
  },
  guide: {
    title: "iTELL User Guide",
    description: "Learn how to use iTELL",
    slug: "guide",
  },
  homeTeacher: {
    title: "Class Statistics",
    description: "View students' progress",
    slug: "class",
  },
  summaries: {
    title: "Summary Submissions",
    description: "Comprehend the text with summarization",
    slug: "summaries",
  },
  summariesTeacher: {
    title: "Summary Submissions",
    description: "Class summary statistics",
    slug: "summaries-teacher",
  },
  cri: {
    title: "Question Answering",
    description: "Answer assessment questions throughout the read",
    slug: "constructed-response",
  },
  criTeacher: {
    title: "Question Answering",
    description: "Class question statistics",
    slug: "constructed-response-teacher",
  },
  quiz: {
    title: "Quiz Report",
    description: "Check your quiz scores",
    slug: "quiz",
  },
  quizTeacher: {
    title: "Class Quiz Report",
    description: "Check class quiz results",
    slug: "quiz-teacher",
  },
  settings: {
    title: "Settings",
    description: "Manage account settings",
    slug: "settings",
  },
  student: {
    title: "Student Details",
    description: "View student details",
    slug: "student",
  },
  forms: {
    title: "Forms",
    description: "Help us improve iTELL",
    slug: "forms",
  },
} satisfies Record<string, PageMeta>;
