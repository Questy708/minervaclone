import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize the official Google Gen AI SDK
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY) {
  ai = new GoogleGenAI({
    apiKey: API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.log("Warning: GEMINI_API_KEY environment variable is missing.");
}

// 1. API: Simulate interactive classroom discussion
app.post("/api/gemini/discuss", async (req, res) => {
  const { topic, activeStudent, previousMessages } = req.body;

  if (!ai) {
    return res.status(500).json({ error: "Gemini AI client not initialized. Please verify GEMINI_API_KEY." });
  }

  try {
    const prompt = `You are simulating a highly structured, critical thinking classroom seminar at Artemis University on the Active Learning Forum.
Topic / Active document:
"${topic}"

The active speaker is student "${activeStudent}".
Previous dialogue thread:
${JSON.stringify(previousMessages || [])}

Generate a short, intelligent, critical discussion post (max 120 words) from the perspective of "${activeStudent}".
The student should explicitly apply Artemis HCs (such as #analogies, #breakitdown, #constraints, #dataviz, #critique, #observation, or #variables) with proper hashtags, maintaining a sharp, academic, and collegiate tone. No preamble or markdown styling around the text. Just the speech itself.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    res.json({ text: response.text?.trim() || "The student stands in silence, formulating a reply..." });
  } catch (error: any) {
    console.error("Gemini discussion error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. API: Formative Classroom / Essay Assessment
app.post("/api/gemini/assess", async (req, res) => {
  const { studentName, spokenText, assignedHC } = req.body;

  if (!ai) {
    return res.status(500).json({ error: "Gemini AI client not initialized." });
  }

  try {
    const prompt = `You are a world-class Artemis Faculty assessing student performance on their Habits of Mind and Foundational Concepts (HCs).
Evaluate the following comment or text written by student "${studentName}" targeting the active concept "${assignedHC}":

Text: "${spokenText}"

Provide:
1. A Score from 1 to 5 (1 = fails to use concept, 3 = correctly identifies and applies concept, 5 = masterfully utilizes concept in novel context).
2. "criteria": an array of 2 to 3 related grading rubric criteria that apply to this response.
3. "feedbackOptions": an array of 2 to 3 formal academic comments (under 40 words each) structured as helpful formative feedback (including exact context anchoring).
4. "anchoredText": the exact words from the student's text that demonstrate the concept.

Respond in strict JSON format:
{
  "score": number, 
  "criteria": ["string"],
  "feedbackOptions": ["string"],
  "anchoredText": "string"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["score", "criteria", "feedbackOptions", "anchoredText"],
          properties: {
            score: { type: Type.INTEGER, description: "Grade score from 1 to 5" },
            criteria: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Relevant grading criteria" },
            feedbackOptions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Constructive feedback variations" },
            anchoredText: { type: Type.STRING, description: "Selected passage demonstrating active concept" }
          }
        }
      }
    });

    const assessment = JSON.parse(response.text?.trim() || "{}");
    res.json(assessment);
  } catch (error: any) {
    console.error("Gemini assessment error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. API: Dynamic Lesson Plan Generator for Course Builder
app.post("/api/gemini/generate-lesson", async (req, res) => {
  const { topic, courseName } = req.body;

  if (!ai) {
    return res.status(500).json({ error: "Gemini AI client not initialized." });
  }

  try {
    const prompt = `Create a custom detailed lesson plan on the science/humanity topic: "${topic}" for the course "${courseName}".
It must adhere to Active Learning guidelines:
- Outline a 4-part lesson plan timeline.
- Select 3 highly relevant Artemis Habits of Mind (#hashtags).
- Establish standard budget requirements.

Respond in strict JSON:
{
  "description": "string (summary course description)",
  "lessonTimeline": [
    { "title": "string", "subtitle": "string", "duration": "string", "type": "string" },
    ... max 4 items
  ],
  "recommendedHCs": ["#string", "#string", "#string"],
  "resourceBudget": {
    "total": number,
    "available": number,
    "suggestedResourceName": "string"
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["description", "recommendedHCs", "lessonTimeline", "resourceBudget"],
          properties: {
            description: { type: Type.STRING },
            recommendedHCs: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            lessonTimeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "subtitle", "duration", "type"],
                properties: {
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  type: { type: Type.STRING }
                }
              }
            },
            resourceBudget: {
              type: Type.OBJECT,
              required: ["total", "available", "suggestedResourceName"],
              properties: {
                total: { type: Type.INTEGER },
                available: { type: Type.INTEGER },
                suggestedResourceName: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Lesson generator error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. API: Reverse Engineering screenshot solver engine
app.post("/api/gemini/reverse-engineer", async (req, res) => {
  const { clueText, userDeduction } = req.body;

  if (!ai) {
    return res.status(500).json({ error: "Gemini AI client not initialized." });
  }

  try {
    const prompt = `You are a master Software Architect & Reverse-Engineering intelligent entity. 
Given a specific image clue/metadata of a running software system and a user's initial observations, decompose backwards how this software came to be.
Provide a complete, deep architectural map trace.

System Metadata clue:
"${clueText}"

User thoughts & requests:
"${userDeduction || ""}"

Respond with a full, highly structured analysis of the event. Build out:
1. Chronology of Event Map: The journey a user makes step-by-step from registration down to the specific UI event state.
2. Relational Database Schema Model (PostgreSQL/Spanner DDL style schema tables for courses, students, timelines, feedback stats, etc.)
3. REST API Routes: Express paths required to fetch/update this exact view state.
4. UI Component Architecture breakdown: How to split this screen into responsive, highly optimized components.
5. Code snippet suggestion: Full mock React snippet illustrating the core interactive element of that screen.

Generate the answer formatted in rich Markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    res.json({ analysis: response.text || "Decomposition maps failed. Please check the clue parameters." });
  } catch (error: any) {
    console.error("Reverse Engineering engine error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 5. API: AI Tutor / Academic Coach
app.post("/api/gemini/tutor", async (req, res) => {
  const { prompt, previousHistory } = req.body;

  if (!ai) {
    return res.status(500).json({ error: "Gemini AI client not initialized." });
  }

  try {
    const systemInstruction = `You are a world-class academic tutor and cognitive coach at Artemis University. 
Your goal is to guide students to develop supreme critical thinking using Artemis Habits of Mind and Foundational Concepts (HCs). 
Be challenging, collegiate, rigorous, yet deeply supportive. 
Always encourage the student to think through active parameters, such as #constraints, #breakitdown, #analogies, #correlation, or #testability. 
Maintain a supportive analytical tone. Do not give simple copy-paste answers; instead, challenge assumptions and provide causal breakdowns.`;

    const contents = [
      ...(previousHistory || []),
      { role: "user", parts: [{ text: prompt }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.75,
      }
    });

    res.json({ reply: response.text || "I am reflecting on your thought process. Could you refine your hypothesis?" });
  } catch (error: any) {
    console.error("AI Tutor engine error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Setup Vite Development Middleware or Production Static Handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
