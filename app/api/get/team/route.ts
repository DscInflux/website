import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
	try {
		const staff = await prisma.user.findMany({
			where: { is_admin: true },
			select: {
				id: true,
				username: true,
				display_name: true,
				avatar: true
			}
		});
		return NextResponse.json({ staff });
	} catch (error) {
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
