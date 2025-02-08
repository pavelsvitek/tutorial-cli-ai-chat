import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";
import { Command } from "commander";
import inquirer from "inquirer";

const program = new Command();

async function answerQuestion(messages: CoreMessage[]) {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: "You are a helpful assistant.",
    messages,
  });

  return text;
}

program.version("1.0.0").description("AI Chat CLI");

program
  .command("chat")
  .description("Start a chat with the AI")
  .action(async () => {
    console.log('Welcome to AI Chat! Type "exit" to quit.');

    while (true) {
      const messages: CoreMessage[] = [];
      const { userInput } = await inquirer.prompt([
        {
          type: "input",
          name: "userInput",
          message: "You:",
        },
      ]);

      if (userInput.toLowerCase() === "exit") {
        console.log("Goodbye!");
        process.exit(0);
      }

      messages.push({ role: "user", content: userInput });
      const aiResponse = await answerQuestion(messages);
      messages.push({ role: "assistant", content: aiResponse });
      console.log("AI:", aiResponse);
    }
  });

program.parse(process.argv);
