import { Metadata } from "next";
import { siteTitle, description_short, description, banner as defaultImage, website_url, logo, siteKeywords, twitter } from "./siteConfig";
import type { MainMetaDataParam, UserMetaDataParam } from "../types/metadata";

export function generateMetadata(params: MainMetaDataParam): Metadata {
	const { title, description, image, keywords = siteKeywords, canonicalUrl, metadata } = params;
  const fullDesc = description;
	const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - ${description_short}`;
	const previewImage = image ?? defaultImage;
	const canonicalBase = metadata ?? process.env.NEXT_PUBLIC_APP_URL ?? website_url;

	const meta: Metadata = {
		metadataBase: new URL(canonicalBase),
		title: fullTitle,
		description: fullDesc,
		keywords: keywords.length ? keywords : [description_short],
		icons: {
			icon: logo ?? '/logo.webp'
		},
		openGraph: {
			title: fullTitle,
			description: fullDesc,
      url: canonicalBase,
			siteName: siteTitle,
			images: [
				{
					url: previewImage,
					width: 1200,
					height: 630,
					alt: fullTitle
				}
			],
			locale: 'en_US',
			type: 'website'
		},
		twitter: {
			card: 'summary_large_image',
			title: fullTitle,
			description: description_short,
			images: [previewImage],
			site: twitter || undefined
		}
	};

	if (canonicalUrl) {
		meta.alternates = {
			canonical: canonicalUrl
		};
	}

	return meta;
}

export function generateHomeMetadata(params: MainMetaDataParam): Metadata {
  return generateMetadata({
    title: 'Home',
    description: 'Welcome to DscInflux&apos;s Homepage!',
    image: params.image ?? defaultImage,
    keywords: params.keywords?.length ? params.keywords : ['Home', 'DscInflux'],
    canonicalUrl: params.canonicalUrl
  });
}

export function generateAdminMetadata(params: MainMetaDataParam): Metadata {
  return generateMetadata({
    title: 'Admin',
    description: 'Welcome to DscInflux Admin Page! Here you can perform a variety of admin actions such as banning users, verifying users and more.',
    image: params.image ?? defaultImage,
    keywords: params.keywords?.length ? params.keywords : ['Admin', 'DscInflux'],
    canonicalUrl: params.canonicalUrl
  });
}

export function generateTeamsMetadata(params: MainMetaDataParam): Metadata {
  return generateMetadata({
    title: 'Teams',
    description: 'Welcome to DscInflux Teams Page! Here you can find all the teams and their members.',
    image: params.image ?? defaultImage,
    keywords: params.keywords?.length ? params.keywords : ['Teams', 'DscInflux'],
    canonicalUrl: params.canonicalUrl
  });
}

export function generateStatsMetadata(params: MainMetaDataParam): Metadata {
  return generateMetadata({
    title: 'Stats',
    description: 'Welcome to DscInflux Stats Page! Here you can find all the stats and analytics of the platform.',
    image: params.image ?? defaultImage,
    keywords: params.keywords?.length ? params.keywords : ['Stats', 'DscInflux'],
    canonicalUrl: params.canonicalUrl
  });
}

export function generateExploreMetadata(params: MainMetaDataParam): Metadata {
  return generateMetadata({
    title: 'Explore',
    description: 'Welcome to DscInflux Explore Page! Here you can find all the Users and sort them by various sorting options such as by their skills and the languages spoken by them!',
    image: params.image ?? defaultImage,
    keywords: params.keywords?.length ? params.keywords : ['Explore', 'DscInflux'],
    canonicalUrl: params.canonicalUrl
  });
}

export function generateUserSettingsMetadata(params: MainMetaDataParam): Metadata {
  return generateMetadata({
    title: 'User Settings',
    description: 'Welcome to DscInflux User Settings Page! Here you can find all the settings and options to customize your profile.',
    image: params.image ?? defaultImage,
    keywords: params.keywords?.length ? params.keywords : ['User Settings', 'DscInflux'],
    canonicalUrl: params.canonicalUrl
  });
}

export function generateUserMetadata(params: UserMetaDataParam): Metadata {
  const {
    name,
    profilePicture,
    banner,
    biography,
    keywords,
    canonicalUrl
  } = params;

  // Compose images array: profile picture (top left), then banner if exists
  const images = [
    ...(profilePicture ? [{ url: profilePicture, width: 256, height: 256, alt: `${name}'s profile picture` }] : []),
    ...(banner ? [{ url: banner, width: 1200, height: 400, alt: `${name}'s banner` }] : [])
  ];

  // Use the first image as the main image, but pass all to openGraph if needed
  return generateMetadata({
    title: name,
    description: biography || `${name}'s profile on DscInflux`,
    image: images.length ? images[0].url : undefined,
    keywords: keywords?.length ? keywords : [name, 'User', 'DscInflux'],
    canonicalUrl
  });
}

