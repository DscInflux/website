// @ts-ignore
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/auth';
import * as z from 'zod';
import { SOCIAL_PROVIDERS } from '@/components/Layout/user/SocialProvider';

const entityEditSchema = z.object({
	about: z.string().min(1).optional(),
	avatar: z.string().optional(),
	banner: z.string().optional(),
	occupation: z.array(z.string()).optional(),
	birthday: z.string().datetime().optional(),
	location: z.string().optional(),
	gender: z.string().optional(),
	pronouns: z.string().optional(),
	language: z.string().optional(),
	website: z.string().optional(),
	roles: z.array(z.string()).optional(),
	skills: z.array(z.string()).optional(),
	email: z.string().email().optional(),
	socials: z.array(z.any()).optional(),
	sexuality: z.string().optional(),
	timeZone: z.string().optional(),
	height: z.number().min(0).max(300).optional(),
	privacy: z
		.object({
			isShow: z.boolean().optional(),
			isEmailPrivate: z.boolean().optional(),
			isBirthdayPrivate: z.boolean().optional(),
			isLocationPrivate: z.boolean().optional(),
			isGenderPrivate: z.boolean().optional(),
			isPronounsPrivate: z.boolean().optional(),
			isSexualityPrivate: z.boolean().optional()
		})
		.optional()
});

function normalizeSocials(socials: any[] = []) {
	return socials.map((social) => {
		const config = SOCIAL_PROVIDERS.find((s) => s.name === social.name);
		if (config && social.username) {
			return {
				...social,
				url: config.url.replace('{username}', social.username)
			};
		}
		return social;
	});
}

export async function POST(req: NextRequest) {
	const session = await auth();
	if (!session || !session.user?.id) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	let body;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const parseResult = entityEditSchema.safeParse(body);
	if (!parseResult.success) {
		return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
	}
	const data = parseResult.data;

	// Find the entity belonging to the user
	const entity = await prisma.entity.findFirst({
		where: { userId: session.user.id }
	});
	if (!entity) {
		return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
	}

	// Prepare update data
	const updateData: any = { ...data };
	if (data.privacy) {
		updateData.isShow = data.privacy.isShow ?? entity.isShow;
		updateData.isEmailPrivate = data.privacy.isEmailPrivate ?? entity.isEmailPrivate;
		updateData.isBirthdayPrivate = data.privacy.isBirthdayPrivate ?? entity.isBirthdayPrivate;
		updateData.isLocationPrivate = data.privacy.isLocationPrivate ?? entity.isLocationPrivate;
		updateData.isGenderPrivate = data.privacy.isGenderPrivate ?? entity.isGenderPrivate;
		updateData.isPronounsPrivate = data.privacy.isPronounsPrivate ?? entity.isPronounsPrivate;
		updateData.isSexualityPrivate = data.privacy.isSexualityPrivate ?? entity.isSexualityPrivate;
		delete updateData.privacy;
	}

	// Normalize socials
	if (data.socials) {
		updateData.socials = normalizeSocials(data.socials);
	} else {
		updateData.socials = entity.socials;
	}

	updateData.timeZone = data.timeZone ?? entity.timeZone;
	updateData.height = data.height ?? entity.height;

	// Convert birthday to Date if present
	if (updateData.birthday) {
		updateData.birthday = new Date(updateData.birthday);
	}

	try {
		const updated = await prisma.entity.update({
			where: { id: entity.id },
			data: updateData
		});
		return NextResponse.json({ entity: updated });
	} catch (error) {
		return NextResponse.json({ error: 'Failed to update entity' }, { status: 500 });
	}
}
