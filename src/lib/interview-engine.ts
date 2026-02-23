import { InterviewMessage, MessageFeedback, InterviewReport } from "./types";
import { interviewQuestions, aiResponses } from "./mock-data";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function analyzeResponse(response: string): { quality: "good" | "average" | "poor"; score: number } {
  const wordCount = response.split(/\s+/).length;
  const hasExamples = /for example|such as|instance|like when/i.test(response);
  const hasStructure = /first|second|additionally|moreover|furthermore/i.test(response);
  const hasTechnicalTerms = /algorithm|component|architecture|database|api|function|class|interface|pattern|optimization/i.test(response);

  let score = 50;
  if (wordCount > 30) score += 10;
  if (wordCount > 60) score += 10;
  if (wordCount > 100) score += 5;
  if (hasExamples) score += 10;
  if (hasStructure) score += 8;
  if (hasTechnicalTerms) score += 7;

  score = Math.min(score, 98);
  score += Math.floor(Math.random() * 5) - 2;
  score = Math.max(40, Math.min(98, score));

  if (score >= 75) return { quality: "good", score };
  if (score >= 55) return { quality: "average", score };
  return { quality: "poor", score };
}

function generateFeedback(response: string, score: number, question: string): MessageFeedback {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const keywords: string[] = [];

  const wordCount = response.split(/\s+/).length;

  if (wordCount > 50) strengths.push("Detailed and comprehensive response");
  else improvements.push("Try to provide more detailed explanations");

  if (/for example|such as|instance/i.test(response)) {
    strengths.push("Good use of examples to illustrate points");
  } else {
    improvements.push("Include specific examples to strengthen your answer");
  }

  if (/first|second|additionally|moreover/i.test(response)) {
    strengths.push("Well-structured and organized answer");
  } else {
    improvements.push("Structure your answer with clear points");
  }

  if (/because|reason|due to|therefore/i.test(response)) {
    strengths.push("Good reasoning and logical flow");
  } else {
    improvements.push("Explain the reasoning behind your statements");
  }

  const techTerms = response.match(/\b(react|javascript|api|database|component|function|algorithm|pattern|architecture|optimization|performance|scalab|async|promise|hook|state|render|virtual dom|closure|prototype|selenium|playwright|cypress|webdriver|locator|assertion|testng|pytest|jmeter|postman)\b/gi);
  if (techTerms) {
    keywords.push(...[...new Set(techTerms.map((t) => t.toLowerCase()))].slice(0, 5));
    strengths.push("Appropriate use of technical terminology");
  }

  if (strengths.length === 0) strengths.push("Shows willingness to attempt the question");
  if (improvements.length === 0) improvements.push("Continue practicing to build confidence");

  const idealAnswer = generateIdealAnswer(question);

  return { score, strengths, improvements, keywords, idealAnswer };
}

