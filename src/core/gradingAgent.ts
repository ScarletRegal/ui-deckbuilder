// src/core/gradingAgent.ts
import { type Encounter } from '../types/encounter.types';
import { type DesignCanvas } from '../types/game.types';

/**
 * The structured response we expect from the AI.
 */
export interface GradeResult {
    pass: boolean;
    feedback: string;
}

/**
 * A helper function to turn the canvas object into a human-readable string.
 * This serialization is key for giving the AI good context.
 */
function serializeCanvas(canvas: DesignCanvas): string {
    const parts: string[] = [];

    parts.push(`- Layout: ${canvas.layout}`);
    parts.push(`- Shape: ${canvas.shape}`);
    parts.push(`- Fill: ${canvas.fillType} (${canvas.backgroundColor || 'none'})`);
    parts.push(`- Stroke: ${canvas.strokeColor || 'none'}`);
    parts.push(`- Padding: ${canvas.padding}px`);

    if (canvas.icon) {
        parts.push(`- Icon: '${canvas.icon.materialIconName}' (Color: ${canvas.icon.color})`);
    } else {
        parts.push("- Icon: none");
    }

    if (canvas.text) {
        parts.push(`- Text: "${canvas.text.text}" (Style: ${canvas.text.styleName}, Color: ${canvas.text.color})`);
    } else {
        parts.push("- Text: none");
    }

    return parts.join('\n');
}

/**
 * The JSON schema we require the Gemini API to respond with.
 */
const ResponseSchema = {
    type: "OBJECT",
    properties: {
        "pass": { "type": "BOOLEAN" },
        "feedback": { "type": "STRING" }
    },
    required: ["pass", "feedback"]
};

/**
 * Calls the Gemini API to grade the player's design.
 */
export async function gradeDesign(
    encounter: Encounter,
    canvas: DesignCanvas
): Promise<GradeResult> {

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey}`;

    // 1. Define the AI's persona and rules
    const systemPrompt = `
    You are a world-class design critic and educator. Your goal is to grade a student's UI component based on a specific prompt.
    In Deckbuilding Roguelike fashion, students will use cards in a generated deck to edit the container for submission.
    You MUST respond in valid JSON that adheres to the user's provided schema.
    
    - "pass" (boolean): Did the student meet the core requirements of the prompt?
    - "feedback" (string): A short, single-paragraph of constructive feedback explaining your grade. Be encouraging but clear.
    
    Grading rules for prompts:
    - Using Material Design's Design System, and general UI principles for UI/UX Design, assess how well the student made their UI component.
    - Keep in mind that students may not have had the correct cards in their deck, so if a component looks loosely like a real UI component, it can pass.
  `;

    // 2. Serialize the player's work
    const canvasStateString = serializeCanvas(canvas);

    // 3. Create the user's prompt
    const userQuery = `
    Here is the student's submission.
    
    CHALLENGE PROMPT: "${encounter.promptName}"
    
    STUDENT'S COMPONENT STATE:
    ${canvasStateString}
    
    Please grade this submission based on the rules in your system prompt.
  `;

    // 4. Construct the API payload
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        // systemInstruction works on 1.5 models
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: ResponseSchema,
            temperature: 0.2,
        }
    };

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // If we get a 503 (Overloaded), throw error to trigger retry
            if (response.status === 503) {
                throw new Error("503 Service Unavailable");
            }

            // Handle other non-fatal errors (e.g., 400, 404)
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error Details:", errorText);
                // Don't retry on client errors, just throw
                throw new Error(`API Fatal Error: ${response.status} ${response.statusText}`);
            }

            // If response is OK, parse it
            const result = await response.json();
            const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!jsonText) {
                throw new Error("Invalid response structure from API.");
            }

            return JSON.parse(jsonText) as GradeResult; // Success!

        } catch (error: any) {
            attempt++;
            console.warn(`Grading attempt ${attempt} failed: ${error.message}`);

            // If it was a 503 and we have retries left, wait and try again
            if (error.message.includes("503") && attempt < maxRetries) {
                // Wait 1 second, then 2 seconds (Exponential backoff)
                const delay = 1000 * Math.pow(2, attempt - 1);
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                // If it wasn't a 503, or we ran out of retries, return failure
                return {
                    pass: false,
                    feedback: `Error: The grading AI is currently overloaded (${error.message}). Please try again later.`
                };
            }
        }
    }

    return {
        pass: false,
        feedback: "Error: The grading agent failed after multiple retries."
    };
}