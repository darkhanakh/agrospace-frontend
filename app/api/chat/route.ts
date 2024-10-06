import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

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

If an image is provided, analyze it in the context of agriculture and farming. Describe what you see in the image, identify any plants, crops, pests, or farming equipment, and provide relevant agricultural insights or recommendations based on the image content.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, imageUrl } = body;

    let conversationMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    if (imageUrl) {
      conversationMessages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this image in the context of agriculture and farming.",
          },
          {
            type: "image",
            image: imageUrl,
            experimental_providerMetadata: {
              openai: { imageDetail: "low" },
            },
          },
        ],
      });
    }

    const result = await generateText({
      model: openai("gpt-4o"),
      messages: conversationMessages,
    });

    // Extract the relevant information from the result
    const response = {
      text: result.text,
      responseMessages: result.responseMessages,
      usage: result.usage,
    };

    // Return the response as a streaming response
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(JSON.stringify(response));
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
