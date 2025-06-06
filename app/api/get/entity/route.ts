import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const querySchema = z.object({
	name: z.string().optional(),
	userId: z.string().optional()
});

export async function GET(req: NextRequest) {
	const parsedUrl = new URL(req.url);
	const parseResult = querySchema.safeParse(Object.fromEntries(parsedUrl.searchParams.entries()));

	if (!parseResult.success) {
		return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
	}

	const { name, userId } = parseResult.data;

	try {
		const orConditions = [{ url: name }] as any[];
		if (userId) {
			orConditions.push({ userId });
		}

		const entity = await prisma.entity.findFirst({
			where: {
				OR: orConditions
			}
		});

		if (!entity) {
			return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
		}

		// Get the user to check if banned
		let isBanned = false;
		if (entity.userId) {
			const user = await prisma.user.findUnique({
				where: { id: entity.userId }
			});
			isBanned = user?.is_banned ?? false;
		}

		return NextResponse.json({ ...entity, isBanned });
	} catch (error) {
		console.error('[GET_ENTITY_ERROR]', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
