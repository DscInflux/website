import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// share a fresh terminal with me.
// i am with the microsoft sir fuck you sir
// sir, share write access to this terminal sir
// this not scam
// you pay 15 million for repair sir
// we accept credit card, cash, debit
// give write access look how the tables have tunred  bitch
// my battery is at 2
// hurry tf up
// idgaf get on pc

// DO NOT REDEEM GIFT CARD
// SIR, STOP MAKING CHANGES
// the ping is too high, i send command to you sir.
const querySchema = z.object({
  name: z.string(),
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
 
  const { name } = parseResult.data; 

  try {
    const entity = await prisma.entity.findFirst({
      where: { url: name },
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
