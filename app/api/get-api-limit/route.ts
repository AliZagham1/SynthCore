import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const { userId } =await  auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: { id: userId },
    });

    const count = userApiLimit?.count || 0;
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
