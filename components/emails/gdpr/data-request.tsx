import * as React from 'react';
import {
	Body,
	Button,
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

const GDPRDataRequestEmail = (props: {
	userName?: string;
	userEmail?: string;
	requestDate?: string;
	requestId?: string;
}) => {
	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>Your GDPR Data Request - Sociava Platform</Preview>
				<Body className="bg-gray-100 py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] rounded-[12px] bg-white shadow-lg">
						{/* Header with Logo */}
						<Section className="rounded-t-[12px] bg-gradient-to-r from-blue-600 to-purple-600 px-[40px] py-[32px] text-center">
							<Img
								src="https://sociava.xyz/logo.webp"
								alt="Sociava Logo"
								className="mx-auto mb-[16px] h-auto w-full max-w-[120px] object-cover"
							/>
							<Heading className="m-0 text-[28px] font-bold leading-tight text-black text-white">
								GDPR Data Request
							</Heading>
							<Text className="text-blue m-0 mt-[8px] text-[16px]">
								Your data privacy rights matter to us
							</Text>
						</Section>

						{/* Main Content */}
						<Section className="px-[40px] py-[32px]">
							<Text className="m-0 mb-[24px] text-[18px] font-semibold text-gray-800">
								Hello {props.userName || 'Valued User'},
							</Text>

							<Text className="m-0 mb-[20px] text-[16px] leading-relaxed text-gray-700">
								We have received your request for access to your personal data under the General
								Data Protection Regulation (GDPR). We take your privacy seriously and are committed
								to providing you with complete transparency about the data we hold.
							</Text>

							{/* Request Details */}
							<Section className="mb-[24px] rounded-[8px] border-l-[4px] border-l-blue-500 bg-gray-50 p-[24px]">
								<Heading className="m-0 mb-[16px] text-[18px] font-semibold text-gray-800">
									Request Details
								</Heading>
								<Text className="m-0 mb-[8px] text-[14px] text-gray-700">
									<strong>Request ID:</strong> {props.requestId}
								</Text>
								<Text className="m-0 mb-[8px] text-[14px] text-gray-700">
									<strong>Email:</strong> {props.userEmail}
								</Text>
								<Text className="m-0 mb-[8px] text-[14px] text-gray-700">
									<strong>Request Date:</strong>{' '}
									{props.requestDate ||
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

							<Text className="m-0 mb-[20px] text-[16px] leading-relaxed text-gray-700">
								Under Article 15 of the GDPR, you have the right to obtain confirmation as to
								whether or not personal data concerning you is being processed, and access to such
								data. We will process your request within 30 days as required by law.
							</Text>

							{/* What We'll Provide */}
							<Section className="mb-[24px]">
								<Heading className="m-0 mb-[16px] text-[18px] font-semibold text-gray-800">
									What's Included in Your Data Package
								</Heading>
								<Text className="m-0 mb-[12px] text-[16px] leading-relaxed text-gray-700">
									• All personal data we hold about you
								</Text>
								<Text className="m-0 mb-[12px] text-[16px] leading-relaxed text-gray-700">
									• The purposes of processing your data
								</Text>
								<Text className="m-0 mb-[12px] text-[16px] leading-relaxed text-gray-700">
									• Categories of personal data we process
								</Text>
								<Text className="m-0 mb-[12px] text-[16px] leading-relaxed text-gray-700">
									• Recipients or categories of recipients of your data
								</Text>
								<Text className="m-0 text-[16px] leading-relaxed text-gray-700">
									• Retention periods for your personal data
								</Text>
							</Section>

							<Hr className="my-[24px] border-gray-200" />

							<Text className="m-0 mb-[24px] text-[16px] leading-relaxed text-gray-700">
								If you have any questions about this request or need to make any changes, please
								don't hesitate to contact our Data Protection Officer at{' '}
								<Link href="mailto:privacy@purrquinox.com" className="text-blue-600 underline">
									privacy@purrquinox.com
								</Link>
							</Text>

							<Text className="m-0 text-[16px] leading-relaxed text-gray-700">
								Thank you for trusting Sociava with your data. We're committed to protecting your
								privacy and ensuring full compliance with GDPR regulations.
							</Text>
						</Section>

						{/* Footer */}
						<Section className="rounded-b-[12px] border-t border-gray-200 bg-gray-50 px-[40px] py-[24px]">
							<Text className="m-0 mb-[12px] text-center text-[14px] text-gray-600">
								<strong>Sociava Platform</strong>
							</Text>
							<Text className="m-0 mb-[12px] text-center text-[14px] text-gray-600">
								Powered by{' '}
								<Link href="https://purrquinox.com" className="text-blue-600 underline">
									Purrquinox Technologies
								</Link>
							</Text>
							<Text className="m-0 mb-[8px] text-center text-[12px] text-gray-500">
								Busan, South Korea
							</Text>
							<Text className="m-0 text-center text-[12px] text-gray-500">
								© 2025 Purrquinox Technologies. All rights reserved. |{' '}
								<Link href="https://purrquinox.com/privacy" className="text-blue-600 underline">
									Privacy Policy
								</Link>{' '}
								|{' '}
								<Link href="https://sociava.xyz/unsubscribe" className="text-blue-600 underline">
									Unsubscribe
								</Link>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default GDPRDataRequestEmail;
