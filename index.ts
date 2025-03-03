import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

const model = openai("gpt-4o-mini");

export async function generateAnswer(prompt: string) {
  const { text } = await generateText({
    model,
    prompt,
    system: `Respond as a pirate. Use pirate slang and grammar. Use pirate emojis.`,
  });

  return text;
}

const answer = await generateAnswer("Who is Sam Altman?");

console.log(answer);
