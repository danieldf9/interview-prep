"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Monitor,
  Server,
  Network,
  Binary,
  Users,
  Cloud,
  Search,
  Filter,
  Play,
  BookOpen,
  Star,
  ChevronRight,
} from "lucide-react";
import { interviewTopics } from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  Monitor,
  Server,
  Network,
  Binary,
  Users,
  Cloud,
};

export default function TopicsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  const filteredTopics = interviewTopics.filter((topic) => {
    const matchesSearch =
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty =
      filterDifficulty === "all" || topic.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Interview Topics</h1>
          <p className="text-muted-foreground mt-1">
            Browse and customize your interview preparation topics
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {interviewTopics.length} Topics Available
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {["all", "easy", "medium", "hard"].map((level) => (
            <Button
              key={level}
              variant={filterDifficulty === level ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterDifficulty(level)}
              className="capitalize"
            >
              {level === "all" ? "All Levels" : level}
            </Button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic) => {
          const IconComp = iconMap[topic.icon] || BookOpen;
          return (
            <Card
              key={topic.id}
              className="group hover:shadow-lg hover:border-primary-200 transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <IconComp className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
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
                <CardTitle className="text-lg mt-3">{topic.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {topic.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {topic.categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-[10px]">
                      {cat}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {topic.questionCount} questions
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-muted-foreground">4.8</span>
                  </div>
                </div>

                <Link href="/interview">
                  <Button className="w-full gap-2 group-hover:shadow-md transition-shadow">
                    <Play className="h-4 w-4" />
                    Start Practice
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">No topics found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
