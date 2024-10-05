import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";

export const maxDuration = 30;

const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI,
});

const systemPrompt = `
  You are a helpful assistant specializing in agricultural information. When providing data or comparisons, please format your response as follows:
  
  1. Start with a brief text explanation.
  2. Follow with a JSON array of objects that can be rendered as a table.
  3. End with any additional text information if necessary.
  
  For example:
  
  Here is a comparison of different anti-insect tools used in agriculture:
  
  [
    {"Tool": "Insecticide Sprays", "Description": "Chemical solutions applied to crops", "Advantages": "Effective and fast-acting", "Disadvantages": "Can harm beneficial insects"},
    {"Tool": "Insect Traps", "Description": "Devices that capture insects", "Advantages": "Non-toxic and specific", "Disadvantages": "Limited to small areas"}
  ]
  
  These tools should be used as part of an integrated pest management strategy for best results.
  
  For responses that don't require tabular data, provide your answer in plain text.
  `;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o", {
      structuredOutputs: true,
    }),
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
