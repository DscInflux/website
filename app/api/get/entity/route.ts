import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const querySchema = z.object({
  id: z.string().uuid(),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parseResult = querySchema.safeParse(
    Object.fromEntries(url.searchParams.entries())
  );

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  const { id } = parseResult.data;

  try {
    const entity = await prisma.entity.findUnique({
      where: { id },
    });

    if (!entity) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
    }

    return NextResponse.json(entity);
  } catch (error) {
    console.error('[GET_ENTITY_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}