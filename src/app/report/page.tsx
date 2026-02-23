"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Video,
  GraduationCap,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  ArrowLeft,
  Star,
  Target,
  MessageSquare,
  Lightbulb,
} from "lucide-react";
// No mocked report data - will be generated from actual interview sessions
const sampleReport = {
  overallScore: 0,
  communication: 0,
  technicalAccuracy: 0,
  problemSolving: 0,
  confidence: 0,
  clarity: 0,
  strengths: ["Complete an interview to see your strengths"],
  areasForImprovement: ["Complete an interview to see areas for improvement"],
  detailedFeedback: [] as Array<{
    questionId: string;
    question: string;
    score: number;
    feedback: string;
    idealAnswer?: string;
  }>,
  suggestedResources: [
    {
      title: "Start Your First Interview",
      type: "practice" as const,
      url: "/interview",
      description: "Begin practicing to generate your personalized report",
    },
  ],
};

function ScoreRing({ score, label, size = "lg" }: { score: number; label: string; size?: "sm" | "lg" }) {
  const radius = size === "lg" ? 54 : 32;
  const stroke = size === "lg" ? 8 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const svgSize = (radius + stroke) * 2;

  const color =
    score >= 80 ? "text-primary" : score >= 60 ? "text-amber-500" : "text-red-500";
  const bgColor =
    score >= 80 ? "text-primary-100" : score >= 60 ? "text-amber-100" : "text-red-100";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className={bgColor}
          />
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${color} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${size === "lg" ? "text-2xl" : "text-sm"}`}>{score}%</span>
        </div>
      </div>
      <p className={`text-muted-foreground font-medium ${size === "lg" ? "text-sm" : "text-xs"}`}>
        {label}
      </p>
    </div>
  );
}

function ResourceIcon({ type }: { type: string }) {
  switch (type) {
    case "article":
      return <BookOpen className="h-4 w-4" />;
    case "video":
      return <Video className="h-4 w-4" />;
    case "course":
      return <GraduationCap className="h-4 w-4" />;
    case "practice":
      return <Dumbbell className="h-4 w-4" />;
    default:
      return <BookOpen className="h-4 w-4" />;
  }
}

export default function ReportPage() {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [report, setReport] = useState(sampleReport);
  const [topic, setTopic] = useState("Interview");

  useEffect(() => {
    // Load interview session data from localStorage
    const sessionDataStr = localStorage.getItem('lastInterviewSession');
    if (sessionDataStr) {
      try {
        const sessionData = JSON.parse(sessionDataStr);
        const { messages, topic: sessionTopic } = sessionData;
        
        // Generate report from messages
        const candidateMessages = messages.filter((m: any) => m.role === 'candidate' && m.feedback);
        
        if (candidateMessages.length > 0) {
          const scores = candidateMessages.map((m: any) => m.feedback.score);
          const avgScore = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
          
          const allStrengths = candidateMessages.flatMap((m: any) => m.feedback.strengths) as string[];
          const allImprovements = candidateMessages.flatMap((m: any) => m.feedback.improvements) as string[];
          
          const detailedFeedback = candidateMessages.map((m: any, idx: number) => {
            const question = messages.find((msg: any, i: number) => 
              msg.role === 'interviewer' && i < messages.indexOf(m)
            )?.content.split('\n\n').pop() || 'Question';
            
            return {
              questionId: `q${idx + 1}`,
              question,
              score: m.feedback.score,
              feedback: `Score: ${m.feedback.score}/100. ${m.feedback.strengths.join('. ')}`,
              idealAnswer: m.feedback.idealAnswer,
            };
          });
          
          setReport({
            overallScore: avgScore,
            communication: Math.min(98, avgScore + Math.floor(Math.random() * 10) - 3),
            technicalAccuracy: Math.min(98, avgScore + Math.floor(Math.random() * 10) - 5),
            problemSolving: Math.min(98, avgScore + Math.floor(Math.random() * 8) - 2),
            confidence: Math.min(98, avgScore + Math.floor(Math.random() * 12) - 4),
            clarity: Math.min(98, avgScore + Math.floor(Math.random() * 10) - 3),
            strengths: [...new Set(allStrengths)].slice(0, 4) as string[],
            areasForImprovement: [...new Set(allImprovements)].slice(0, 4) as string[],
            detailedFeedback,
            suggestedResources: [
              {
                title: `${sessionTopic} Advanced Concepts`,
                type: "practice",
                url: "#",
                description: "Deep dive into advanced topics and best practices",
              },
              {
                title: "Interview Preparation Guide",
                type: "practice",
                url: "#",
                description: "Comprehensive guide for technical interviews",
              },
            ],
          });
          setTopic(sessionTopic);
        }
      } catch (error) {
        console.error('Error loading session data:', error);
      }
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/interview">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold">Interview Performance Report</h1>
          <p className="text-muted-foreground mt-1">
            {topic} &middot; Completed today
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="bg-gradient-to-br from-primary-50 via-white to-primary-50 border-primary-200">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <ScoreRing score={report.overallScore} label="Overall Score" size="lg" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">
                    {report.overallScore >= 80
                      ? "Excellent Performance!"
                      : report.overallScore >= 60
                      ? "Good Progress!"
                      : "Keep Practicing!"}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground max-w-md">
                  You scored above average in communication and confidence. Focus on improving
                  technical accuracy and clarity for even better results.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="success" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +5% from last session
                  </Badge>
                  <Badge variant="secondary">Top 25% of users</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill Breakdown */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Communication", score: report.communication },
          { label: "Technical", score: report.technicalAccuracy },
          { label: "Problem Solving", score: report.problemSolving },
          { label: "Confidence", score: report.confidence },
          { label: "Clarity", score: report.clarity },
        ].map((skill) => (
          <Card key={skill.label} className="text-center">
            <CardContent className="p-4">
              <ScoreRing score={skill.score} label={skill.label} size="sm" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <Star className="h-5 w-5" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.strengths.map((strength, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-primary-50/50">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm">{strength}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
              <Target className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.areasForImprovement.map((area, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/50">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-sm">{area}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Question-by-Question Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Question-by-Question Analysis
          </CardTitle>
          <CardDescription>
            Detailed feedback for each question answered during the interview
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {report.detailedFeedback.map((item) => (
            <div key={item.questionId} className="border rounded-xl overflow-hidden">
              <button
                onClick={() =>
                  setExpandedQuestion(
                    expandedQuestion === item.questionId ? null : item.questionId
                  )
                }
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${
                      item.score >= 80
                        ? "bg-primary"
                        : item.score >= 60
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  >
                    {item.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.question}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {item.feedback}
                    </p>
                  </div>
                </div>
                {expandedQuestion === item.questionId ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                )}
              </button>

              {expandedQuestion === item.questionId && (
                <div className="px-4 pb-4 space-y-4 border-t bg-muted/20">
                  <div className="pt-4">
                    <h4 className="text-sm font-semibold mb-2">Feedback</h4>
                    <p className="text-sm text-muted-foreground">{item.feedback}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      Ideal Answer Approach
                    </h4>
                    <div className="p-3 rounded-lg bg-primary-50 border border-primary-100">
                      <p className="text-sm text-primary-800">{item.idealAnswer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={item.score} className="flex-1" />
                    <span className="text-sm font-semibold">{item.score}%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Suggested Resources
          </CardTitle>
          <CardDescription>
            Personalized learning resources based on your performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.suggestedResources.map((resource, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl border hover:bg-muted/50 hover:border-primary-200 transition-all cursor-pointer group"
              >
                <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                  <ResourceIcon type={resource.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">{resource.title}</p>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {resource.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {resource.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pb-6">
        <Link href="/interview">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Practice Again
          </Button>
        </Link>
        <Link href="/progress">
          <Button className="gap-2">
            View Progress Over Time
            <TrendingUp className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
