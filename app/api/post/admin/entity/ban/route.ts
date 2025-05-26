// @ts-ignore
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/app/api/auth/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Check if user is admin
  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { is_admin: true },
  });
  if (!adminUser?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { username } = body;
  if (!username || typeof username !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid username" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findFirst({ where: { username } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Suspend (ban) the user
  await prisma.user.update({
    where: { id: user.id },
    data: { is_banned: true },
  });

  return NextResponse.json({
    success: true,
    message: `User ${username} has been suspended.`,
  });
}
