import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

const entitySchema = z.object({
  url: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9-_]+$/),
  about: z.string().min(1),
  avatar: z.string().optional(),
  banner: z.string().optional(),
  occupation: z.array(z.string()).optional(),
  staff: z.boolean().optional(),
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
  const session = await getServerSession();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parseResult = entitySchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.flatten() },
      { status: 400 },
    );
  }
  const data = parseResult.data;

  const existingUrl = await prisma.entity.findFirst({
    where: { url: data.url },
  });
  if (existingUrl && existingUrl.discordId !== session.user.id) {
    return NextResponse.json({ error: "URL already taken" }, { status: 400 });
  }

  const existingEntity = await prisma.entity.findFirst({
    where: { discordId: session.user.id },
  });
  const now = new Date();
  const requiredString = (val: string | undefined, fallback: string) =>
    val ?? fallback;

  const entityData = {
    url: requiredString(data.url, ""),
    about: requiredString(data.about, ""),
    avatar: requiredString(data.avatar, session.user.avatar || ""),
    banner: requiredString(
      data.banner,
      "https://cdn.dscinflux.xyz/assets/jpg/influxbanner.jpg",
    ),
    occupation: data.occupation ?? [],
    staff: data.staff ?? false,
    birthday: data.birthday ? new Date(data.birthday) : undefined,
    location: requiredString(data.location, ""),
    gender: requiredString(data.gender, ""),
    pronouns: requiredString(data.pronouns, ""),
    language: requiredString(data.language, ""),
    website: data.website ?? undefined,
    roles: data.roles ?? [],
    skills: data.skills ?? [],
    socials: normalizeSocials(data.socials),
    discordUsername: session.user.username,
    discordDisplayName: session.user.display_name,
    discordId: session.user.id,
    isDeveloper: false,
    isPartner: false,
    isVerified: false,
    like: [],
    views: [],
    likes: [],
    createdAt: existingEntity ? existingEntity.createdAt : now,
    updatedAt: now,
    isShow: data.privacy?.isShow ?? true,
    isEmailPrivate: data.privacy?.isEmailPrivate ?? true,
    isBirthdayPrivate: data.privacy?.isBirthdayPrivate ?? true,
    isLocationPrivate: data.privacy?.isLocationPrivate ?? true,
    isGenderPrivate: data.privacy?.isGenderPrivate ?? true,
    isPronounsPrivate: data.privacy?.isPronounsPrivate ?? true,
  };

  let entity;
  if (existingEntity) {
    entity = await prisma.entity.update({
      where: { id: existingEntity.id },
      data: entityData,
    });
  } else {
    entity = await prisma.entity.create({
      data: entityData,
    });
  }

  return NextResponse.json({ entity });
}
