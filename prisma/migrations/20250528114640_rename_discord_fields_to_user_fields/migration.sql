-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "Username" TEXT NOT NULL,
    "displayname" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "occupation" TEXT[],
    "staff" BOOLEAN NOT NULL,
    "birthday" TIMESTAMP(3),
    "location" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "pronouns" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "website" TEXT,
    "isDeveloper" BOOLEAN NOT NULL,
    "isPartner" BOOLEAN NOT NULL,
    "email" TEXT,
    "views" TEXT[],
    "isVerified" BOOLEAN NOT NULL,
    "isShow" BOOLEAN NOT NULL,
    "isEmailPrivate" BOOLEAN NOT NULL,
    "isBirthdayPrivate" BOOLEAN NOT NULL,
    "isLocationPrivate" BOOLEAN NOT NULL,
    "isGenderPrivate" BOOLEAN NOT NULL,
    "isPronounsPrivate" BOOLEAN NOT NULL,
    "isSexualityPrivate" BOOLEAN,
    "roles" TEXT[],
    "likes" TEXT[],
    "skills" TEXT[],
    "socials" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sexuality" TEXT,
    "timeZone" TEXT,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "avatar" TEXT,
    "email" TEXT,
    "discordId" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT NOT NULL,
    "mfa_enabled" BOOLEAN NOT NULL,
    "banner" TEXT NOT NULL,
    "SSOProvider" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");
