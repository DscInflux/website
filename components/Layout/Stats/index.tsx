'use client';
import { FiUsers, FiBox, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from 'recharts';
import { useQuery } from '@tanstack/react-query';

export interface Stats {
	entities: number;
	users: number;
	entitiesVerified: number;
}

interface StatsCardProps {
	title: string;
	value: number;
	icon: React.ReactNode;
	description: string;
	color: string;
	isVerified?: boolean;
}

const StatsCard = ({
	title,
	value,
	icon,
	description,
	color,
	isVerified = false
}: StatsCardProps) => {
	const getGradient = () => {
		switch (color) {
			case 'blue':
				return 'from-blue-500/20 to-blue-600/5';
			case 'purple':
				return 'from-purple-500/20 to-purple-600/5';
			case 'green':
				return 'from-green-500/20 to-green-600/5';
			case 'red':
				return 'from-red-500/20 to-red-600/5';
			case 'yellow':
				return 'from-yellow-500/20 to-yellow-600/5';
			default:
				return 'from-blue-500/20 to-blue-600/5';
		}
	};

	const getBorderColor = () => {
		switch (color) {
			case 'blue':
				return 'border-blue-500/20';
			case 'purple':
				return 'border-purple-500/20';
			case 'green':
				return 'border-green-500/20';
			case 'red':
				return 'border-red-500/20';
			case 'yellow':
				return 'border-yellow-500/20';
			default:
				return 'border-blue-500/20';
		}
	};

	return (
		<div
			className={`rounded-2xl border bg-white p-6 shadow-lg dark:bg-[#070510] ${getBorderColor()} relative h-full overflow-hidden`}
		>
			<div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-50`}></div>
			<div className="relative z-10">
				<div className="mb-4 flex items-start justify-between">
					<div className="rounded-lg bg-white p-3 shadow-md dark:bg-[#1d2341]">{icon}</div>
					{isVerified && (
						<span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
							Verified
						</span>
					)}
				</div>
				<h3 className="mb-1 text-xl font-semibold">{title}</h3>
				<div className="mb-2 flex items-end gap-1">
					<span className="text-3xl font-bold">{value.toLocaleString()}</span>
				</div>
				<p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
			</div>
		</div>
	);
};

const StatLoader = () => {
	return (
		<div className="h-full animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-[#070510]">
			<div className="mb-4 flex items-start justify-between">
				<div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
			</div>
			<div className="mb-3 h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
			<div className="mb-3 h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
			<div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
		</div>
	);
};

export default function StatsComponent() {
	// --- React Query: Fetch stats ---
	const {
		data: stats,
		isLoading,
		error
	} = useQuery({
		queryKey: ['stats'],
		queryFn: async () => {
			const response = await fetch('/api/get/stats');
			if (!response.ok) throw new Error('Failed to fetch stats');
			const data = await response.json();
			return data.stats;
		},
		refetchInterval: 30000
	});

	const data = [
		{ name: 'Entities', value: stats?.entities || 0 },
		{ name: 'Users', value: stats?.users || 0 },
		{ name: 'Verified Entities', value: stats?.entitiesVerified || 0 }
	];

	return (
		<main className="relative min-h-screen w-full overflow-hidden px-4 py-16 md:px-6">
			<div className="background-shapes"></div>
			<div className="color-layout layout-blue"></div>

			<div className="mx-auto max-w-6xl">
				<motion.div
					className="mb-12 text-center"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<h1 className="mb-3 text-4xl font-bold md:text-5xl">Stats</h1>
					<p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300 md:text-xl">
						View our stats aren't they good?
					</p>
				</motion.div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{isLoading ? (
						<>
							<StatLoader />
							<StatLoader />
							<StatLoader />
						</>
					) : (
						<>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.1 }}
							>
								<StatsCard
									title="Total Entities"
									value={stats?.entities || 0}
									icon={<FiBox className="text-blue-500" size={24} />}
									description="All entities in the system"
									color="blue"
								/>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
							>
								<StatsCard
									title="Total Users"
									value={stats?.users || 0}
									icon={<FiUsers className="text-purple-500" size={24} />}
									description="Registered user accounts"
									color="purple"
								/>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.3 }}
							>
								<StatsCard
									title="Verified Entities"
									value={stats?.entitiesVerified || 0}
									icon={<FiCheckCircle className="text-green-500" size={24} />}
									description="Verified and approved entities"
									color="green"
									isVerified={true}
								/>
							</motion.div>
						</>
					)}
				</div>

				<motion.div
					className="mt-16"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.5 }}
				>
					<div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg dark:bg-[#070510]">
						<div className="color-layout-card layout-blue opacity-10"></div>
						<h2 className="mb-6 text-2xl font-bold">Analytics Overview</h2>
						{isLoading ? (
							<div className="flex h-48 items-center justify-center">
								<div className="flex animate-pulse space-x-4">
									<div className="flex-1 space-y-4 py-1">
										<div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
										<div className="space-y-2">
											<div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
											<div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="space-y-6">
								<div style={{ width: '100%', height: 300 }}>
									<ResponsiveContainer>
										<BarChart
											data={data}
											margin={{
												top: 20,
												right: 30,
												left: 20,
												bottom: 5
											}}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="name" />
											<YAxis />
											<Tooltip />
											<Legend />
											<Bar dataKey="value" fill="#8884d8" />
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
						)}
					</div>
				</motion.div>
			</div>
		</main>
	);
}
