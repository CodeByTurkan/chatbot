import OpenAI from "openai";
import { encoding_for_model } from "tiktoken";

const client = new OpenAI();
const encoder = encoding_for_model('gpt-4.1-mini')
  
type RoleProps = {
  role: "user" | "assistant" | "system";
  content: string;
}
const MAX_TOKENS = 700;

const context: RoleProps [] = [
  {
    role: "system",
    content: "You are a crazy chatbot assistant",
  },
];  

async function createChatCompletion() {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: context,
  });
  const responseMessage = response.output_text;
  context.push({
    role: "assistant",
    content: responseMessage,
  });
  if (response.usage && response.usage.total_tokens > MAX_TOKENS) {
    await deleteChatMessages();
  }
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

async function deleteChatMessages() {
  let contextLength = await getContextLength();
  while (contextLength > MAX_TOKENS) {
    let removed = false;
    for (let index = 1; index < context.length; index++) {
      const input = context[index];
      if (input.role !== "system") {
        context.splice(index, 1);
        contextLength = await getContextLength();
        console.log("New context length:" + contextLength);
        removed = true;
        break;
      }
    }
    if (!removed) break; 
  }
}

async function getContextLength() {
  let length = 0;
  context.forEach((input) => {
    if (typeof input.content == "string") {
      length += encoder.encode(input.content).length
    } else if (Array.isArray(input.content)) {
      input.content.forEach((inputContent) => {
        if (inputContent.type =="text") {
                length += encoder.encode(inputContent.content).length;

        }
      });
    }
  })
  return length
}