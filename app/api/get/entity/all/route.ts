import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const querySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  sort: z.enum(['newest', 'oldest', 'popular', 'random']).optional().default('newest'),
  roles: z.string().optional(),
  skills: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parseResult = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));

  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
  }

  const { page, sort, roles, skills, limit } = parseResult.data;

  const take = limit;
  const skip = (page - 1) * take;

  // Build filters
  const where: any = {};
  if (roles) where.roles = { hasSome: roles.split(',') };
  if (skills) where.skills = { hasSome: skills.split(',') };

  // Prisma orderBy
  let orderBy: any = { createdAt: 'desc' }; // default newest
  if (sort === 'oldest') orderBy = { createdAt: 'asc' };
  else if (sort === 'popular') orderBy = { likes: { _count: 'desc' } };

  // Function to redact private data
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
      timeZone: entity.timeZone, // Add timezone if needed
      status: entity.status, // Add status if needed
    };
  };

  // Handle random sort separately
  if (sort === 'random') {
    const allEntities = await prisma.entity.findMany({
      where,
      select: { id: true },
    });
    const shuffledIds = allEntities
      .map((e: any) => e.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, take);

    const entities = await prisma.entity.findMany({
      where: { id: { in: shuffledIds } },
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

    const userIds = [...new Set(entities.map((e) => e.userId))];
    const users = await prisma.user.findMany({
      where: { discordId: { in: userIds } },
      select: { discordId: true, presence: true, is_banned: true },
    });

    const userMap = new Map(users.map((u) => [u.discordId, { presence: u.presence, isBanned: u.is_banned }]));

    const data = entities.map((e) => ({
      ...redactPrivateData(e),
      presence: userMap.get(e.userId)?.presence,
      isBanned: userMap.get(e.userId)?.isBanned ?? false,
    }));

    const total = allEntities.length;
    const totalPages = Math.ceil(total / take);

    return NextResponse.json({ data, pagination: { page, total, totalPages } });
  }

  const [entities, total] = await Promise.all([
    prisma.entity.findMany({
      where,
      skip,
      take,
      orderBy,
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
    }),
    prisma.entity.count({ where }),
  ]);

  const userIds = [...new Set(entities.map((e) => e.userId))];
  const users = await prisma.user.findMany({
    where: { discordId: { in: userIds } },
    select: { discordId: true, presence: true, is_banned: true },
  });

  const userMap = new Map(users.map((u) => [u.discordId, { presence: u.presence, isBanned: u.is_banned }]));

  const data = entities.map((e) => ({
    ...redactPrivateData(e),
    presence: userMap.get(e.userId)?.presence,
    isBanned: userMap.get(e.userId)?.isBanned ?? false,
  }));

  return NextResponse.json({
    data,
    pagination: {
      page,
      total,
      totalPages: Math.ceil(total / take),
    },
  });
}
