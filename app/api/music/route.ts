import { NextResponse } from "next/server";
import Replicate from "replicate";
import { auth } from "@clerk/nextjs/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

type RiffusionResponse = {
  audio: ReadableStream;
  spectrogram?: ReadableStream;
};

export async function POST(req: Request) {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const { prompt } = body;
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
        return new NextResponse("Free trial has expired.", { status: 403 });
    }

    // Input for Replicate API
    const input = { prompt_b: prompt };

    // Call the Replicate API
    const response = (await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      { input }
    )) as RiffusionResponse;

   
    // Process the ReadableStream into Base64
    const reader = response.audio.getReader();
    const chunks: Uint8Array[] = [];
    try {
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (value) chunks.push(value);
        done = readerDone;
      }
    } catch (error) {
      console.error("Error reading audio stream:", error);
      return new NextResponse("Failed to process audio stream", { status: 500 });
    }

    // Convert chunks into a Base64-encoded string
    const audioBase64 = Buffer.concat(chunks).toString("base64");
    if (!isPro) {
      await increaseApiLimit();
  }

    // Return the Base64 data URI
    return NextResponse.json({ audio: `data:audio/mpeg;base64,${audioBase64}` });
  } catch (error) {
    console.error("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
