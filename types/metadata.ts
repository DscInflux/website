export interface MainMetaDataParam {
	title?: string;
	description?: string;
	image?: string;
	keywords?: string[];
	website_url?: string;
	metadata?: string;
	siteKeywords?: string[];
	canonicalUrl?: string;
}

export interface UserMetaDataParam {
	name: string;
	profilePicture?: string;
	banner?: string;
	biography?: string;
	keywords?: string[];
	canonicalUrl?: string;
}
