import * as React from 'react';
import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
	Tailwind,
	Hr
} from '@react-email/components';

const GDPRDeletionRequestEmail = (props: {
	userName?: string;
	userEmail?: string;
	requestDate?: string;
	requestId?: string;
	completionDate?: string;
}) => {
	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>GDPR Data Deletion Request Confirmation - sociava Platform</Preview>
				<Body className="bg-gray-100 py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] rounded-[12px] bg-white shadow-lg">
						{/* Header with Logo */}
						<Section className="rounded-t-[12px] bg-gradient-to-r from-red-600 to-orange-600 px-[40px] py-[32px] text-center">
							<Img
								src="https://sociava.xyz/logo.webp"
								alt="Sociava Logo"
								className="mx-auto mb-[16px] h-auto w-full max-w-[120px] object-cover"
							/>
							<Heading className="m-0 text-[28px] font-bold leading-tight text-black">
								Data Deletion Request
							</Heading>
							<Text className="m-0 mt-[8px] text-[16px] text-red-100">
								Your right to be forgotten
							</Text>
						</Section>

						{/* Main Content */}
						<Section className="px-[40px] py-[32px]">
							<Text className="m-0 mb-[24px] text-[18px] font-semibold text-gray-800">
								Hello {props.userName || 'Valued User'},
							</Text>

							<Text className="m-0 mb-[20px] text-[16px] leading-relaxed text-gray-700">
								We have received and are processing your request to delete your personal data under
								Article 17 of the General Data Protection Regulation (GDPR) - the "Right to be
								Forgotten". Your data deletion will be completed within 30 days as required by law.
							</Text>

							{/* Request Details */}
							<Section className="mb-[24px] rounded-[8px] border-l-[4px] border-l-red-500 bg-red-50 p-[24px]">
								<Heading className="m-0 mb-[16px] text-[18px] font-semibold text-gray-800">
									Deletion Request Details
								</Heading>
								<Text className="m-0 mb-[8px] text-[14px] text-gray-700">
									<strong>Request ID:</strong> {props.requestId || 'DEL-2024-001'}
								</Text>
								<Text className="m-0 mb-[8px] text-[14px] text-gray-700">
									<strong>Email:</strong> {props.userEmail}
								</Text>
								<Text className="m-0 mb-[8px] text-[14px] text-gray-700">
									<strong>Request Date:</strong> {props.requestDate}
								</Text>
								<Text className="m-0 mb-[8px] text-[14px] text-gray-700">
									<strong>Expected Completion:</strong>{' '}
									{props.completionDate ||
										new Date().toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}
								</Text>
								<Text className="m-0 text-[14px] text-gray-700">
									<strong>Platform:</strong> Sociava (sociava.xyz)
								</Text>
							</Section>

							<Text className="m-0 mb-[24px] text-[16px] leading-relaxed text-gray-700">
								Your account and associated data will be permanently removed from our systems. You
								will receive a final confirmation email once the deletion process is complete.
							</Text>

							{/* What Will Be Deleted */}
							<Section className="mb-[24px]">
								<Heading className="m-0 mb-[16px] text-[18px] font-semibold text-gray-800">
									What Will Be Deleted
								</Heading>
								<Text className="m-0 mb-[12px] text-[16px] leading-relaxed text-gray-700">
									• Your account profile and personal information
								</Text>
								<Text className="m-0 mb-[12px] text-[16px] leading-relaxed text-gray-700">
									• All uploaded content and user-generated data
								</Text>
								<Text className="m-0 mb-[12px] text-[16px] leading-relaxed text-gray-700">
									• Activity logs and usage analytics
								</Text>
								<Text className="m-0 mb-[12px] text-[16px] leading-relaxed text-gray-700">
									• Communication history and preferences
								</Text>
								<Text className="m-0 text-[16px] leading-relaxed text-gray-700">
									• Any backups containing your personal data
								</Text>
							</Section>

							{/* Important Notice */}
							<Section className="mb-[24px] rounded-[8px] border-l-[4px] border-l-gray-500 bg-gray-50 p-[24px]">
								<Heading className="m-0 mb-[12px] text-[16px] font-semibold text-gray-800">
									Important Notice
								</Heading>
								<Text className="m-0 text-[14px] leading-relaxed text-gray-700">
									• You will lose access to all Sociava's services once deletion is complete
								</Text>
							</Section>

							<Hr className="my-[24px] border-gray-200" />

							<Text className="m-0 mb-[24px] text-[16px] leading-relaxed text-gray-700">
								If you have any questions about this deletion request or need to make any changes,
								please contact our Data Protection Officer at{' '}
								<Link href="mailto:privacy@purrquinox.com" className="text-red-600 underline">
									privacy@purrquinox.com
								</Link>{' '}
								as soon as possible.
							</Text>

							<Text className="m-0 text-[16px] leading-relaxed text-gray-700">
								We're sorry to see you go. Thank you for being part of the Sociava community.
							</Text>
						</Section>

						{/* Footer */}
						<Section className="rounded-b-[12px] border-t border-gray-200 bg-gray-50 px-[40px] py-[24px]">
							<Text className="m-0 mb-[12px] text-center text-[14px] text-gray-600">
								<strong>Sociava Platform</strong>
							</Text>
							<Text className="m-0 mb-[12px] text-center text-[14px] text-gray-600">
								Powered by{' '}
								<Link href="https://purrquinox.com" className="text-red-600 underline">
									Purrquinox Technologies
								</Link>
							</Text>
							<Text className="m-0 mb-[8px] text-center text-[12px] text-gray-500">
								Incheon, South Korea
							</Text>
							<Text className="m-0 text-center text-[12px] text-gray-500">
								© 2025 Purrquinox Technologies. All rights reserved. |{' '}
								<Link href="https://purrquinox.com/privacy" className="text-red-600 underline">
									Privacy Policy
								</Link>{' '}
								|{' '}
								<Link href="mailto:support@purrquinox.com" className="text-red-600 underline">
									Contact Support
								</Link>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default GDPRDeletionRequestEmail;
