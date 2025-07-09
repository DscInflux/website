export interface Entity {
	isBanned: any;
	id: string;
	userId: string;
	Username: string;
	displayname: string;
	url: string;
	banner: string;
	avatar: string;
	about: string;
	occupation: string[];
	staff: boolean;
	birthday?: Date;
	location: string;
	gender: string;
	pronouns: string;
	language: string;
	website?: string;
	like: string[];
	isDeveloper: boolean;
	isPartner: boolean;
	email?: string;
	views: number;
	isVerified: boolean;
	timeZone?: string;
	sexuality?: string;
	height?: number;

	// Flattened Privacy fields
	isShow: boolean;
	isEmailPrivate: boolean;
	isBirthdayPrivate: boolean;
	isLocationPrivate: boolean;
	isGenderPrivate: boolean;
	isPronounsPrivate: boolean;
	isSexualityPrivate?: boolean;
	isHeightPrivate?: boolean;
	roles: string[];
	likes: string[];
	skills: string[];

	socials: Social[];

	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date;

	isTeamMember: boolean;
	presence: Presence;
	status: string;
}

enum Presence {
	Online,
	DND,
	Idle,
	Offline
}

export interface Social {
	id: string;
	url: string;
	icon: {
		url: string;
		label: string;
		value: string;
	};
	name: string;
	color: string;
	enabled: boolean;
	username: string;
}
