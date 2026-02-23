"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Video,
  Headphones,
  FileText,
  Play,
  Pause,
  Download,
  Star,
  Clock,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Code,
  TestTube,
  Network,
  Gauge,
  Search,
  Filter,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

type ResourceType = "video" | "audio" | "article" | "interactive";
type ResourceCategory = "playwright" | "cypress" | "selenium" | "api" | "performance" | "general";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  rating: number;
  completionRate: number;
  thumbnail?: string;
  content: string;
  url?: string;
  transcript?: string;
}

const resources: Resource[] = [
  // Playwright Resources
  {
    id: "pw-1",
    title: "Playwright Fundamentals - Complete Guide",
    description: "Master Playwright from basics to advanced concepts with hands-on examples",
    type: "video",
    category: "playwright",
    duration: "45 min",
    difficulty: "beginner",
    rating: 4.8,
    completionRate: 0,
    content: "https://www.youtube.com/embed/wawbt1cATsk",
    transcript: "Learn Playwright testing framework with practical examples...",
  },
  {
    id: "pw-2",
    title: "Auto-Waiting in Playwright Explained",
    description: "Deep dive into Playwright's auto-waiting mechanism and how it eliminates flaky tests",
    type: "audio",
    category: "playwright",
    duration: "15 min",
    difficulty: "intermediate",
    rating: 4.9,
    completionRate: 0,
    content: "Playwright's auto-waiting is one of its most powerful features. Unlike Selenium where you need to explicitly wait for elements, Playwright automatically waits for elements to be actionable before performing actions...",
  },
  {
    id: "pw-3",
    title: "Page Object Model with Playwright",
    description: "Learn how to implement POM pattern in Playwright for maintainable test code",
    type: "article",
    category: "playwright",
    duration: "10 min read",
    difficulty: "intermediate",
    rating: 4.7,
    completionRate: 0,
    content: `# Page Object Model with Playwright

The Page Object Model (POM) is a design pattern that creates an object repository for web UI elements. It helps make your test code more maintainable and reusable.

## Why Use POM?

1. **Separation of Concerns**: Test logic is separate from page structure
2. **Reusability**: Page objects can be reused across multiple tests
3. **Maintainability**: Changes to UI only require updates in one place

## Implementation Example

\`\`\`typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await this.page.click('button[type="submit"]');
  }
}

// tests/login.spec.ts
test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('testuser', 'password123');
  await expect(page).toHaveURL('/dashboard');
});
\`\`\`

## Best Practices

- Keep page objects focused on a single page or component
- Use descriptive method names
- Return page objects for method chaining
- Avoid assertions in page objects`,
  },
  {
    id: "pw-4",
    title: "Interactive Playwright Locator Practice",
    description: "Practice different locator strategies with interactive examples",
    type: "interactive",
    category: "playwright",
    duration: "20 min",
    difficulty: "beginner",
    rating: 4.9,
    completionRate: 0,
    content: "Interactive coding playground for practicing Playwright locators...",
  },

  // Cypress Resources
  {
    id: "cy-1",
    title: "Cypress Testing Masterclass",
    description: "Complete Cypress course covering commands, assertions, and best practices",
    type: "video",
    category: "cypress",
    duration: "60 min",
    difficulty: "beginner",
    rating: 4.7,
    completionRate: 0,
    content: "https://www.youtube.com/embed/u8vMu7viCm8",
  },
  {
    id: "cy-2",
    title: "Understanding cy.intercept() for API Mocking",
    description: "Learn how to mock API responses and test different scenarios",
    type: "audio",
    category: "cypress",
    duration: "12 min",
    difficulty: "intermediate",
    rating: 4.8,
    completionRate: 0,
    content: "cy.intercept() is a powerful command in Cypress that allows you to stub and spy on network requests. This is incredibly useful for testing different API responses without hitting actual endpoints...",
  },
  {
    id: "cy-3",
    title: "Cypress Custom Commands Guide",
    description: "Create reusable custom commands to simplify your test code",
    type: "article",
    category: "cypress",
    duration: "8 min read",
    difficulty: "intermediate",
    rating: 4.6,
    completionRate: 0,
    content: `# Creating Custom Commands in Cypress

Custom commands help you create reusable test logic and make your tests more readable.

## Adding Custom Commands

\`\`\`javascript
// cypress/support/commands.js
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.get('[data-cy=username]').type(username);
  cy.get('[data-cy=password]').type(password);
  cy.get('[data-cy=submit]').click();
});

// Usage in tests
cy.login('testuser', 'password123');
\`\`\`

## Best Practices

- Use descriptive command names
- Add TypeScript definitions
- Keep commands focused and simple
- Document your custom commands`,
  },

  // Selenium Resources
  {
    id: "sel-1",
    title: "Selenium WebDriver Complete Tutorial",
    description: "Master Selenium WebDriver with Java - from basics to advanced",
    type: "video",
    category: "selenium",
    duration: "90 min",
    difficulty: "beginner",
    rating: 4.6,
    completionRate: 0,
    content: "https://www.youtube.com/embed/5FUdrBq-WFo",
  },
  {
    id: "sel-2",
    title: "Waits in Selenium: Implicit vs Explicit vs Fluent",
    description: "Master different wait strategies to handle dynamic elements",
    type: "audio",
    category: "selenium",
    duration: "18 min",
    difficulty: "intermediate",
    rating: 4.9,
    completionRate: 0,
    content: "Understanding waits is crucial for stable Selenium tests. Implicit waits set a global timeout, explicit waits wait for specific conditions, and fluent waits allow custom polling intervals...",
  },
  {
    id: "sel-3",
    title: "TestNG Framework Deep Dive",
    description: "Learn TestNG annotations, data providers, and parallel execution",
    type: "article",
    category: "selenium",
    duration: "15 min read",
    difficulty: "advanced",
    rating: 4.7,
    completionRate: 0,
    content: `# TestNG Framework Guide

TestNG is a powerful testing framework for Java that provides advanced features for test organization and execution.

## Key Annotations

- \`@Test\`: Marks a method as a test
- \`@BeforeMethod\`: Runs before each test
- \`@AfterMethod\`: Runs after each test
- \`@DataProvider\`: Supplies data to tests

## Example

\`\`\`java
public class LoginTest {
  @DataProvider(name = "loginData")
  public Object[][] getData() {
    return new Object[][] {
      {"user1", "pass1"},
      {"user2", "pass2"}
    };
  }

  @Test(dataProvider = "loginData")
  public void testLogin(String username, String password) {
    // Test logic here
  }
}
\`\`\``,
  },

  // API Testing Resources
  {
    id: "api-1",
    title: "REST API Testing with Postman",
    description: "Complete guide to API testing, automation, and collections",
    type: "video",
    category: "api",
    duration: "40 min",
    difficulty: "beginner",
    rating: 4.8,
    completionRate: 0,
    content: "https://www.youtube.com/embed/VywxIQ2ZXw4",
  },
  {
    id: "api-2",
    title: "Understanding HTTP Status Codes",
    description: "Master 2xx, 4xx, 5xx status codes and what they mean",
    type: "audio",
    category: "api",
    duration: "10 min",
    difficulty: "beginner",
    rating: 4.7,
    completionRate: 0,
    content: "HTTP status codes are three-digit numbers that indicate the result of an HTTP request. 2xx codes mean success, 4xx indicate client errors, and 5xx indicate server errors...",
  },
  {
    id: "api-3",
    title: "REST Assured Framework Tutorial",
    description: "Learn REST Assured for API automation testing in Java",
    type: "article",
    category: "api",
    duration: "12 min read",
    difficulty: "intermediate",
    rating: 4.9,
    completionRate: 0,
    content: `# REST Assured Tutorial

REST Assured is a Java library for testing REST APIs with a fluent, readable syntax.

## Basic Example

\`\`\`java
given()
  .baseUri("https://api.example.com")
  .header("Authorization", "Bearer token")
.when()
  .get("/users/1")
.then()
  .statusCode(200)
  .body("name", equalTo("John Doe"));
\`\`\`

## Key Features

- Fluent API syntax
- JSON/XML validation
- Authentication support
- Request/Response logging`,
  },

  // Performance Testing Resources
  {
    id: "perf-1",
    title: "JMeter Performance Testing Masterclass",
    description: "Learn load testing, stress testing, and performance analysis",
    type: "video",
    category: "performance",
    duration: "75 min",
    difficulty: "intermediate",
    rating: 4.7,
    completionRate: 0,
    content: "https://www.youtube.com/embed/8hHxXww2sKY",
  },
  {
    id: "perf-2",
    title: "Performance Metrics Explained",
    description: "Understand response time, throughput, and percentiles",
    type: "audio",
    category: "performance",
    duration: "14 min",
    difficulty: "beginner",
    rating: 4.8,
    completionRate: 0,
    content: "Performance testing metrics help you understand how your application performs under load. Response time measures how long requests take, throughput measures requests per second...",
  },

  // General QA Resources
  {
    id: "gen-1",
    title: "QA Interview Preparation Guide",
    description: "Common interview questions and how to answer them effectively",
    type: "article",
    category: "general",
    duration: "20 min read",
    difficulty: "beginner",
    rating: 4.9,
    completionRate: 0,
    content: `# QA Interview Preparation Guide

## Common Interview Questions

### 1. What is the difference between Selenium and Playwright?

**Answer**: Selenium is a mature, widely-used framework supporting multiple languages and browsers through WebDriver protocol. Playwright is a modern framework by Microsoft with built-in auto-waiting, better debugging tools, and native support for modern web features like Shadow DOM and iframes.

### 2. Explain the Page Object Model

**Answer**: POM is a design pattern that creates an object repository for web elements, separating test logic from page structure. This makes tests more maintainable and reusable.

### 3. What are the types of waits in Selenium?

**Answer**: 
- **Implicit Wait**: Global timeout for all element lookups
- **Explicit Wait**: Wait for specific conditions
- **Fluent Wait**: Custom polling interval with exception handling

## Tips for Success

- Use the STAR method (Situation, Task, Action, Result)
- Provide specific examples from your experience
- Explain your thought process
- Ask clarifying questions`,
  },
];

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | "all">("all");
  const [selectedType, setSelectedType] = useState<ResourceType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const categories = [
    { id: "all", name: "All Resources", icon: BookOpen },
    { id: "playwright", name: "Playwright", icon: TestTube },
    { id: "cypress", name: "Cypress", icon: TestTube },
    { id: "selenium", name: "Selenium", icon: Code },
    { id: "api", name: "API Testing", icon: Network },
    { id: "performance", name: "Performance", icon: Gauge },
    { id: "general", name: "General QA", icon: Sparkles },
  ];

  const types = [
    { id: "all", name: "All Types", icon: BookOpen },
    { id: "video", name: "Videos", icon: Video },
    { id: "audio", name: "Audio", icon: Headphones },
    { id: "article", name: "Articles", icon: FileText },
    { id: "interactive", name: "Interactive", icon: Play },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesType = selectedType === "all" || resource.type === selectedType;
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Headphones className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
      case "interactive":
        return <Play className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-amber-100 text-amber-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Resources Library</h1>
        <p className="text-muted-foreground mt-1">
          Interactive learning materials to master QA automation testing
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter */}
            <div>
              <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.id as ResourceCategory | "all")}
                      className="gap-2"
                    >
                      <Icon className="h-3 w-3" />
                      {cat.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <p className="text-sm font-semibold mb-2">Content Type</p>
              <div className="flex flex-wrap gap-2">
                {types.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.id}
                      variant={selectedType === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type.id as ResourceType | "all")}
                      className="gap-2"
                    >
                      <Icon className="h-3 w-3" />
                      {type.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredResources.length} {filteredResources.length === 1 ? "resource" : "resources"}
        </p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <Card
            key={resource.id}
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => setSelectedResource(resource)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(resource.type)}
                  <Badge variant="outline" className="text-xs">
                    {resource.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-500">
                  <Star className="h-3 w-3 fill-current" />
                  {resource.rating}
                </div>
              </div>
              <CardTitle className="text-base group-hover:text-primary transition-colors">
                {resource.title}
              </CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                {resource.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {resource.duration}
                </div>
                <Badge className={getDifficultyColor(resource.difficulty)} variant="secondary">
                  {resource.difficulty}
                </Badge>
              </div>
              {resource.completionRate > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{resource.completionRate}%</span>
                  </div>
                  <Progress value={resource.completionRate} className="h-1" />
                </div>
              )}
              <Button size="sm" className="w-full gap-2 group-hover:bg-primary/90">
                {resource.type === "video" && <Play className="h-3 w-3" />}
                {resource.type === "audio" && <Headphones className="h-3 w-3" />}
                {resource.type === "article" && <BookOpen className="h-3 w-3" />}
                {resource.type === "interactive" && <Sparkles className="h-3 w-3" />}
                Start Learning
                <ChevronRight className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No resources found matching your filters</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedType("all");
                setSearchQuery("");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Resource Viewer Modal */}
      {selectedResource && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedResource(null)}
        >
          <Card
            className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(selectedResource.type)}
                    <Badge variant="outline">{selectedResource.type}</Badge>
                    <Badge className={getDifficultyColor(selectedResource.difficulty)}>
                      {selectedResource.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{selectedResource.title}</CardTitle>
                  <CardDescription className="mt-2">{selectedResource.description}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedResource(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video Content */}
              {selectedResource.type === "video" && (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedResource.content}
                    title={selectedResource.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {/* Audio Content */}
              {selectedResource.type === "audio" && (
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-lg">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Button
                      size="lg"
                      className="rounded-full h-16 w-16"
                      onClick={() =>
                        setPlayingAudio(playingAudio === selectedResource.id ? null : selectedResource.id)
                      }
                    >
                      {playingAudio === selectedResource.id ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                  <div className="text-center mb-4">
                    <p className="font-semibold mb-1">{selectedResource.title}</p>
                    <p className="text-sm text-muted-foreground">{selectedResource.duration}</p>
                  </div>
                  <Progress value={playingAudio === selectedResource.id ? 45 : 0} className="mb-4" />
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm leading-relaxed">{selectedResource.content}</p>
                  </div>
                </div>
              )}

              {/* Article Content */}
              {selectedResource.type === "article" && (
                <div className="prose prose-sm max-w-none">
                  <div
                    className="leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: selectedResource.content.replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              )}

              {/* Interactive Content */}
              {selectedResource.type === "interactive" && (
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-lg text-center">
                  <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Interactive Learning Experience</h3>
                  <p className="text-muted-foreground mb-6">
                    Practice coding with real-time feedback and examples
                  </p>
                  <Button className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Launch Interactive Tutorial
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
