import OpenAI from "openai";

const client = new OpenAI();

process.stdin.addListener("data", async function name(input) {
  const userInput = input.toString().trim();
  const response = await client.responses.create({
    model: "gpt-5.4",
    input: [
      {
        role: "system",
        content: "You are a crazt chatbot assitant",
      },
      {
          role: "user",
          content: userInput
      },
    ],
  });
    console.log(response.output_text);

});

