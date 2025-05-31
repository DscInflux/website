import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id || !session.user.is_admin) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { entityId, verified } = body;
  if (!entityId || typeof verified !== "boolean") {
    return NextResponse.json({ error: "Missing entityId or verified" }, { status: 400 });
  }

  try {
    const entity = await prisma.entity.update({
      where: { id: entityId },
      data: { isVerified: verified },
    });
    return NextResponse.json({ entity });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update entity verification" }, { status: 500 });
  }
}
