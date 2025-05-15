import { Bite } from "@/types/meals";
import { readFileSync } from "fs";
import OpenAI from "openai";

// Convert JSON string to JSON object.
function parseJson(jsonStr: string): any {
    if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace("```json", "").replace("```", "").trim();
    }
    return JSON.parse(jsonStr);
}

export async function decomposeMeal(title: string, description: string): Promise<Bite[]> {
    try {
        const dietitianPrompt = readFileSync(process.cwd() + "/prompts/DIETITIAN.md", "utf8");

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.LLM_API_KEY!,
        });

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: dietitianPrompt },
                { role: "user", content: `${title}:\n${description}` }
            ],
            model: "google/gemini-2.0-flash-001",
            stream: false,
        });
        const response = completion.choices[0].message.content;
        return parseJson(response!) as Bite[];
    } catch (e) {
        console.error(e);
        throw Error("Failed to decompose meal");
    }
}
