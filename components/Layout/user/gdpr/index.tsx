'use client';
import { useMutation } from '@tanstack/react-query';
import { Download, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function GDPRUserPage() {
	const requestDataMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch('/api/post/request-data', { method: 'POST' });
			if (!res.ok) throw new Error('Failed to request data');
			return res.json();
		}
	});

	const deleteDataMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch('/api/post/request-data/removal', {
				method: 'POST'
			});
			if (!res.ok) throw new Error('Failed to request data removal');
			return res.json();
		}
	});

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="relative w-full max-w-2xl">
				{/* Background gradient effect */}
				<div className="color-layout-card layout-blue"></div>

				<div className="dark:border-[var(--3)]/50 relative rounded-2xl border border-gray-200/50 p-8 shadow-2xl backdrop-blur-sm md:p-12">
					{/* Header */}
					<div className="mb-8 text-center">
						<div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
								<div className="h-4 w-4 rounded-sm bg-white"></div>
							</div>
						</div>
						<h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
							GDPR Data Controls
						</h1>
						<p className="mx-auto max-w-md leading-relaxed text-gray-600 dark:text-gray-300">
							Manage your personal data in compliance with GDPR regulations. You have the right to
							access and delete your information.
						</p>
					</div>

					{/* Action Cards */}
					<div className="mb-8 grid gap-6 md:grid-cols-2">
						{/* Request Data Card */}
						<div className="dark:border-[var(--2)]/50 rounded-xl border border-gray-200/50 p-6">
							<div className="mb-4 flex items-center">
								<div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
									<Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
								</div>
								<h3 className="font-semibold text-gray-900 dark:text-white">Request Your Data</h3>
							</div>
							<p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
								Request a complete copy of all your personal data stored in our systems.
							</p>
							<button
								className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
								onClick={() => requestDataMutation.mutate()}
								disabled={requestDataMutation.isPending}
							>
								{requestDataMutation.isPending ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Processing...
									</>
								) : (
									<>
										<Download className="h-4 w-4" />
										Request My Data
									</>
								)}
							</button>
						</div>

						{/* Delete Data Card */}
						<div className="rounded-xl border border-red-200/50 bg-red-50/80 p-6 dark:border-red-800/50 dark:bg-red-900/20">
							<div className="mb-4 flex items-center">
								<div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
									<Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
								</div>
								<h3 className="font-semibold text-gray-900 dark:text-white">Delete Your Data</h3>
							</div>
							<p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
								Permanently remove your account and all associated data. This action cannot be
								undone.
							</p>
							<button
								className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
								onClick={() => deleteDataMutation.mutate()}
								disabled={deleteDataMutation.isPending}
							>
								{deleteDataMutation.isPending ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Processing...
									</>
								) : (
									<>
										<Trash2 className="h-4 w-4" />
										Delete My Data
									</>
								)}
							</button>
						</div>
					</div>

					{/* Status Messages */}
					{(requestDataMutation.isSuccess ||
						deleteDataMutation.isSuccess ||
						requestDataMutation.isError ||
						deleteDataMutation.isError) && (
						<div className="space-y-3">
							{requestDataMutation.isSuccess && (
								<div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800/50 dark:bg-green-900/20">
									<CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
									<div>
										<p className="font-medium text-green-800 dark:text-green-200">
											Data Request Submitted
										</p>
										<p className="text-sm text-green-700 dark:text-green-300">
											We'll send your data export to your registered email address within 30 days.
										</p>
									</div>
								</div>
							)}

							{deleteDataMutation.isSuccess && (
								<div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20">
									<CheckCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
									<div>
										<p className="font-medium text-red-800 dark:text-red-200">
											Deletion Request Submitted
										</p>
										<p className="text-sm text-red-700 dark:text-red-300">
											Your account and all data will be permanently deleted within 30 days.
										</p>
									</div>
								</div>
							)}

							{(requestDataMutation.isError || deleteDataMutation.isError) && (
								<div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20">
									<AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
									<div>
										<p className="font-medium text-red-800 dark:text-red-200">Request Failed</p>
										<p className="text-sm text-red-700 dark:text-red-300">
											Something went wrong. Please try again or contact support if the issue
											persists.
										</p>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Footer */}
					<div className="dark:border-[var(--3)]/50 mt-8 border-t border-gray-200/50 pt-6">
						<p className="text-center text-xs text-gray-500 dark:text-gray-400">
							These actions are processed in accordance with GDPR Article 15 (Right of Access) and
							Article 17 (Right to Erasure). For questions, contact our Data Protection Officer.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
