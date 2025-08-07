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
		<div className="flex min-h-screen items-center justify-center bg-black p-4">
			<div className="relative w-full max-w-2xl">
				<div className="rounded-2xl border border-white bg-black p-8 md:p-12">
					{/* Header */}
					<div className="mb-8 text-center">
						<div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
								<Download className="h-4 w-4 text-white" />
							</div>
						</div>
						<h1 className="mb-2 text-3xl font-bold text-white">GDPR Data Controls</h1>
						<p className="mx-auto max-w-md leading-relaxed text-gray-400">
							Manage your personal data in compliance with GDPR regulations. You have the right to
							access and delete your information.
						</p>
					</div>
					{/* Action Cards */}
					<div className="mb-8 grid gap-6 md:grid-cols-2">
						{/* Request Data Card */}
						<div className="rounded-xl border border-white bg-black p-6">
							<div className="mb-4 flex items-center">
								<div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white">
									<Download className="h-5 w-5 text-black" />
								</div>
								<h3 className="font-semibold text-white">Request Your Data</h3>
							</div>
							<p className="mb-4 text-sm text-gray-400">
								Request a complete copy of all your personal data stored in our systems.
							</p>
							<button
								className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-medium text-black transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
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
										<Download className="h-4 w-4 text-black" />
										Request My Data
									</>
								)}
							</button>
						</div>
						{/* Delete Data Card */}
						<div className="rounded-xl border border-white bg-black p-6">
							<div className="mb-4 flex items-center">
								<div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white">
									<Trash2 className="h-5 w-5 text-black" />
								</div>
								<h3 className="font-semibold text-white">Delete Your Data</h3>
							</div>
							<p className="mb-4 text-sm text-gray-400">
								Permanently remove your account and all associated data. This action cannot be
								undone.
							</p>
							<button
								className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-medium text-black transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
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
										<Trash2 className="h-4 w-4 text-black" />
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
								<div className="flex items-center gap-3 rounded-lg border border-white bg-black p-4">
									<CheckCircle className="h-5 w-5 flex-shrink-0 text-white" />
									<div>
										<p className="font-medium text-white">Data Request Submitted</p>
										<p className="text-sm text-gray-400">
											We'll send your data export to your registered email address within 30 days.
										</p>
									</div>
								</div>
							)}
							{deleteDataMutation.isSuccess && (
								<div className="flex items-center gap-3 rounded-lg border border-white bg-black p-4">
									<CheckCircle className="h-5 w-5 flex-shrink-0 text-white" />
									<div>
										<p className="font-medium text-white">Deletion Request Submitted</p>
										<p className="text-sm text-gray-400">
											Your account and all data will be permanently deleted within 30 days.
										</p>
									</div>
								</div>
							)}
							{(requestDataMutation.isError || deleteDataMutation.isError) && (
								<div className="flex items-center gap-3 rounded-lg border border-white bg-black p-4">
									<AlertCircle className="h-5 w-5 flex-shrink-0 text-white" />
									<div>
										<p className="font-medium text-white">Request Failed</p>
										<p className="text-sm text-gray-400">
											Something went wrong. Please try again or contact support if the issue
											persists.
										</p>
									</div>
								</div>
							)}
						</div>
					)}
					{/* Footer */}
					<div className="mt-8 border-t border-dashed border-white pt-6">
						<p className="text-center text-xs text-gray-400">
							These actions are processed in accordance with GDPR Article 15 (Right of Access) and
							Article 17 (Right to Erasure). For questions, contact our Data Protection Officer.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
