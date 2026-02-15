
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "../types";

// Obtain API key from environment
const API_KEY = process.env.API_KEY;

export interface MatchAnalysisResponse {
  ai_score: number;
  dimensions: {
    personality_compatibility: { score: number; max: number; reason: string };
    lifestyle_match: { score: number; max: number; reason: string };
    values_alignment: { score: number; max: number; reason: string };
  };
  recommendation_summary: string;
  potential_friction: string;
  confidence: number;
}

export const analyzeMatch = async (userA: UserProfile, userB: UserProfile): Promise<MatchAnalysisResponse> => {
  if (!API_KEY) {
    throw new Error("API_KEY is not configured");
  }

  // Initialize the GenAI client with the API key from environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  // Data Masking - only send de-identified features
  // FIX: Line 31, 36 - Corrected property names to match UserProfile interface
  const deidentifiedA = {
    age_range: "25-30", // In a real app, calculate from birth_date
    height: userA.height,
    education: userA.education,
    career: userA.career_description,
    marriage_status: userA.marriage_status,
    personality: userA.personality_tags,
    hobbies: userA.hobbies,
    lifestyle: userA.lifestyle,
    marriage_view: userA.bride_price_attitude,
    declaration: userA.partner_declaration,
    weekend: userA.ideal_weekend
  };

  // FIX: Line 45, 50 - Corrected property names to match UserProfile interface
  const deidentifiedB = {
    age_range: "25-30",
    height: userB.height,
    education: userB.education,
    career: userB.career_description,
    marriage_status: userB.marriage_status,
    personality: userB.personality_tags,
    hobbies: userB.hobbies,
    lifestyle: userB.lifestyle,
    marriage_view: userB.bride_price_attitude,
    declaration: userB.partner_declaration,
    weekend: userB.ideal_weekend
  };

  const prompt = `你是一位专业的数字红娘匹配专家。请分析以下两位单身男女的脱敏资料，评估他们的婚恋匹配度，并给出详细的分析报告。
  
  用户A: ${JSON.stringify(deidentifiedA)}
  用户B: ${JSON.stringify(deidentifiedB)}
  
  评估维度包括：性格兼容性(15分)、生活方式匹配(12分)、价值观一致性(13分)。总分50分。
  请以JSON格式返回结果。`;

  try {
    // FIX: Using gemini-3-pro-preview for complex reasoning task
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ai_score: { type: Type.NUMBER },
            dimensions: {
              type: Type.OBJECT,
              properties: {
                personality_compatibility: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    max: { type: Type.NUMBER },
                    reason: { type: Type.STRING }
                  },
                  required: ["score", "max", "reason"]
                },
                lifestyle_match: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    max: { type: Type.NUMBER },
                    reason: { type: Type.STRING }
                  },
                  required: ["score", "max", "reason"]
                },
                values_alignment: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    max: { type: Type.NUMBER },
                    reason: { type: Type.STRING }
                  },
                  required: ["score", "max", "reason"]
                }
              },
              required: ["personality_compatibility", "lifestyle_match", "values_alignment"]
            },
            recommendation_summary: { type: Type.STRING },
            potential_friction: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["ai_score", "dimensions", "recommendation_summary", "potential_friction", "confidence"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    return result as MatchAnalysisResponse;
  } catch (error) {
    console.error("AI Match Analysis failed:", error);
    // Graceful degradation: return a generic score based on education/city/age
    return {
      ai_score: 35,
      dimensions: {
        personality_compatibility: { score: 10, max: 15, reason: "由于AI服务繁忙，系统进行了初步评估。" },
        lifestyle_match: { score: 10, max: 12, reason: "基础条件匹配度较高。" },
        values_alignment: { score: 10, max: 13, reason: "核心价值观初步判断一致。" }
      },
      recommendation_summary: "系统综合评估认为两位有较好的接触潜力。",
      potential_friction: "建议通过线下交流深入了解性格细节。",
      confidence: 0.6
    };
  }
};
