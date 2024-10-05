"use server";

import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI,
});

export async function getRecommendations({
  soilType,
  cropType,
  fieldArea,
  rootDepth,
  weatherData,
}: {
  soilType: string;
  cropType: string;
  fieldArea: number;
  rootDepth?: number;
  weatherData?: {
    temperature?: number;
    humidity?: number;
    precipitation?: number;
  };
}) {
  "use server";

  const { object: recommendations } = await generateObject({
    model: openai("gpt-4-turbo"),
    system:
      "You are an expert agricultural assistant who provides detailed recommendations for irrigation and crop care based on provided water-resources. Provide it in russian language",
    prompt: `
Provide detailed recommendations based on the following data:

Soil Type: ${soilType}
Crop Type: ${cropType}
Field Area: ${fieldArea} hectares
Root Depth: ${rootDepth ? rootDepth + " cm" : "Not provided"}
${
  weatherData
    ? `
Temperature: ${
        weatherData.temperature
          ? weatherData.temperature + " °C"
          : "Not provided"
      }
Humidity: ${weatherData.humidity ? weatherData.humidity + " %" : "Not provided"}
Precipitation: ${
        weatherData.precipitation
          ? weatherData.precipitation + " mm"
          : "Not provided"
      }
`
    : ""
}

Provide the following information:
- The required water volume for irrigation.
- The optimal irrigation schedule.
- Any considerations based on the current weather conditions.
- Additional tips for irrigation and crop care.
`,
    schema: z.object({
      waterVolume: z.string(),
      irrigationSchedule: z.string(),
      weatherNote: z.string().optional(),
      tips: z.array(z.string()),
    }),
  });

  console.log(recommendations);

  return { recommendations };
}
