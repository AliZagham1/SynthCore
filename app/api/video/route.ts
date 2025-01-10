import { NextResponse } from "next/server";
import Replicate from "replicate";
import { auth } from "@clerk/nextjs/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
 
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
        return new NextResponse("Free trial has expired.", { status: 403 });
    }
    const input = {
      fps: 24,
      width: 1024,
      height: 576,
      prompt,
      guidance_scale: 17.5,
      negative_prompt: "very blue, dust, noisy, washed out, ugly, distorted, broken"
  };
  const output = await replicate.run(
    "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
    { input }
  );
    // Directory to save videos
    const videosDir = path.join(process.cwd(), "public", "videos");
    await mkdir(videosDir, { recursive: true }); // Ensure directory exists

    // Save the output to files and collect relative URLs
    const fileUrls = [];
    for (const [index, item] of Object.entries(output)) {
      const filePath = path.join(videosDir, `output_${index}.mp4`);

      if (typeof item === "string") {
        // If it's a URL, fetch the binary data
        const response = await fetch(item);
        const data = await response.arrayBuffer();
        await writeFile(filePath, Buffer.from(data));
      } else {
        // If it's binary data, write directly
        await writeFile(filePath, item);
      }

      // Collect relative URL for frontend
      fileUrls.push(`/videos/output_${index}.mp4`);
    }

    console.log("Files saved to disk:", fileUrls);

    if (!isPro) {
      await increaseApiLimit();
  }


    // Return relative file URLs to the frontend
    return NextResponse.json({ files: fileUrls });
  } catch (error) {
    console.error("[VIDEO_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
