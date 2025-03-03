#!/usr/bin/env node

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { Command } from "commander";

const model = openai("gpt-4o-mini");

export async function generateAnswer(prompt: string) {
  const { text } = await generateText({
    model,
    prompt,
    system: `Respond as a pirate. Use pirate slang and grammar. Use pirate emojis.`,
  });

  return text;
}

const program = new Command();

program
  .name('ai-chat')
  .description('CLI tool for chatting with AI using different personas')
  .version('1.0.0');

program
  .command('chat')
  .description('Start a chat with AI')
  .argument('<prompt>', 'The prompt to send to AI')
  .action(async (prompt: string) => {
    try {
      const response = await generateAnswer(prompt);
      console.log(response);
    } catch (error) {
      console.error('Error:', String(error));
      process.exit(1);
    }
  });

program.parse();
