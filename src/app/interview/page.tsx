"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Send,
  Mic,
  MicOff,
  Clock,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  FileText,
  StopCircle,
  MessageSquare,
} from "lucide-react";
import { InterviewMessage } from "@/lib/types";
import { interviewTopics } from "@/lib/mock-data";
import {
  generateInterviewerMessage,
  evaluateResponse,
  getNextQuestion,
} from "@/lib/interview-engine";

type InterviewPhase = "setup" | "active" | "completed";

export default function InterviewPage() {
  const [phase, setPhase] = useState<InterviewPhase>("setup");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [totalQuestions] = useState(5);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<{
    score: number;
    strengths: string[];
    improvements: string[];
    idealAnswer?: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (phase === "active") {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startInterview = () => {
    if (!selectedTopic) return;
    setPhase("active");
    setElapsedTime(0);
    setQuestionCount(1);

    const firstMessage = generateInterviewerMessage(selectedTopic, [], true);
    setMessages([firstMessage]);
    speakText(firstMessage.content);

    const questionText = firstMessage.content.split("\n\n").pop() || "";
    setAskedQuestions([questionText]);
  };

  const sendMessage = () => {
    if (!inputValue.trim() || isTyping) return;

    const candidateMsg: InterviewMessage = {
      id: Math.random().toString(36).substring(2),
      role: "candidate",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    const currentQuestion = askedQuestions[askedQuestions.length - 1] || "";
    const { feedback, followUp } = evaluateResponse(inputValue.trim(), currentQuestion);
    candidateMsg.feedback = feedback;

    setMessages((prev) => [...prev, candidateMsg]);
    setInputValue("");
    setCurrentFeedback({
      score: feedback.score,
      strengths: feedback.strengths,
      improvements: feedback.improvements,
      idealAnswer: feedback.idealAnswer,
    });

    setIsTyping(true);

    setTimeout(() => {
      const nextQCount = questionCount + 1;

      if (nextQCount > totalQuestions) {
        const closingMsg: InterviewMessage = {
          id: Math.random().toString(36).substring(2),
          role: "interviewer",
          content: `${followUp}\n\nThank you for completing this interview session! You've answered all ${totalQuestions} questions. Let me compile your detailed performance report. You did a great job overall — click "View Report" to see your full analysis and personalized improvement suggestions.`,
          timestamp: new Date(),
        };
        const finalMessages = [...messages, candidateMsg, closingMsg];
        setMessages(finalMessages);
        setPhase("completed");
        if (timerRef.current) clearInterval(timerRef.current);
        
        // Store session data in localStorage for report page
        const sessionData = {
          messages: finalMessages,
          topic: selectedTopic,
          difficulty,
          completedAt: new Date().toISOString(),
        };
        localStorage.setItem('lastInterviewSession', JSON.stringify(sessionData));
      } else {
        const nextQuestion = getNextQuestion(selectedTopic, askedQuestions);
        setAskedQuestions((prev) => [...prev, nextQuestion]);
        setQuestionCount(nextQCount);

        const interviewerMsg: InterviewMessage = {
          id: Math.random().toString(36).substring(2),
          role: "interviewer",
          content: `${followUp}\n\nNext question:\n\n${nextQuestion}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, interviewerMsg]);
        speakText(nextQuestion);
      }
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetInterview = () => {
    setPhase("setup");
    setMessages([]);
    setInputValue("");
    setQuestionCount(0);
    setElapsedTime(0);
    setAskedQuestions([]);
    setCurrentFeedback(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // SETUP PHASE
  if (phase === "setup") {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Start Mock Interview</h1>
          <p className="text-muted-foreground mt-1">
            Choose your topic and difficulty to begin a personalized interview session.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Interview Topic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {interviewTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.name)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                    selectedTopic === topic.name
                      ? "border-primary bg-primary-50 shadow-sm"
                      : "border-border hover:border-primary-200 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                        selectedTopic === topic.name
                          ? "bg-primary text-white"
                          : "bg-primary-50 text-primary"
                      }`}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{topic.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {topic.questionCount} questions
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {topic.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {topic.categories.slice(0, 3).map((cat) => (
                      <Badge key={cat} variant="secondary" className="text-[10px]">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {(["easy", "medium", "hard"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                    difficulty === level
                      ? level === "easy"
                        ? "border-green-500 bg-green-50"
                        : level === "medium"
                        ? "border-amber-500 bg-amber-50"
                        : "border-red-500 bg-red-50"
                      : "border-border hover:border-primary-200"
                  }`}
                >
                  <p className="font-semibold capitalize">{level}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {level === "easy"
                      ? "Fundamental concepts"
                      : level === "medium"
                      ? "Intermediate topics"
                      : "Advanced challenges"}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={startInterview}
            disabled={!selectedTopic}
            className="gap-2"
          >
            Start Interview
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ACTIVE / COMPLETED PHASE
  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)] animate-fade-in">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Interview Header Bar */}
        <div className="flex items-center justify-between p-4 bg-white rounded-t-xl border border-b-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center animate-pulse-green">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">{selectedTopic}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {difficulty} difficulty
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
            <Badge variant="secondary">
              Q {Math.min(questionCount, totalQuestions)}/{totalQuestions}
            </Badge>
            <Progress
              value={(Math.min(questionCount, totalQuestions) / totalQuestions) * 100}
              className="w-24 h-2"
            />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 border-x">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "candidate" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "candidate"
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-white border shadow-sm rounded-bl-md"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold opacity-80">
                    {msg.role === "interviewer" ? "AI Interviewer" : "You"}
                  </span>
                  <span className="text-[10px] opacity-60">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                {msg.feedback && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          msg.feedback.score >= 75
                            ? "bg-green-200 text-green-800"
                            : msg.feedback.score >= 55
                            ? "bg-amber-200 text-amber-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        Score: {msg.feedback.score}/100
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white rounded-b-xl border border-t-0">
          {phase === "completed" ? (
            <div className="flex items-center gap-3">
              <Button onClick={resetInterview} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                New Interview
              </Button>
              <Link href="/report" className="flex-1">
                <Button className="w-full gap-2">
                  <FileText className="h-4 w-4" />
                  View Detailed Report
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer here... (Press Enter to send, Shift+Enter for new line)"
                  className="w-full resize-none rounded-xl border bg-muted/30 p-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[48px] max-h-[120px]"
                  rows={2}
                  disabled={isTyping}
                />
              </div>
              <Button
                onClick={() => setIsMicOn(!isMicOn)}
                variant={isMicOn ? "destructive" : "outline"}
                size="icon"
                className="shrink-0"
              >
                {isMicOn ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Sidebar */}
      <div className="w-80 space-y-4 overflow-y-auto">
        {/* Live Feedback Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Real-Time Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentFeedback ? (
              <>
                <div className="text-center">
                  <div
                    className={`inline-flex items-center justify-center h-16 w-16 rounded-full text-xl font-bold text-white ${
                      currentFeedback.score >= 75
                        ? "bg-primary"
                        : currentFeedback.score >= 55
                        ? "bg-warning"
                        : "bg-destructive"
                    }`}
                  >
                    {currentFeedback.score}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Latest Answer Score</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-primary flex items-center gap-1 mb-2">
                    <ThumbsUp className="h-3 w-3" /> Strengths
                  </p>
                  {currentFeedback.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1.5">
                      <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground">{s}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-amber-600 flex items-center gap-1 mb-2">
                    <ThumbsDown className="h-3 w-3" /> Improvements
                  </p>
                  {currentFeedback.improvements.map((imp, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1.5">
                      <AlertCircle className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground">{imp}</p>
                    </div>
                  ))}
                </div>

                {currentFeedback.idealAnswer && (
                  <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-xs font-semibold text-primary flex items-center gap-1 mb-2">
                      <Sparkles className="h-3 w-3" /> Ideal 100% Answer
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {currentFeedback.idealAnswer}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  Answer a question to see real-time feedback
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interview Tips */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Interview Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              "Structure answers using the STAR method",
              "Provide specific examples from experience",
              "Explain your thought process clearly",
              "Ask clarifying questions when needed",
              "Keep answers concise but thorough",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">{tip}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* End Interview Button */}
        {phase === "active" && (
          <Button
            variant="outline"
            className="w-full gap-2 text-destructive border-destructive/30 hover:bg-red-50"
            onClick={() => {
              const closingMsg: InterviewMessage = {
                id: Math.random().toString(36).substring(2),
                role: "interviewer",
                content:
                  "The interview has been ended early. Thank you for your time! Click 'View Report' to see your performance analysis based on the questions answered so far.",
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, closingMsg]);
              setPhase("completed");
              if (timerRef.current) clearInterval(timerRef.current);
            }}
          >
            <StopCircle className="h-4 w-4" />
            End Interview Early
          </Button>
        )}
      </div>
    </div>
  );
}
