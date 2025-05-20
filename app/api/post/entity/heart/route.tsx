import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const url = searchParams.get("url");

  if (!action || !["like", "unlike"].includes(action) || !url) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const entity = await prisma.entity.findFirst({ where: { url } });
  if (!entity) {
    return NextResponse.json({ error: "Entity not found" }, { status: 404 });
  }

  let updatedLikes: string[] = Array.isArray(entity.like) ? [...entity.like] : [];
  const userId = session.user.id;

  if (action === "like") {
    if (!updatedLikes.includes(userId)) {
      updatedLikes.push(userId);
    }
  } else if (action === "unlike") {
    updatedLikes = updatedLikes.filter((id) => id !== userId);
  }

  await prisma.entity.update({
    where: { id: entity.id },
    data: { like: updatedLikes },
  });

  return NextResponse.json({ success: true, action, likes: updatedLikes.length });
}
