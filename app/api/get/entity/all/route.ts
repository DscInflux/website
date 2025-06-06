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

  // Handle random sort separately
  if (sort === 'random') {
    // Fetch all entity IDs with filters
    const allEntities = await prisma.entity.findMany({
      where,
      select: { id: true },
    });
    const shuffledIds = allEntities
      .map((e) => e.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, take);

    // Fetch entities by shuffled IDs
    const entities = await prisma.entity.findMany({
      where: { id: { in: shuffledIds } },
    });

    // Fetch users to get presence and isBanned
    const userIds = [...new Set(entities.map((e) => e.userId))];
    const users = await prisma.user.findMany({
      where: { discordId: { in: userIds } },
      select: { discordId: true, presence: true, is_banned: true },
    });
    const userMap = new Map(users.map((u) => [u.discordId, { presence: u.presence, isBanned: u.is_banned }]));

    // Merge presence and isBanned into entities
    const data = entities.map((e) => ({
      ...e,
      presence: userMap.get(e.userId)?.presence,
      isBanned: userMap.get(e.userId)?.isBanned ?? false,
    }));

    const total = allEntities.length;
    const totalPages = Math.ceil(total / take);

    return NextResponse.json({ data, pagination: { page, total, totalPages } });
  }

  // For other sorts: fetch normally with pagination
  const [entities, total] = await Promise.all([
    prisma.entity.findMany({
      where,
      skip,
      take,
      orderBy,
    }),
    prisma.entity.count({ where }),
  ]);

  const userIds = [...new Set(entities.map((e) => e.userId))];
  const users = await prisma.user.findMany({
    where: { discordId: { in: userIds } },
    select: { discordId: true, presence: true, is_banned: true },
  });

  const userMap = new Map(users.map((u) => [u.discordId, { presence: u.presence, isBanned: u.is_banned }]));

  // Merge presence and isBanned into entities
  const data = entities.map((e) => ({
    ...e,
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
