import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// Optional: allow a query param for how many random entities to return, default 1, max 10
const querySchema = z.object({
  count: z.coerce.number().min(1).max(10).optional().default(1),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parseResult = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));

  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
  }

  const { count } = parseResult.data;

  // Get total count of entities
  const total = await prisma.entity.count({ where: { deletedAt: null } });
  if (total === 0) {
    return NextResponse.json({ data: [] });
  }

  // Get random offsets
  const randomOffsets = Array.from({ length: count }, () => Math.floor(Math.random() * total));

  // Fetch random entities (may have duplicates if count > 1 and total is small)
  const entities = await Promise.all(
    randomOffsets.map(offset =>
      prisma.entity.findFirst({
        where: { deletedAt: null },
        skip: offset,
      })
    )
  );

  // Remove nulls and duplicates
  const uniqueEntities = Array.from(
    new Map(
      entities.filter((e): e is NonNullable<typeof e> => !!e).map(e => [e.id, e])
    ).values()
  );

  return NextResponse.json({ data: uniqueEntities });
}
