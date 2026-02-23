export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  tips: string[];
  sampleAnswer: string;
}

export interface InterviewMessage {
  id: string;
  role: "interviewer" | "candidate";
  content: string;
  timestamp: Date;
  feedback?: MessageFeedback;
}

export interface MessageFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  keywords: string[];
  idealAnswer?: string;
}

export interface InterviewSession {
  id: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  status: "pending" | "in-progress" | "completed";
  startedAt?: Date;
  completedAt?: Date;
  messages: InterviewMessage[];
  overallScore?: number;
  report?: InterviewReport;
}

export interface InterviewReport {
  overallScore: number;
  communication: number;
  technicalAccuracy: number;
  problemSolving: number;
  confidence: number;
  clarity: number;
  strengths: string[];
  areasForImprovement: string[];
  detailedFeedback: DetailedFeedback[];
  suggestedResources: SuggestedResource[];
}

export interface DetailedFeedback {
  questionId: string;
  question: string;
  score: number;
  feedback: string;
  idealAnswer: string;
}

export interface SuggestedResource {
  title: string;
  type: "article" | "video" | "course" | "practice";
  url: string;
  description: string;
}

export interface InterviewTopic {
  id: string;
  name: string;
  icon: string;
  description: string;
  questionCount: number;
  difficulty: "easy" | "medium" | "hard";
  categories: string[];
}

export interface UserStats {
  totalInterviews: number;
  averageScore: number;
  bestTopic: string;
  improvementRate: number;
  streak: number;
  totalPracticeTime: number;
}
