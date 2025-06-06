import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const querySchema = z.object({
	page: z.coerce.number().min(1).optional().default(1),
	limit: z.coerce.number().min(1).max(100).optional().default(20),
	sort: z.enum(['newest', 'oldest', 'popular', 'random']).optional(),
	roles: z.string().optional(),
	skills: z.string().optional(),
	isVerified: z.coerce.boolean().optional(),
	isPremium: z.coerce.boolean().optional(),
	isPartner: z.coerce.boolean().optional(),
	isDeveloper: z.coerce.boolean().optional(),
	staff: z.coerce.boolean().optional(),
	search: z.string().optional(),
	location: z.string().optional(),
	gender: z.string().optional(),
	language: z.string().optional()
});

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const parseResult = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));

	if (!parseResult.success) {
		return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
	}

	const {
		page,
		limit,
		sort,
		roles,
		skills,
		isVerified,
		isPremium,
		isPartner,
		isDeveloper,
		staff,
		search,
		location,
		gender,
		language
	} = parseResult.data;

	const filters: any = {};

	if (roles) filters.roles = { hasSome: roles.split(',') };
	if (skills) filters.skills = { hasSome: skills.split(',') };
	if (typeof isVerified === 'boolean') filters.isVerified = isVerified;
	if (typeof isPremium === 'boolean') filters.isPremium = isPremium;
	if (typeof isPartner === 'boolean') filters.isPartner = isPartner;
	if (typeof isDeveloper === 'boolean') filters.isDeveloper = isDeveloper;
	if (typeof staff === 'boolean') filters.staff = staff;
	if (location) filters.location = { contains: location, mode: 'insensitive' };
	if (gender) filters.gender = { equals: gender };
	if (language) filters.language = { equals: language };
	if (search) {
		filters.OR = [
			{ Username: { contains: search, mode: 'insensitive' } },
			{ displayname: { contains: search, mode: 'insensitive' } },
			{ about: { contains: search, mode: 'insensitive' } },
			{ location: { contains: search, mode: 'insensitive' } },
			{ occupation: { has: search } },
			{ skills: { has: search } },
			{ roles: { has: search } }
		];
	}

	const take = limit;
	const skip = (page - 1) * take;

	let orderBy: any = { createdAt: 'desc' };
	if (sort === 'oldest') orderBy = { createdAt: 'asc' };
	if (sort === 'popular') orderBy = { likes: { _count: 'desc' } }; // Prisma doesn't support _count in orderBy directly, fallback below
	// We'll handle popular sort manually below

	if (sort === 'random') {
		// Random: get all IDs, shuffle, slice, then fetch entities & users

		const allIds = await prisma.entity.findMany({
			select: { id: true },
			where: filters
		});

		const shuffled = allIds.map(e => e.id).sort(() => Math.random() - 0.5).slice(0, take);

		const entities = await prisma.entity.findMany({
			where: { id: { in: shuffled } }
		});

		const userIds = entities.map(e => e.userId);
		const users = await prisma.user.findMany({
			where: { id: { in: userIds } },
			select: { id: true, presence: true }
		});

		// Merge presence into entities
		const userPresenceMap = new Map(users.map(u => [u.id, u.presence]));
		const enrichedEntities = entities.map(e => ({
			...e,
			presence: userPresenceMap.get(e.userId) ?? null
		}));

		return NextResponse.json({
			data: enrichedEntities,
			pagination: {
				page,
				total: allIds.length,
				totalPages: Math.ceil(allIds.length / take)
			}
		});
	}

	// For popular sorting fallback: sort entities by likes array length descending in JS
	if (sort === 'popular') {
		const [entities, total] = await Promise.all([
			prisma.entity.findMany({
				where: filters,
				skip,
				take
			}),
			prisma.entity.count({ where: filters })
		]);

		const userIds = entities.map(e => e.userId);
		const users = await prisma.user.findMany({
			where: { id: { in: userIds } },
			select: { id: true, presence: true }
		});
		const userPresenceMap = new Map(users.map(u => [u.id, u.presence]));

		// Sort entities by likes length desc
		entities.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0));

		const enrichedEntities = entities.map(e => ({
			...e,
			presence: userPresenceMap.get(e.userId) ?? null
		}));

		return NextResponse.json({
			data: enrichedEntities,
			pagination: {
				page,
				total,
				totalPages: Math.ceil(total / take)
			}
		});
	}

	// Default case: newest/oldest sorting with Prisma
	const [entities, total] = await Promise.all([
		prisma.entity.findMany({
			where: filters,
			skip,
			take,
			orderBy
		}),
		prisma.entity.count({ where: filters })
	]);

	const userIds = entities.map(e => e.userId);
	const users = await prisma.user.findMany({
		where: { discordId: { in: userIds } },
		select: { id: true, presence: true }
	});
	const userPresenceMap = new Map(users.map(u => [u.id, u.presence]));

	const enrichedEntities = entities.map(e => ({
		...e,
		presence: userPresenceMap.get(e.userId) ?? null
	}));

	return NextResponse.json({
		data: enrichedEntities,
		pagination: {
			page,
			total,
			totalPages: Math.ceil(total / take)
		}
	});
}
