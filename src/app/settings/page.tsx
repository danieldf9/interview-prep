"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Palette,
  Shield,
  Clock,
  Volume2,
  MessageSquare,
  Save,
  CheckCircle2,
  Settings2,
  Sliders,
  BookOpen,
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    questionsPerSession: 5,
    defaultDifficulty: "medium",
    defaultTopic: "Frontend Development",
    enableTimer: true,
    enableFeedback: true,
    enableSound: false,
    enableNotifications: true,
    feedbackDetail: "detailed",
    interviewStyle: "conversational",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Customize your interview preparation experience
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile
          </CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full Name</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full rounded-lg border bg-white py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full rounded-lg border bg-white py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl font-bold">
              AJ
            </div>
            <div>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interview Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary" />
            Interview Preferences
          </CardTitle>
          <CardDescription>Customize how your mock interviews work</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Questions Per Session
              </label>
              <select
                value={settings.questionsPerSession}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    questionsPerSession: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border bg-white py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
              >
                {[3, 5, 7, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} questions
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Default Difficulty
              </label>
              <select
                value={settings.defaultDifficulty}
                onChange={(e) =>
                  setSettings({ ...settings, defaultDifficulty: e.target.value })
                }
                className="w-full rounded-lg border bg-white py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Default Topic</label>
              <select
                value={settings.defaultTopic}
                onChange={(e) =>
                  setSettings({ ...settings, defaultTopic: e.target.value })
                }
                className="w-full rounded-lg border bg-white py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
              >
                {[
                  "Frontend Development",
                  "Backend Development",
                  "System Design",
                  "Data Structures & Algorithms",
                  "Behavioral Interview",
                  "DevOps & Cloud",
                ].map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Interview Style</label>
              <select
                value={settings.interviewStyle}
                onChange={(e) =>
                  setSettings({ ...settings, interviewStyle: e.target.value })
                }
                className="w-full rounded-lg border bg-white py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
              >
                <option value="conversational">Conversational</option>
                <option value="formal">Formal</option>
                <option value="rapid-fire">Rapid Fire</option>
                <option value="deep-dive">Deep Dive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Feedback Detail Level</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "brief", label: "Brief", desc: "Quick score only" },
                { value: "standard", label: "Standard", desc: "Score + key points" },
                { value: "detailed", label: "Detailed", desc: "Full analysis" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setSettings({ ...settings, feedbackDetail: option.value })
                  }
                  className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    settings.feedbackDetail === option.value
                      ? "border-primary bg-primary-50"
                      : "border-border hover:border-primary-200"
                  }`}
                >
                  <p className="font-medium text-sm">{option.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toggle Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Features
          </CardTitle>
          <CardDescription>Enable or disable interview features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {[
            {
              key: "enableTimer" as const,
              icon: Clock,
              label: "Session Timer",
              desc: "Show elapsed time during interviews",
            },
            {
              key: "enableFeedback" as const,
              icon: MessageSquare,
              label: "Real-Time Feedback",
              desc: "Show instant feedback after each answer",
            },
            {
              key: "enableSound" as const,
              icon: Volume2,
              label: "Sound Effects",
              desc: "Play sounds for notifications and events",
            },
            {
              key: "enableNotifications" as const,
              icon: Bell,
              label: "Practice Reminders",
              desc: "Get daily reminders to practice",
            },
          ].map((toggle) => (
            <div
              key={toggle.key}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center">
                  <toggle.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{toggle.label}</p>
                  <p className="text-xs text-muted-foreground">{toggle.desc}</p>
                </div>
              </div>
              <button
                onClick={() =>
                  setSettings({ ...settings, [toggle.key]: !settings[toggle.key] })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  settings[toggle.key] ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[toggle.key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="border-primary-200 bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Subscription
              </CardTitle>
              <CardDescription>Manage your plan and billing</CardDescription>
            </div>
            <Badge className="bg-primary">Premium</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border">
            <div>
              <p className="font-semibold">Premium Plan</p>
              <p className="text-sm text-muted-foreground">
                Unlimited interviews, detailed reports, all topics
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">$19</p>
              <p className="text-xs text-muted-foreground">/month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
