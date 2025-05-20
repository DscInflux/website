export interface Entity {
  id: string;
  discordId: string;
  discordUsername: string;
  discordDisplayName: string;
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
  views: string[];
  isVerified: boolean;

  // Flattened Privacy fields
  isShow: boolean;
  isEmailPrivate: boolean;
  isBirthdayPrivate: boolean;
  isLocationPrivate: boolean;
  isGenderPrivate: boolean;
  isPronounsPrivate: boolean;

  roles: string[];
  likes: string[];
  skills: string[];

  socials: Social[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  isLiked: boolean;
  isSelf: boolean;
  isTeamMember: boolean;
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
