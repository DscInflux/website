import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "../[...nextauth]/route";
import type { NextAuthOptions } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions as NextAuthOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Fetch user and their entity (if any)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const entity = await prisma.entity.findFirst({
      where: { discordId: session.user.id },
    });
    return NextResponse.json({ user, entity });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