function generateIdealAnswer(question: string): string {
  const idealAnswers: Record<string, string> = {
    "What is Playwright and how does it differ from other testing frameworks like Selenium?": "Playwright is a modern end-to-end testing framework developed by Microsoft that supports Chromium, Firefox, and WebKit browsers. Unlike Selenium, Playwright has auto-waiting built-in, runs tests in parallel by default, provides better debugging tools with trace viewer, supports multiple browser contexts in a single test, and has faster execution. It also offers better handling of modern web features like Shadow DOM, iframes, and web components. Playwright uses a single API for all browsers, while Selenium requires browser-specific drivers.",
    
    "Explain how to handle multiple browser contexts in Playwright.": "In Playwright, you can create multiple browser contexts using browser.newContext(). Each context is isolated with its own cookies, localStorage, and session data. This is useful for testing multi-user scenarios or different user states. Example: const context1 = await browser.newContext(); const context2 = await browser.newContext(); Each context can have multiple pages. Contexts are lightweight and faster than launching multiple browsers. You should close contexts after use with await context.close().",
    
    "What are the main advantages and limitations of Cypress compared to Selenium?": "Cypress advantages: runs directly in the browser for faster execution, automatic waiting eliminates flaky tests, time-travel debugging, real-time reloads, easier setup with no WebDriver needed, built-in assertions and mocking. Limitations: only supports JavaScript/TypeScript, limited cross-browser support (mainly Chrome-based), cannot handle multiple tabs/windows, same-origin policy restrictions, no native mobile testing, and tests must run in the same run loop as the application.",
    
    "What is Selenium WebDriver and how does it work internally?": "Selenium WebDriver is a browser automation tool that controls browsers through a driver executable. It works using the W3C WebDriver protocol: your test code sends HTTP requests (JSON Wire Protocol) to the browser driver (chromedriver, geckodriver, etc.), which translates these commands into browser-specific actions. The driver communicates with the browser, executes the action, and returns the result. WebDriver supports multiple languages (Java, Python, JavaScript, C#) and browsers, making it highly flexible for cross-browser testing.",
    
    "How do you handle dynamic elements and waits in Selenium? Explain implicit, explicit, and fluent waits.": "Implicit wait: Sets a global timeout for finding elements (driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS)). Applied to all findElement calls. Explicit wait: Waits for a specific condition using WebDriverWait (new WebDriverWait(driver, 10).until(ExpectedConditions.elementToBeClickable(element))). More flexible and recommended. Fluent wait: Like explicit wait but allows custom polling interval and ignores specific exceptions (new FluentWait(driver).withTimeout(30, SECONDS).pollingEvery(5, SECONDS).ignoring(NoSuchElementException.class)).",
    
    "What is the difference between REST and SOAP APIs?": "REST (Representational State Transfer) uses HTTP methods (GET, POST, PUT, DELETE), supports multiple formats (JSON, XML), is stateless, lightweight, and easier to implement. SOAP (Simple Object Access Protocol) is a protocol with strict standards, uses only XML, has built-in error handling (SOAP faults), supports WS-Security for enterprise security, and is stateful. REST is preferred for web and mobile apps due to simplicity and performance, while SOAP is used in enterprise environments requiring high security and ACID compliance.",
    
    "What is the difference between load testing, stress testing, and spike testing?": "Load testing: Tests system behavior under expected normal and peak load conditions to verify it meets performance requirements. Stress testing: Pushes the system beyond normal capacity to find breaking points and see how it recovers from failure. Spike testing: Tests system response to sudden large increases in load (traffic spikes). Load testing validates capacity, stress testing finds limits and stability, spike testing checks elasticity and auto-scaling capabilities.",
  };

  return idealAnswers[question] || "A comprehensive answer would include: clear explanation of the concept, practical examples from real-world scenarios, discussion of trade-offs and best practices, mention of common pitfalls to avoid, and demonstration of deep understanding through technical details. Structure your response logically, use proper terminology, and relate concepts to actual implementation experience.";
}

export function getNextQuestion(topic: string, askedQuestions: string[]): string {
  const questions = interviewQuestions[topic] || interviewQuestions["Frontend Development"];
  const available = questions.filter((q) => !askedQuestions.includes(q));
  if (available.length === 0) return getRandomItem(questions);
  return getRandomItem(available);
}

export function generateInterviewerMessage(
  topic: string,
  askedQuestions: string[],
  isFirst: boolean
): InterviewMessage {
  if (isFirst) {
    return {
      id: generateId(),
      role: "interviewer",
      content: `Welcome to your ${topic} interview! I'll be your interviewer today. I'll ask you a series of questions to assess your knowledge and problem-solving skills. Take your time to think through each answer, and feel free to ask for clarification if needed. Let's begin!\n\n${getNextQuestion(topic, askedQuestions)}`,
      timestamp: new Date(),
    };
  }

  const question = getNextQuestion(topic, askedQuestions);
  return {
    id: generateId(),
    role: "interviewer",
    content: question,
    timestamp: new Date(),
  };
}

