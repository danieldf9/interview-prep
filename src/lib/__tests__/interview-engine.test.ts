import {
  getNextQuestion,
  generateInterviewerMessage,
  evaluateResponse,
  generateReport,
} from '../interview-engine';
import { InterviewMessage } from '../types';

describe('Interview Engine', () => {
  describe('getNextQuestion', () => {
    it('should return a question from the specified topic', () => {
      const question = getNextQuestion('Playwright with JavaScript/TypeScript', []);
      expect(question).toBeTruthy();
      expect(typeof question).toBe('string');
      expect(question.length).toBeGreaterThan(0);
    });

    it('should not return already asked questions', () => {
      const firstQuestion = getNextQuestion('Selenium with Java', []);
      const secondQuestion = getNextQuestion('Selenium with Java', [firstQuestion]);
      expect(secondQuestion).not.toBe(firstQuestion);
    });

    it('should handle empty topic by using fallback', () => {
      const question = getNextQuestion('NonExistentTopic', []);
      expect(question).toBeTruthy();
    });

    it('should return a question even when all questions are asked', () => {
      const topic = 'API Testing';
      const allQuestions: string[] = [];
      
      // Exhaust all questions
      for (let i = 0; i < 50; i++) {
        const q = getNextQuestion(topic, allQuestions);
        if (!allQuestions.includes(q)) {
          allQuestions.push(q);
        }
      }
      
      // Should still return a question (random from pool)
      const question = getNextQuestion(topic, allQuestions);
      expect(question).toBeTruthy();
    });
  });

  describe('generateInterviewerMessage', () => {
    it('should generate welcome message for first question', () => {
      const message = generateInterviewerMessage('Cypress Testing', [], true);
      
      expect(message.role).toBe('interviewer');
      expect(message.content).toContain('Welcome');
      expect(message.content).toContain('Cypress Testing');
      expect(message.timestamp).toBeInstanceOf(Date);
      expect(message.id).toBeTruthy();
    });

    it('should generate follow-up question message', () => {
      const askedQuestions = ['What is Playwright?'];
      const message = generateInterviewerMessage('Playwright with JavaScript/TypeScript', askedQuestions, false);
      
      expect(message.role).toBe('interviewer');
      expect(message.content).toBeTruthy();
      expect(message.timestamp).toBeInstanceOf(Date);
    });

    it('should include a question in the message', () => {
      const message = generateInterviewerMessage('Performance Testing', [], true);
      const lines = message.content.split('\n\n');
      
      expect(lines.length).toBeGreaterThan(1);
      expect(lines[lines.length - 1].length).toBeGreaterThan(10);
    });
  });

  describe('evaluateResponse', () => {
    it('should evaluate a good response with high score', () => {
      const response = `Playwright is a modern end-to-end testing framework developed by Microsoft. 
        For example, it supports multiple browsers like Chromium, Firefox, and WebKit. 
        First, it has auto-waiting built-in which eliminates flaky tests. 
        Second, it provides better debugging tools. Additionally, it runs tests in parallel by default. 
        This is because it uses a single API for all browsers, which makes it more efficient than Selenium.`;
      
      const question = 'What is Playwright and how does it differ from Selenium?';
      const { feedback, followUp } = evaluateResponse(response, question);
      
      expect(feedback.score).toBeGreaterThanOrEqual(70);
      expect(feedback.strengths.length).toBeGreaterThan(0);
      expect(feedback.improvements.length).toBeGreaterThan(0);
      expect(feedback.keywords.length).toBeGreaterThan(0);
      expect(feedback.idealAnswer).toBeTruthy();
      expect(followUp).toBeTruthy();
    });

    it('should evaluate a poor response with lower score', () => {
      const response = 'It is a testing tool.';
      const question = 'What is Selenium WebDriver?';
      const { feedback } = evaluateResponse(response, question);
      
      expect(feedback.score).toBeLessThan(70);
      expect(feedback.improvements.length).toBeGreaterThan(0);
    });

    it('should identify technical keywords', () => {
      const response = 'Selenium WebDriver uses locators like xpath, css selector, and id to find elements. It supports multiple programming languages including Java, Python, and JavaScript.';
      const question = 'How does Selenium work?';
      const { feedback } = evaluateResponse(response, question);
      
      expect(feedback.keywords.length).toBeGreaterThan(0);
    });

    it('should reward structured answers', () => {
      const structuredResponse = 'First, Cypress runs directly in the browser. Second, it has automatic waiting. Additionally, it provides time-travel debugging.';
      const unstructuredResponse = 'Cypress runs in the browser and has automatic waiting and debugging.';
      const question = 'What are the advantages of Cypress?';
      
      const { feedback: structuredFeedback } = evaluateResponse(structuredResponse, question);
      const { feedback: unstructuredFeedback } = evaluateResponse(unstructuredResponse, question);
      
      expect(structuredFeedback.score).toBeGreaterThan(unstructuredFeedback.score);
    });

    it('should reward answers with examples', () => {
      const withExample = 'REST APIs use HTTP methods. For example, GET retrieves data, POST creates new resources.';
      const withoutExample = 'REST APIs use HTTP methods like GET and POST.';
      const question = 'What are HTTP methods?';
      
      const { feedback: withExampleFeedback } = evaluateResponse(withExample, question);
      const { feedback: withoutExampleFeedback } = evaluateResponse(withoutExample, question);
      
      expect(withExampleFeedback.score).toBeGreaterThan(withoutExampleFeedback.score);
    });

    it('should provide ideal answer for common questions', () => {
      const question = 'What is Playwright and how does it differ from other testing frameworks like Selenium?';
      const { feedback } = evaluateResponse('Some answer', question);
      
      expect(feedback.idealAnswer).toBeTruthy();
      expect(feedback.idealAnswer).toContain('Playwright');
    });

    it('should provide generic ideal answer for unknown questions', () => {
      const question = 'Some random question that is not in the database';
      const { feedback } = evaluateResponse('Some answer', question);
      
      expect(feedback.idealAnswer).toBeTruthy();
      expect(feedback.idealAnswer).toContain('comprehensive');
    });
  });

  describe('generateReport', () => {
    let messages: InterviewMessage[];

    beforeEach(() => {
      messages = [
        {
          id: '1',
          role: 'interviewer',
          content: 'Welcome! What is Selenium?',
          timestamp: new Date(),
        },
        {
          id: '2',
          role: 'candidate',
          content: 'Selenium is a web automation tool that supports multiple browsers and programming languages.',
          timestamp: new Date(),
          feedback: {
            score: 85,
            strengths: ['Clear explanation', 'Mentioned key features'],
            improvements: ['Could add more details'],
            keywords: ['selenium', 'automation'],
            idealAnswer: 'Detailed answer here',
          },
        },
        {
          id: '3',
          role: 'interviewer',
          content: 'What is the Page Object Model?',
          timestamp: new Date(),
        },
        {
          id: '4',
          role: 'candidate',
          content: 'POM is a design pattern for organizing test code.',
          timestamp: new Date(),
          feedback: {
            score: 72,
            strengths: ['Correct definition'],
            improvements: ['Explain benefits', 'Add examples'],
            keywords: ['pom', 'pattern'],
            idealAnswer: 'Detailed answer here',
          },
        },
      ];
    });

    it('should generate a report from interview messages', () => {
      const report = generateReport(messages, 'Selenium with Java');
      
      expect(report.overallScore).toBeGreaterThan(0);
      expect(report.communication).toBeGreaterThan(0);
      expect(report.technicalAccuracy).toBeGreaterThan(0);
      expect(report.problemSolving).toBeGreaterThan(0);
      expect(report.confidence).toBeGreaterThan(0);
      expect(report.clarity).toBeGreaterThan(0);
    });

    it('should calculate average score correctly', () => {
      const report = generateReport(messages, 'Selenium with Java');
      const expectedAvg = Math.round((85 + 72) / 2);
      
      expect(report.overallScore).toBe(expectedAvg);
    });

    it('should collect strengths and improvements', () => {
      const report = generateReport(messages, 'Selenium with Java');
      
      expect(report.strengths.length).toBeGreaterThan(0);
      expect(report.areasForImprovement.length).toBeGreaterThan(0);
    });

    it('should generate detailed feedback for each question', () => {
      const report = generateReport(messages, 'Selenium with Java');
      
      expect(report.detailedFeedback.length).toBe(2);
      expect(report.detailedFeedback[0].questionId).toBeTruthy();
      expect(report.detailedFeedback[0].question).toBeTruthy();
      expect(report.detailedFeedback[0].score).toBeGreaterThan(0);
    });

    it('should provide suggested resources', () => {
      const report = generateReport(messages, 'Selenium with Java');
      
      expect(report.suggestedResources.length).toBeGreaterThan(0);
      expect(report.suggestedResources[0].title).toBeTruthy();
      expect(report.suggestedResources[0].type).toBeTruthy();
    });

    it('should handle empty messages array', () => {
      const report = generateReport([], 'API Testing');
      
      expect(report.overallScore).toBeGreaterThanOrEqual(0);
      expect(report.strengths.length).toBeGreaterThan(0);
      expect(report.areasForImprovement.length).toBeGreaterThan(0);
    });

    it('should handle messages without feedback', () => {
      const messagesWithoutFeedback: InterviewMessage[] = [
        {
          id: '1',
          role: 'interviewer',
          content: 'Question',
          timestamp: new Date(),
        },
        {
          id: '2',
          role: 'candidate',
          content: 'Answer',
          timestamp: new Date(),
        },
      ];
      
      const report = generateReport(messagesWithoutFeedback, 'Performance Testing');
      expect(report).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long responses', () => {
      const longResponse = 'This is a test. '.repeat(200);
      const { feedback } = evaluateResponse(longResponse, 'Test question');
      
      expect(feedback.score).toBeLessThanOrEqual(98);
      expect(feedback.score).toBeGreaterThan(0);
    });

    it('should handle empty responses', () => {
      const { feedback } = evaluateResponse('', 'Test question');
      
      expect(feedback.score).toBeGreaterThan(0);
      expect(feedback.improvements.length).toBeGreaterThan(0);
    });

    it('should handle special characters in responses', () => {
      const response = 'Testing with @#$%^&*() special characters!';
      const { feedback } = evaluateResponse(response, 'Test question');
      
      expect(feedback).toBeTruthy();
      expect(feedback.score).toBeGreaterThan(0);
    });
  });
});
