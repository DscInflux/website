import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const querySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  sort: z.enum(['newest', 'oldest', 'popular']).optional(),
  roles: z.string().optional(),
  skills: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parseResult = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));

  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
  }

  const { page, sort, roles, skills } = parseResult.data;

  const filters: any = {
    deletedAt: null,
  };

  if (roles) {
    filters.roles = {
      hasSome: roles.split(','),
    };
  }

  if (skills) {
    filters.skills = {
      hasSome: skills.split(','),
    };
  }

  const take = 20;
  const skip = (page - 1) * take;

  const orderBy = (() => {
    switch (sort) {
      case 'oldest':
        return { createdAt: 'asc' };
      case 'popular':
        return { like: 'desc' };
      case 'newest':
      default:
        return { createdAt: 'desc' };
    }
  })();

  const [entities, total] = await Promise.all([
    prisma.entity.findMany({
      where: filters,
      skip,
      take,
      orderBy,
    }),
    prisma.entity.count({
      where: filters,
    }),
  ]);

  return NextResponse.json({
    data: entities,
    pagination: {
      page,
      total,
      totalPages: Math.ceil(total / take),
    },
  });
}
