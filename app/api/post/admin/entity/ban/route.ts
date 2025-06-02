// @ts-ignore
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/app/api/auth/authOptions";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id || !session.user.is_admin) {
    // If the user is not authenticated or not an admin, return 401 Unauthorized
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

  // Zod schema for request body
  const schema = z.object({ username: z.string().min(1) });
  let parsed;
  try {
    const body = await req.json();
    parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Missing or invalid username" },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { username } = parsed.data;

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
