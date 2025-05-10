export const FOCUS_TIME_SAVE_INTERVAL = 60000;
export const EXCELLENT_SUMMARY_THRESHOLD = 0.2;
export const SKIP_SUMMARY_STREAK_THRESHOLD = 2;

export const PAGE_SUMMARY_THRESHOLD = 2;

export const SUMMARY_DESCRIPTION_ID = "summary-description";

export const SIDEBAR_STATE_COOKIE = "sidebar:state";
export const DASHBOARD_ROLE_COOKIE = "dashboard:role";
export const PAGE_HEADER_PIN_COOKIE = "page-header:pin";

export const isProduction = process.env.NODE_ENV === "production";
export const ClassRole = {
  TEACHER: "teacher",
  STUDENT: "student",
} as const;

export const FeedbackType = {
  CRI: "CRI",
  CHAT: "Chat",
} as const;

export const Errors = {
  INTERNAL: "InternalError",

  // teacher related
  TEAHCER_ONLY: "TeacherOnlyError",
  STUDENT_NOT_EXISTS: "StudentNotExistsError",
};

export const EventType = {
  KEYSTROKE: "keystroke",
  CLICK: "click",
  FOCUS_TIME: "focus-time",
  SCROLL: "scroll",
  CHUNK_REVEAL: "chunk-reveal",
  CHUNK_REVEAL_QUESTION: "post-question-chunk-reveal",
  EXPLAIN: "explain-constructed-response",
  STAIRS: "stairs",
  RANDOM_REREAD: "random-reread",
  SIMPLE: "simple",
  QUIZ: "quiz",
  STREAK: "streak",
  REWARD_SPENT: "reward-spent",
  QUIZME: "quizme",
  RUNCODE: "run-code",
} as const;

export const Condition = {
  SIMPLE: "simple",
  RANDOM_REREAD: "random_reread",
  STAIRS: "stairs",
};
export const Tags = {
  GET_SESSION: "get-session",
  GET_ANSWER_STREAK: "get-answer-streak",
  GET_QUIZ_ATTEMPTS: "get-quiz-attempts",
  GET_QUIZ_ANSWER: "get-quiz-answer",
  COUNT_SUMMARY: "count-summary",
} as const;

export const Survey = {
  INTAKE: "intake",
  OUTTAKE: "outtake",
};

export const STAIRS_TEXT_ANIMATION_WPM = 300;
export const STAIRS_TEXT_ANIMATION_DELAY = 1; // seconds
