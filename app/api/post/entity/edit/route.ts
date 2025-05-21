import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { z } from "zod";

const entityEditSchema = z.object({
  about: z.string().min(1).optional(),
  avatar: z.string().optional(),
  banner: z.string().optional(),
  occupation: z.array(z.string()).optional(),
  birthday: z.string().datetime().optional(),
  location: z.string().optional(),
  gender: z.string().optional(),
  pronouns: z.string().optional(),
  language: z.string().optional(),
  website: z.string().optional(),
  roles: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  socials: z.array(z.any()).optional(),
  privacy: z
    .object({
      isShow: z.boolean().optional(),
      isEmailPrivate: z.boolean().optional(),
      isBirthdayPrivate: z.boolean().optional(),
      isLocationPrivate: z.boolean().optional(),
      isGenderPrivate: z.boolean().optional(),
      isPronounsPrivate: z.boolean().optional(),
    })
    .optional(),
});

// Social options for normalization (must match frontend)
const SOCIAL_OPTIONS = [
  { name: "Github", url: "https://github.com/{username}" },
  { name: "Twitter/X", url: "https://x.com/{username}" },
  { name: "Facebook", url: "https://facebook.com/{username}" },
  { name: "Instagram", url: "https://instagram.com/{username}" },
  { name: "LinkedIn", url: "https://linkedin.com/in/{username}" },
  { name: "StackOverflow", url: "https://stackoverflow.com/users/{username}" },
  { name: "Reddit", url: "https://reddit.com/user/{username}" },
  { name: "YouTube", url: "https://youtube.com/channel/{username}" },
  { name: "Steam", url: "https://steamcommunity.com/{username}" },
  { name: "Twitch", url: "https://www.twitch.tv/{username}" },
  { name: "MyAnimeList", url: "https://myanimelist.net/profile/{username}" },
];

function normalizeSocials(socials: any[] = []) {
  return socials.map((social) => {
    const config = SOCIAL_OPTIONS.find((s) => s.name === social.name);
    if (config && social.username) {
      return {
        ...social,
        url: config.url.replace("{username}", social.username),
      };
    }
    return social;
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parseResult = entityEditSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.flatten() },
      { status: 400 },
    );
  }
  const data = parseResult.data;

  // Find the entity belonging to the user
  const entity = await prisma.entity.findFirst({
    where: { discordId: session.user.id },
  });
  if (!entity) {
    return NextResponse.json({ error: "Entity not found" }, { status: 404 });
  }

  // Prepare update data
  const updateData: any = { ...data };
  if (data.privacy) {
    updateData.isShow = data.privacy.isShow ?? entity.isShow;
    updateData.isEmailPrivate =
      data.privacy.isEmailPrivate ?? entity.isEmailPrivate;
    updateData.isBirthdayPrivate =
      data.privacy.isBirthdayPrivate ?? entity.isBirthdayPrivate;
    updateData.isLocationPrivate =
      data.privacy.isLocationPrivate ?? entity.isLocationPrivate;
    updateData.isGenderPrivate =
      data.privacy.isGenderPrivate ?? entity.isGenderPrivate;
    updateData.isPronounsPrivate =
      data.privacy.isPronounsPrivate ?? entity.isPronounsPrivate;
    delete updateData.privacy;
  }

  // Normalize socials
  if (data.socials) {
    updateData.socials = normalizeSocials(data.socials);
  } else {
    updateData.socials = entity.socials;
  }

  // Convert birthday to Date if present
  if (updateData.birthday) {
    updateData.birthday = new Date(updateData.birthday);
  }

  try {
    const updated = await prisma.entity.update({
      where: { id: entity.id },
      data: updateData,
    });
    return NextResponse.json({ entity: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update entity" },
      { status: 500 },
    );
  }
}
