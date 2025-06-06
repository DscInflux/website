import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const querySchema = z.object({
	page: z.coerce.number().min(1).optional().default(1),
	sort: z.enum(['newest', 'oldest', 'popular', 'random']).optional(),
	roles: z.string().optional(),
	skills: z.string().optional(),
	limit: z.coerce.number().min(1).max(100).optional()
});

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const parseResult = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));

	if (!parseResult.success) {
		return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
	}

	const { page, sort, roles, skills, limit } = parseResult.data;

	const filters: any = {};

	if (roles) {
		filters.roles = {
			hasSome: roles.split(',')
		};
	}

	if (skills) {
		filters.skills = {
			hasSome: skills.split(',')
		};
	}

	const take = limit || 20;
	const skip = (page - 1) * take;

	if (sort === 'random') {
		// Build WHERE clause for filters (only roles and skills supported for random)
		let whereClause = '';
		const whereParams: any[] = [];
		if (filters.roles) {
			whereClause += whereClause ? ' AND ' : ' WHERE ';
			whereClause += `roles && $1`;
			whereParams.push(filters.roles.hasSome);
		}
		if (filters.skills) {
			whereClause += whereClause ? ' AND ' : ' WHERE ';
			whereClause += `skills && $${whereParams.length + 1}`;
			whereParams.push(filters.skills.hasSome);
		}
		// Compose the query
		const query = `SELECT "isShow", "userId", "Username", "displayname", "url", "about", "isVerified", "isDeveloper", "isPartner", "staff", "avatar", "createdAt", "id", "likes" FROM "entity"${whereClause} ORDER BY RANDOM() OFFSET $${
			whereParams.length + 1
		} LIMIT $${whereParams.length + 2}`;
		const entities = await prisma.$queryRawUnsafe(query, ...whereParams, skip, take);
		const total = await prisma.entity.count({ where: filters });
		return NextResponse.json({
			data: entities,
			pagination: {
				page,
				total,
				totalPages: Math.ceil(total / take)
			}
		});
	}

	const orderBy = (() => {
		switch (sort) {
			case 'oldest':
				return { createdAt: 'asc' as const };
			case 'popular':
				return { likes: 'desc' as const };
			case 'newest':
			default:
				return { createdAt: 'desc' as const };
		}
	})();

	const [entities, total] = await Promise.all([
		prisma.entity.findMany({
			where: filters,
			skip,
			take,
			orderBy,
			select: {
				isShow: true,
				userId: true,
				Username: true,
				displayname: true,
				url: true,
				about: true,
				isVerified: true,
				isDeveloper: true,
				isPartner: true,
				staff: true,
				avatar: true,
				createdAt: true,
				id: true,
				likes: true
			}
		}),
		prisma.entity.count({
			where: filters
		})
	]);

	return NextResponse.json({
		data: entities,
		pagination: {
			page,
			total,
			totalPages: Math.ceil(total / take)
		}
	});
}
