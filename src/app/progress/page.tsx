"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Trophy,
  Target,
  Calendar,
  Clock,
  Flame,
  Award,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { interviewTopics } from "@/lib/mock-data";

// Simple stats - no mocked data
const userStats = {
  totalInterviews: 0,
  averageScore: 0,
  bestTopic: "Start your first interview",
  improvementRate: 0,
  streak: 0,
  totalPracticeTime: 0,
};

const scoreHistory = [
  { date: "Week 1", score: 0 },
  { date: "Week 2", score: 0 },
  { date: "Week 3", score: 0 },
  { date: "Week 4", score: 0 },
  { date: "Week 5", score: 0 },
  { date: "Week 6", score: 0 },
  { date: "Week 7", score: 0 },
  { date: "Week 8", score: 0 },
];

const topicScores = interviewTopics.map(topic => ({
  topic: topic.name.split(' ')[0],
  score: 0
}));

export default function ProgressPage() {
  const maxScore = Math.max(...scoreHistory.map((s) => s.score), 1);
  const minScore = Math.min(...scoreHistory.map((s) => s.score));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground mt-1">
          Track your interview preparation journey and improvement over time
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Sessions",
            value: userStats.totalInterviews,
            icon: Calendar,
            change: "+3",
            up: true,
          },
          {
            label: "Average Score",
            value: `${userStats.averageScore}%`,
            icon: Target,
            change: `+${userStats.improvementRate}%`,
            up: true,
          },
          {
            label: "Practice Streak",
            value: `${userStats.streak} days`,
            icon: Flame,
            change: "Active",
            up: true,
          },
          {
            label: "Total Hours",
            value: `${userStats.totalPracticeTime}h`,
            icon: Clock,
            change: "+2.5h",
            up: true,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {stat.up ? (
                  <ArrowUpRight className="h-3 w-3 text-primary" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={`text-xs font-medium ${
                    stat.up ? "text-primary" : "text-destructive"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">this week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Score History Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Score History
              </CardTitle>
              <CardDescription>Your performance trend over the past 8 weeks</CardDescription>
            </div>
            <Badge variant="secondary">8 Week Trend</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chart */}
            <div className="relative h-56">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-[10px] text-muted-foreground">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
              </div>

              {/* Bars */}
              <div className="ml-10 h-full flex items-end gap-3 pb-8">
                {scoreHistory.map((item, i) => {
                  const height = (item.score / 100) * 85;
                  const isMax = item.score === maxScore;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[10px] font-semibold text-foreground">
                        {item.score}
                      </span>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 min-w-[14px] ${
                          isMax
                            ? "bg-primary shadow-md"
                            : "bg-primary/60 hover:bg-primary/80"
                        }`}
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {item.date.replace("Week ", "W")}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Grid lines */}
              <div className="absolute left-10 right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="border-t border-dashed border-border/50" />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    <strong>+{maxScore - minScore}%</strong>{" "}
                    <span className="text-muted-foreground">total improvement</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">
                    <strong>{maxScore}%</strong>{" "}
                    <span className="text-muted-foreground">highest score</span>
                  </span>
                </div>
              </div>
              <Badge variant="success" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                Improving
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topic Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Performance by Topic
          </CardTitle>
          <CardDescription>How you perform across different interview categories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {topicScores
            .sort((a, b) => b.score - a.score)
            .map((item, i) => (
              <div key={item.topic} className="flex items-center gap-4">
                <div className="w-6 text-center">
                  {i === 0 ? (
                    <Trophy className="h-4 w-4 text-amber-500 mx-auto" />
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">
                      {i + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.topic}</span>
                    <span
                      className={`text-sm font-bold ${
                        item.score >= 80
                          ? "text-primary"
                          : item.score >= 60
                          ? "text-amber-600"
                          : "text-red-500"
                      }`}
                    >
                      {item.score}%
                    </span>
                  </div>
                  <Progress value={item.score} />
                </div>
                <Badge
                  variant={
                    item.score >= 80
                      ? "success"
                      : item.score >= 60
                      ? "warning"
                      : "destructive"
                  }
                  className="w-20 justify-center"
                >
                  {item.score >= 80 ? "Strong" : item.score >= 60 ? "Good" : "Needs Work"}
                </Badge>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "First Interview", desc: "Complete your first mock interview", unlocked: true },
              { name: "5-Day Streak", desc: "Practice for 5 consecutive days", unlocked: true },
              { name: "Score 90+", desc: "Score above 90 in any interview", unlocked: true },
              { name: "Topic Master", desc: "Score 80+ in all topics", unlocked: false },
              { name: "Speed Demon", desc: "Complete an interview in under 10 min", unlocked: true },
              { name: "Perfectionist", desc: "Score 95+ in any interview", unlocked: false },
              { name: "Marathon", desc: "Complete 50 interviews", unlocked: false },
              { name: "All-Rounder", desc: "Practice all 6 topics", unlocked: true },
            ].map((achievement) => (
              <div
                key={achievement.name}
                className={`p-4 rounded-xl border text-center transition-all ${
                  achievement.unlocked
                    ? "bg-primary-50 border-primary-200"
                    : "bg-muted/50 border-border opacity-50"
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    achievement.unlocked
                      ? "bg-primary text-white"
                      : "bg-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  <Award className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold">{achievement.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{achievement.desc}</p>
                {achievement.unlocked && (
                  <Badge variant="success" className="mt-2 text-[10px]">
                    Unlocked
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
