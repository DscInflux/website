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
	// Only filter by location/gender if they're not private (this could be enhanced further)
	if (location) filters.location = { contains: location, mode: 'insensitive' };
	if (gender) filters.gender = { equals: gender };
	if (language) filters.language = { equals: language };
	if (search) {
		filters.OR = [
			{ Username: { contains: search, mode: 'insensitive' } },
			{ displayname: { contains: search, mode: 'insensitive' } },
			{ about: { contains: search, mode: 'insensitive' } },
			{ occupation: { has: search } },
			{ skills: { has: search } },
			{ roles: { has: search } }
		];
	}

	// Function to redact private data based on privacy settings
	const redactPrivateData = (entity: any) => {
		return {
			...entity,
			// Always include privacy flags
			isEmailPrivate: entity.isEmailPrivate,
			isBirthdayPrivate: entity.isBirthdayPrivate,
			isLocationPrivate: entity.isLocationPrivate,
			isGenderPrivate: entity.isGenderPrivate,
			isPronounsPrivate: entity.isPronounsPrivate,
			isSexualityPrivate: entity.isSexualityPrivate,
			isHeightPrivate: entity.isHeightPrivate,

			// Redact private data based on privacy settings
			email: entity.isEmailPrivate ? null : entity.email,
			birthday: entity.isBirthdayPrivate ? null : entity.birthday,
			location: entity.isLocationPrivate ? null : entity.location,
			gender: entity.isGenderPrivate ? null : entity.gender,
			pronouns: entity.isPronounsPrivate ? null : entity.pronouns,
			sexuality: entity.isSexualityPrivate ? null : entity.sexuality,
			height: entity.isHeightPrivate ? null : entity.height,
			timeZone: entity.timeZone,
			status: entity.status,
			website: entity.website,
			language: entity.language,
			isShow: entity.isShow
		};
	};

	// Complete select object with all fields including privacy flags
	const selectFields = {
		id: true,
		userId: true,
		Username: true,
		displayname: true,
		url: true,
		banner: true,
		avatar: true,
		about: true,
		occupation: true,
		staff: true,
		birthday: true,
		location: true,
		gender: true,
		pronouns: true,
		language: true,
		website: true,
		isDeveloper: true,
		isPartner: true,
		email: true,
		isVerified: true,
		isShow: true,
		// Privacy flags
		isEmailPrivate: true,
		isBirthdayPrivate: true,
		isLocationPrivate: true,
		isGenderPrivate: true,
		isPronounsPrivate: true,
		isSexualityPrivate: true,
		isHeightPrivate: true,
		roles: true,
		likes: true,
		skills: true,
		socials: true,
		createdAt: true,
		updatedAt: true,
		sexuality: true,
		timeZone: true,
		height: true,
		status: true,
		views: true
	};

	const take = limit;
	const skip = (page - 1) * take;

	let orderBy: any = { createdAt: 'desc' };
	if (sort === 'oldest') orderBy = { createdAt: 'asc' };

	if (sort === 'random') {
		const allIds = await prisma.entity.findMany({
			select: { id: true },
			where: filters
		});

		const shuffled = allIds
			.map((e) => e.id)
			.sort(() => Math.random() - 0.5)
			.slice(0, take);

		const entities = await prisma.entity.findMany({
			where: { id: { in: shuffled } },
			select: selectFields
		});

		const userIds = entities.map((e) => e.userId);
		const users = await prisma.user.findMany({
			where: { discordId: { in: userIds } },
			select: { discordId: true, presence: true, is_banned: true }
		});

		const userPresenceMap = new Map(
			users.map((u) => [u.discordId, { presence: u.presence, isBanned: u.is_banned }])
		);
		const enrichedEntities = entities.map((e) => ({
			...redactPrivateData(e),
			presence: userPresenceMap.get(e.userId)?.presence ?? null,
			isBanned: userPresenceMap.get(e.userId)?.isBanned ?? false
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

	if (sort === 'popular') {
		const [entities, total] = await Promise.all([
			prisma.entity.findMany({
				where: filters,
				skip,
				take,
				select: selectFields
			}),
			prisma.entity.count({ where: filters })
		]);

		const userIds = entities.map((e) => e.userId);
		const users = await prisma.user.findMany({
			where: { discordId: { in: userIds } },
			select: { discordId: true, presence: true, is_banned: true }
		});
		const userPresenceMap = new Map(
			users.map((u) => [u.discordId, { presence: u.presence, isBanned: u.is_banned }])
		);

		entities.sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0));

		const enrichedEntities = entities.map((e) => ({
			...redactPrivateData(e),
			presence: userPresenceMap.get(e.userId)?.presence ?? null,
			isBanned: userPresenceMap.get(e.userId)?.isBanned ?? false
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

	const [entities, total] = await Promise.all([
		prisma.entity.findMany({
			where: filters,
			skip,
			take,
			orderBy,
			select: selectFields
		}),
		prisma.entity.count({ where: filters })
	]);

	const userIds = entities.map((e) => e.userId);
	const users = await prisma.user.findMany({
		where: { discordId: { in: userIds } },
		select: { discordId: true, presence: true, is_banned: true }
	});
	const userPresenceMap = new Map(
		users.map((u) => [u.discordId, { presence: u.presence, isBanned: u.is_banned }])
	);

	const enrichedEntities = entities.map((e) => ({
		...redactPrivateData(e),
		presence: userPresenceMap.get(e.userId)?.presence ?? null,
		isBanned: userPresenceMap.get(e.userId)?.isBanned ?? false
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
