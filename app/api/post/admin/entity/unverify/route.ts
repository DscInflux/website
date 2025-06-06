import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

export async function POST(req: NextRequest) {
	const session = await auth();
	if (!session || !session.user?.is_admin) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Zod schema for request body
	const schema = z.object({ entityId: z.string().min(1) });
	let entityId: string | undefined;
	try {
		const body = await req.json();
		const parsed = schema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
		}
		entityId = parsed.data.entityId;
	} catch (e) {
		return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
	}

	if (!entityId) {
		return NextResponse.json({ error: 'Missing entityId' }, { status: 400 });
	}

	try {
		const updated = await prisma.entity.update({
			where: { id: entityId },
			data: { isVerified: false }
		});
		return NextResponse.json({ success: true, entity: updated });
	} catch (e: any) {
		return NextResponse.json({ error: e.message || 'Failed to unverify entity' }, { status: 500 });
	}
}
