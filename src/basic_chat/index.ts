import OpenAI from "openai";

const client = new OpenAI();

type RoleProps = {
  role: "user" | "assistant" | "system";
  content: string;
}

const context: RoleProps [] = [
  {
    role: "system",
    content: "You are a crazy chatbot assistant",
  },
];  

async function createChatCompletion() {
  const response = await client.responses.create({
    model: "gpt-5.4",
    input: context,
  });
  const responseMessage = response.output_text;
  context.push({
    role: "assistant",
    content: responseMessage,
  });
  console.log(`Assistant: ${response.output_text}`);
}

process.stdin.addListener("data", async function name(input) {
  const userInput = input.toString().trim();
  context.push({
    role: "user",
    content: userInput,
  });
  createChatCompletion();
});
