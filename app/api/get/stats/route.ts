import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
	try {
		const [entities, users, verifiedEntities] = await Promise.all([
			prisma.entity.count(),
			prisma.user.count(),
			prisma.entity.count({ where: { isVerified: true } })
		]);
		return NextResponse.json({
			stats: {
				entities,
				users,
				entitiesVerified: verifiedEntities
			}
		});
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
