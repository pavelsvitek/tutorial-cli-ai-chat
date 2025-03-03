#!/usr/bin/env node

import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";
import { Command } from "commander";
import * as readline from 'readline';

const model = openai("gpt-4o-mini");

export async function generateAnswer(prompt: string, history: CoreMessage[]) {
  const { text } = await generateText({
    model,
    messages: [...history, {
      role: "user",
      content: prompt
    }],
    system: `Respond as a pirate. Use pirate slang and grammar. Use pirate emojis.`,
  });

  return text;
}

async function startInteractiveChat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Interactive chat started. Type your messages and press Enter. Type \'exit\' to quit.');

  const messageHistory: CoreMessage[] = [];
  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      try {
        const response = await generateAnswer(input, messageHistory);
        messageHistory.push({ role: "user", content: input });
        messageHistory.push({ role: "assistant", content: response });

        console.log('AI: ' + response + '\n');
        askQuestion();
      } catch (error) {
        console.error('Error:', String(error));
        askQuestion();
      }
    });
  };

  askQuestion();

  rl.on('close', () => {
    console.log('\nGoodbye!');
    process.exit(0);
  });
}

const program = new Command();

program
  .name('ai-chat')
  .description('CLI tool for chatting with AI')
  .version('1.0.0');

program
  .command('ask')
  .description('Ask a question')
  .argument('<prompt>', 'The prompt to send to AI')
  .action(async (prompt: string) => {
    try {
      const response = await generateAnswer(prompt, []);
      console.log(response);
    } catch (error) {
      console.error('Error:', String(error));
      process.exit(1);
    }
  });

program
  .command('chat')
  .description('Start an interactive chat session with AI')
  .action(startInteractiveChat);

program.parse();
