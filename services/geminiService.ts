import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Difficulty, CodeTask, FeedbackResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Prompt to generate a new coding task
export const generateCodingTask = async (difficulty: Difficulty, topic?: string): Promise<CodeTask> => {
  const modelId = "gemini-2.5-flash"; // Fast model for generation
  
  const prompt = `
    Create a Deep Learning coding exercise for a student.
    Difficulty Level: ${difficulty}
    Topic Focus: ${topic || 'General Deep Learning concepts (PyTorch or TensorFlow)'}
    
    The code should be a self-contained snippet (e.g., a model definition, a training loop, a data loader, or a specific layer implementation).
    It should be roughly 15-40 lines of code.

    CRITICAL INSTRUCTIONS FOR CONTENT:
    1. "title": Provide a title in Korean.
    2. "description": Provide a description in Korean.
    3. "explanation": Provide a VERY SHORT and CONCISE concept summary in Korean (maximum 1 sentence).
    4. "code": Python code. Standard English comments are fine, or Korean if appropriate.
    
    Return the response in JSON format.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      code: { type: Type.STRING, description: "The Python code snippet to clone." },
      explanation: { type: Type.STRING, description: "Very short explanation in Korean." },
      language: { type: Type.STRING, enum: ["python"] },
    },
    required: ["title", "description", "code", "explanation", "language"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert Deep Learning Tutor. You generate clean, best-practice Python code (PyTorch/Keras). You speak Korean for descriptions."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const data = JSON.parse(text);
    return {
      id: Date.now().toString(),
      difficulty,
      ...data
    };
  } catch (error) {
    console.error("Error generating task:", error);
    // Fallback task if API fails
    return {
      id: "fallback",
      title: "과제 생성 오류",
      description: "API 키를 확인하거나 다시 시도해주세요.",
      code: "# 과제를 불러올 수 없습니다",
      explanation: "오류 발생",
      language: "python",
      difficulty
    };
  }
};

// Prompt to evaluate the user's cloned code
export const evaluateSubmission = async (originalCode: string, userCode: string): Promise<FeedbackResult> => {
  const modelId = "gemini-2.5-flash";

  const prompt = `
    Compare the User's Code against the Original Reference Code.
    
    Original Code:
    \`\`\`python
    ${originalCode}
    \`\`\`
    
    User's Code:
    \`\`\`python
    ${userCode}
    \`\`\`
    
    Goal: The user is practicing "Clone Coding" (typing exactly or functionally identical code).
    1. Check for typos that break syntax.
    2. Check for missing lines.
    3. Ignore whitespace differences or comments unless they matter.
    4. Provide a score from 0 to 100 based on accuracy.
    5. Provide specific feedback in Korean.
    6. Provide suggestions in Korean.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      isCorrect: { type: Type.BOOLEAN },
      feedback: { type: Type.STRING },
      suggestions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING } 
      }
    },
    required: ["score", "isCorrect", "feedback", "suggestions"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No feedback generated");
    return JSON.parse(text) as FeedbackResult;
  } catch (error) {
    console.error("Error evaluating code:", error);
    return {
      score: 0,
      isCorrect: false,
      feedback: "평가에 실패했습니다. 다시 시도해주세요.",
      suggestions: []
    };
  }
};