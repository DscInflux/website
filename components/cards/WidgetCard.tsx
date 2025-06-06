import Image from 'next/image';
import {
	Heart,
	Star,
	Shield,
	Crown,
	Code,
	Calendar,
	Briefcase,
	Zap,
	Languages,
	Globe,
	ExternalLink
} from 'lucide-react';
import { Entity } from '@/types/entity';

interface CardProps {
	profileData: Entity;
}

export const WidgetCard = ({ profileData }: CardProps) => {
	const age = profileData.birthday
		? new Date().getFullYear() - new Date(profileData.birthday).getFullYear()
		: 'Unknown';

	return (
		<div className="mx-auto w-full max-w-5xl p-4">
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl">
				{/* Banner Section */}
				<div className="relative h-48 overflow-hidden">
					<Image
						src={profileData.banner}
						alt="Profile banner"
						width={1000}
						height={200}
						className="h-full w-full object-cover object-center"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
					<div className="absolute right-4 top-4 flex gap-2">
						<div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
							<div className="flex items-center gap-1 text-sm text-white">
								<Heart className="h-4 w-4 fill-red-400 text-red-400" />
								<span>{profileData.likes?.length || 0}</span>
							</div>
						</div>
						<div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
							<div className="flex items-center gap-1 text-sm text-white">
								<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
								<span>4.9</span>
							</div>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="relative px-8 pb-8">
					{/* Avatar */}
					<div className="absolute -top-16 left-8">
						<div className="relative">
							<div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
								<Image
									src={profileData.avatar}
									alt="Profile picture"
									width={128}
									height={128}
									className="object-cover object-center"
								/>
							</div>

							{/* Status indicators */}
							<div className="absolute -bottom-2 -right-2 flex gap-1">
								{profileData.isVerified && (
									<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-lg">
										<Shield className="h-4 w-4 text-white" />
									</div>
								)}
								{profileData.staff && (
									<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
										<Crown className="h-4 w-4 text-white" />
									</div>
								)}
								{profileData.isDeveloper && (
									<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-lg">
										<Code className="h-4 w-4 text-white" />
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-8 pt-20 lg:grid-cols-3">
						{/* Left Section */}
						<div className="space-y-6 lg:col-span-2">
							<div>
								<div className="mb-2 flex items-center gap-3">
									<h1 className="text-4xl font-bold text-white">{profileData.displayname}</h1>
									<span className="text-xl text-purple-300">@{profileData.Username}</span>
								</div>
								<p className="mb-4 text-lg text-gray-300">{profileData.about}</p>

								<div className="flex items-center gap-4 text-sm text-gray-400">
									<span className="flex items-center gap-1">
										<Calendar className="h-4 w-4" />
										{age} years old
									</span>
									<span className="flex items-center gap-1">
										<span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
										{profileData.pronouns}
									</span>
								</div>
							</div>

							<div>
								<h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
									<Briefcase className="h-5 w-5 text-purple-400" />
									Roles
								</h3>
								<div className="flex flex-wrap gap-2">
									{profileData.roles?.map((role: string, i: number) => (
										<span
											key={i}
											className="rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-3 py-1 text-sm text-purple-200"
										>
											{role}
										</span>
									))}
								</div>
							</div>

							<div>
								<h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
									<Zap className="h-5 w-5 text-yellow-400" />
									Expertise
								</h3>
								<div className="flex flex-wrap gap-2">
									{profileData.occupation?.map((job: string, i: number) => (
										<span
											key={i}
											className="rounded-full border border-yellow-500/30 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1 text-sm text-yellow-200"
										>
											{job}
										</span>
									))}
								</div>
							</div>
						</div>

						{/* Right Section */}
						<div className="space-y-6">
							<div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
								<h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
									<Languages className="h-5 w-5 text-blue-400" />
									Languages
								</h3>
								<p className="text-sm text-gray-300">{profileData.language}</p>
							</div>

							<div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
								<h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
									<Code className="h-5 w-5 text-green-400" />
									Skills
								</h3>
								<div className="flex flex-wrap gap-2">
									{profileData.skills?.map((skill: string, i: number) => (
										<span
											key={i}
											className="rounded-lg border border-green-500/30 bg-green-500/20 px-2 py-1 text-xs text-green-200"
										>
											{skill}
										</span>
									))}
								</div>
							</div>

							{profileData.website && (
								<div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
									<h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
										<Globe className="h-5 w-5 text-cyan-400" />
										Website
									</h3>
									<a
										href={`${profileData.website}${
											profileData.website.includes('?') ? '&' : '?'
										}utm_source=Sociava`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 text-sm text-cyan-300 transition-colors hover:text-cyan-200"
									>
										{profileData.website.replace(/^https?:\/\//, '')}
										<ExternalLink className="h-3 w-3" />
									</a>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
