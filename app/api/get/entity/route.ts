import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const querySchema = z.object({
  name: z.string().optional(),
  userId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const parsedUrl = new URL(req.url);
  const parseResult = querySchema.safeParse(
    Object.fromEntries(parsedUrl.searchParams.entries())
  );

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  const { name, userId } = parseResult.data;

  try {
    // Build OR conditions for prisma query
    const orConditions = [{ url: name }] as any[];
    if (userId) {
      orConditions.push({ userId });
    }

    // Function to redact private data based on privacy settings
    const redactPrivateData = (entity: any) => {
      return {
        ...entity,
        // Always include privacy flags
        isEmailPrivate: entity.isEmailPrivate,
        isBirthdayPrivate: entity.isBirthdayPrivate,
        isLocationPrivate: entity.isLocationPrivate,
        isGenderPrivate: entity.isGenderPrivate,
        isPronounsPrivate: entity.isPronounsPrivate,
        isSexualityPrivate: entity.isSexualityPrivate,
        isHeightPrivate: entity.isHeightPrivate,
        
        // Redact private data based on privacy settings
        email: entity.isEmailPrivate ? null : entity.email,
        birthday: entity.isBirthdayPrivate ? null : entity.birthday,
        location: entity.isLocationPrivate ? null : entity.location,
        gender: entity.isGenderPrivate ? null : entity.gender,
        pronouns: entity.isPronounsPrivate ? null : entity.pronouns,
        sexuality: entity.isSexualityPrivate ? null : entity.sexuality,
        height: entity.isHeightPrivate ? null : entity.height,
        timeZone: entity.timeZone,
        status: entity.status,
        website: entity.website,
        language: entity.language,
        isShow: entity.isShow,
      };
    };

    const entity = await prisma.entity.findFirst({
      where: {
        OR: orConditions,
      },
      select: {
        id: true,
        userId: true,
        Username: true,
        displayname: true,
        url: true,
        banner: true,
        avatar: true,
        about: true,
        occupation: true,
        staff: true,
        birthday: true,
        location: true,
        gender: true,
        pronouns: true,
        language: true,
        website: true,
        isDeveloper: true,
        isPartner: true,
        email: true,
        isVerified: true,
        isShow: true,
        // Privacy flags
        isEmailPrivate: true,
        isBirthdayPrivate: true,
        isLocationPrivate: true,
        isGenderPrivate: true,
        isPronounsPrivate: true,
        isSexualityPrivate: true,
        isHeightPrivate: true,
        roles: true,
        likes: true,
        skills: true,
        socials: true,
        createdAt: true,
        updatedAt: true,
        sexuality: true,
        timeZone: true,
        height: true,
        status: true,
        views: true,
      },
    });

    if (!entity) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    let isBanned = false;
    let presence: string | undefined = undefined;

    if (entity.userId) {
      const user = await prisma.user.findUnique({
        where: { discordId: entity.userId },
        select: { is_banned: true, presence: true },
      });
      isBanned = user?.is_banned ?? false;
      presence = user?.presence;
    }

    // Apply privacy redaction and return enriched entity
    const enrichedEntity = {
      ...redactPrivateData(entity),
      isBanned,
      presence
    };

    return NextResponse.json(enrichedEntity);
  } catch (error) {
    console.error("[GET_ENTITY_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}