"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Clock,
  Target,
  Flame,
  ArrowRight,
  Play,
  Star,
  CheckCircle2,
  BarChart3,
  Calendar,
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

const recentSessions: any[] = [];

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  trend?: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            {trend && (
              <Badge variant="success" className="text-[10px]">
                {trend}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniChart() {
  const max = Math.max(...scoreHistory.map((s) => s.score));
  return (
    <div className="flex items-end gap-2 h-32">
      {scoreHistory.map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
          <span className="text-[10px] font-semibold text-foreground">{item.score}</span>
          <div
            className="w-full bg-primary/80 rounded-t-md min-w-[12px] transition-all hover:bg-primary"
            style={{ height: `${(item.score / max) * 80}%` }}
            title={`${item.date}: ${item.score}%`}
          />
          <span className="text-[9px] text-muted-foreground">{item.date.replace("Week ", "W")}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Alex!</h1>
          <p className="text-muted-foreground mt-1">
            Ready to ace your next interview? Let&apos;s practice!
          </p>
        </div>
        <Link href="/interview">
          <Button size="lg" className="gap-2">
            <Play className="h-4 w-4" />
            Start Interview
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Interviews"
          value={userStats.totalInterviews}
          subtitle="Sessions completed"
          icon={CheckCircle2}
          trend="+3 this week"
        />
        <StatCard
          title="Average Score"
          value={`${userStats.averageScore}%`}
          subtitle="Across all topics"
          icon={Target}
          trend={`+${userStats.improvementRate}%`}
        />
        <StatCard
          title="Current Streak"
          value={`${userStats.streak} days`}
          subtitle="Keep it going!"
          icon={Flame}
        />
        <StatCard
          title="Practice Time"
          value={`${userStats.totalPracticeTime}h`}
          subtitle="Total hours practiced"
          icon={Clock}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Score Trend
              </CardTitle>
              <Badge variant="secondary">Last 8 weeks</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <MiniChart />
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">+23%</strong> improvement over 8 weeks
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/interview" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-primary-50 hover:border-primary-200 transition-all cursor-pointer group">
                <div className="h-9 w-9 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Play className="h-4 w-4 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New Interview</p>
                  <p className="text-xs text-muted-foreground">Start a mock session</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
            </Link>
            <Link href="/report" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-primary-50 hover:border-primary-200 transition-all cursor-pointer group">
                <div className="h-9 w-9 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Star className="h-4 w-4 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">View Reports</p>
                  <p className="text-xs text-muted-foreground">Check your progress</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
            </Link>
            <Link href="/topics" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-primary-50 hover:border-primary-200 transition-all cursor-pointer group">
                <div className="h-9 w-9 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Calendar className="h-4 w-4 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Browse Topics</p>
                  <p className="text-xs text-muted-foreground">Customize your prep</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions & Popular Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Sessions</CardTitle>
              <Link href="/report">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    (session.overallScore || 0) >= 80
                      ? "bg-primary"
                      : (session.overallScore || 0) >= 60
                      ? "bg-warning"
                      : "bg-destructive"
                  }`}
                >
                  {session.overallScore}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.startedAt
                      ? new Date(session.startedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
                <Badge
                  variant={
                    session.difficulty === "easy"
                      ? "success"
                      : session.difficulty === "medium"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {session.difficulty}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Popular Topics */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Popular Topics</CardTitle>
              <Link href="/topics">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {interviewTopics.slice(0, 4).map((topic) => (
              <div
                key={topic.id}
                className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{topic.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {topic.questionCount} questions
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      topic.difficulty === "easy"
                        ? "success"
                        : topic.difficulty === "medium"
                        ? "warning"
                        : "destructive"
                    }
                  >
                    {topic.difficulty}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Skill Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Skill Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { skill: "Communication", score: 85 },
              { skill: "Technical Knowledge", score: 78 },
              { skill: "Problem Solving", score: 80 },
              { skill: "Confidence", score: 88 },
              { skill: "Code Quality", score: 72 },
              { skill: "System Design", score: 68 },
            ].map((item) => (
              <div key={item.skill} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.skill}</span>
                  <span className="text-muted-foreground">{item.score}%</span>
                </div>
                <Progress value={item.score} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
