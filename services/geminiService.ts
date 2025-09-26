import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// Fix: Per coding guidelines, the API key must be retrieved from process.env.API_KEY. This change also resolves the reported TypeScript error.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;


if (!API_KEY) {
  // Fix: Updated error message to align with the use of process.env.API_KEY.
  throw new Error("API_KEY environment variable not set.");
}

export const ai = new GoogleGenAI({ apiKey: API_KEY });

export const summarizeText = async (text: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following text for a university student. Your goal is to create a concise summary that is significantly shorter than the original text. Focus on the key concepts, main arguments, and any important conclusions. Present it in a clear and easy-to-digest format:\n\n---\n\n${text}`,
    });
    return response.text ?? "Sorry, I was unable to summarize the text. Please try again.";
  } catch (error) {
    console.error("Error summarizing text:", error);
    return "Sorry, I was unable to summarize the text. Please try again.";
  }
};

export const generateStudyPlan = async (subjects: string, topics: string, timeframe: string, hoursPerWeek: string): Promise<string> => {
  const prompt = `Create a detailed study plan for a student with the following details:
- Subjects: ${subjects}
- Topics/Chapters to cover: ${topics}
- Timeframe: ${timeframe}
- Available study hours per week: ${hoursPerWeek}

Break down the plan day-by-day. For each day, list the subject, a specific topic to study from the provided list, and a recommended duration in minutes. Ensure the plan is balanced and covers all subjects and topics mentioned. The student prefers focused study sessions of 60-90 minutes with breaks in between (you don't need to schedule the breaks, just the sessions).`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING, description: "The day of the week (e.g., Monday)." },
              date: { type: Type.STRING, description: "The specific date (e.g., 2024-07-29)." },
              tasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    subject: { type: Type.STRING },
                    topic: { type: Type.STRING, description: "A specific topic or chapter to study." },
                    duration: { type: Type.INTEGER, description: "Study duration in minutes." },
                  },
                  required: ["subject", "topic", "duration"],
                },
              },
            },
            required: ["day", "date", "tasks"],
          },
        },
      },
    });

    return response.text ?? "Sorry, I was unable to generate the study plan. Please try again.";
  } catch (error) {
    console.error("Error generating study plan:", error);
    return "error";
  }
};
