import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";

const model = openai("gpt-4o-mini");
const systemPrompt = `Respond as a pirate.`;

export async function generateAnswer(prompt: string) {
  const messages: CoreMessage[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    // ..all previous messages
    {
      role: 'user',
      content: prompt,
    }
  ]

  const { text } = await generateText({ model, messages });
  return text;
}

const answer = await generateAnswer("Who is Sam Altman?");
console.log(answer);