export function evaluateResponse(
  candidateMessage: string,
  currentQuestion: string
): { feedback: MessageFeedback; followUp: string } {
  const { quality, score } = analyzeResponse(candidateMessage);
  const feedback = generateFeedback(candidateMessage, score, currentQuestion);
  const followUp = getRandomItem(aiResponses[quality]);

  return { feedback, followUp };
}

export function generateReport(
  messages: InterviewMessage[],
  topic: string
): InterviewReport {
  const candidateMessages = messages.filter((m) => m.role === "candidate");
  const feedbacks = candidateMessages
    .filter((m) => m.feedback)
    .map((m) => m.feedback!);

  const avgScore = feedbacks.length > 0
    ? Math.round(feedbacks.reduce((sum, f) => sum + f.score, 0) / feedbacks.length)
    : 70;

  const communication = Math.min(98, avgScore + Math.floor(Math.random() * 10) - 3);
  const technicalAccuracy = Math.min(98, avgScore + Math.floor(Math.random() * 12) - 6);
  const problemSolving = Math.min(98, avgScore + Math.floor(Math.random() * 8) - 4);
  const confidence = Math.min(98, avgScore + Math.floor(Math.random() * 10) - 2);
  const clarity = Math.min(98, avgScore + Math.floor(Math.random() * 10) - 5);

  const allStrengths = feedbacks.flatMap((f) => f.strengths);
  const allImprovements = feedbacks.flatMap((f) => f.improvements);

  const uniqueStrengths = [...new Set(allStrengths)].slice(0, 4);
  const uniqueImprovements = [...new Set(allImprovements)].slice(0, 4);

  if (uniqueStrengths.length === 0) {
    uniqueStrengths.push(
      "Showed willingness to engage with questions",
      "Maintained professional demeanor throughout"
    );
  }
  if (uniqueImprovements.length === 0) {
    uniqueImprovements.push(
      "Practice providing more detailed responses",
      "Work on structuring answers using frameworks like STAR"
    );
  }

  const interviewerMessages = messages.filter((m) => m.role === "interviewer");
  const detailedFeedback = interviewerMessages.slice(0, 5).map((msg, i) => {
    const candidateReply = candidateMessages[i];
    const score = candidateReply?.feedback?.score || 70;
    return {
      questionId: `q${i + 1}`,
      question: msg.content.length > 200 ? msg.content.substring(msg.content.lastIndexOf("\n\n") + 2) : msg.content,
      score,
      feedback: candidateReply?.feedback
        ? `${candidateReply.feedback.strengths[0] || "Good attempt"}. ${candidateReply.feedback.improvements[0] || "Keep practicing"}.`
        : "No response provided for this question.",
      idealAnswer: `A strong answer would cover the key concepts of ${topic}, provide specific examples, and demonstrate practical understanding.`,
    };
  });

  return {
    overallScore: avgScore,
    communication,
    technicalAccuracy,
    problemSolving,
    confidence,
    clarity,
    strengths: uniqueStrengths,
    areasForImprovement: uniqueImprovements,
    detailedFeedback,
    suggestedResources: [
      {
        title: `${topic} Mastery Guide`,
        type: "article",
        url: "#",
        description: `Comprehensive guide to mastering ${topic} interview questions`,
      },
      {
        title: `Advanced ${topic} Patterns`,
        type: "course",
        url: "#",
        description: `Deep dive into advanced ${topic} concepts and patterns`,
      },
      {
        title: `${topic} Interview Walkthrough`,
        type: "video",
        url: "#",
        description: `Watch expert engineers solve ${topic} interview problems`,
      },
      {
        title: `${topic} Practice Problems`,
        type: "practice",
        url: "#",
        description: `Hands-on practice problems for ${topic} interviews`,
      },
    ],
  };
}
