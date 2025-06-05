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
  Hr,
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
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[12px] shadow-lg max-w-[600px] mx-auto">
            {/* Header with Logo */}
            <Section className="bg-gradient-to-r from-red-600 to-orange-600 rounded-t-[12px] px-[40px] py-[32px] text-center">
              <Img
                src="https://sociava.xyz/logo.webp"
                alt="Sociava Logo"
                className="w-full h-auto object-cover max-w-[120px] mx-auto mb-[16px]"
              />
              <Heading className="text-black text-[28px] font-bold m-0 leading-tight">
                Data Deletion Request
              </Heading>
              <Text className="text-red-100 text-[16px] m-0 mt-[8px]">
                Your right to be forgotten
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="px-[40px] py-[32px]">
              <Text className="text-gray-800 text-[18px] font-semibold mb-[24px] m-0">
                Hello {props.userName || 'Valued User'},
              </Text>

              <Text className="text-gray-700 text-[16px] leading-relaxed mb-[20px] m-0">
                We have received and are processing your request to delete your personal data under Article 17 of the General Data Protection Regulation (GDPR) - the "Right to be Forgotten". Your data deletion will be completed within 30 days as required by law.
              </Text>

              {/* Request Details */}
              <Section className="bg-red-50 rounded-[8px] p-[24px] mb-[24px] border-l-[4px] border-l-red-500">
                <Heading className="text-gray-800 text-[18px] font-semibold mb-[16px] m-0">
                  Deletion Request Details
                </Heading>
                <Text className="text-gray-700 text-[14px] mb-[8px] m-0">
                  <strong>Request ID:</strong> {props.requestId || 'DEL-2024-001'}
                </Text>
                <Text className="text-gray-700 text-[14px] mb-[8px] m-0">
                  <strong>Email:</strong> {props.userEmail}
                </Text>
                <Text className="text-gray-700 text-[14px] mb-[8px] m-0">
                  <strong>Request Date:</strong> {props.requestDate}
                </Text>
                <Text className="text-gray-700 text-[14px] mb-[8px] m-0">
                  <strong>Expected Completion:</strong> {props.completionDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
                <Text className="text-gray-700 text-[14px] m-0">
                  <strong>Platform:</strong> Sociava (sociava.xyz)
                </Text>
              </Section>

              <Text className="text-gray-700 text-[16px] leading-relaxed mb-[24px] m-0">
                Your account and associated data will be permanently removed from our systems. You will receive a final confirmation email once the deletion process is complete.
              </Text>

              {/* What Will Be Deleted */}
              <Section className="mb-[24px]">
                <Heading className="text-gray-800 text-[18px] font-semibold mb-[16px] m-0">
                  What Will Be Deleted
                </Heading>
                <Text className="text-gray-700 text-[16px] leading-relaxed mb-[12px] m-0">
                  • Your account profile and personal information
                </Text>
                <Text className="text-gray-700 text-[16px] leading-relaxed mb-[12px] m-0">
                  • All uploaded content and user-generated data
                </Text>
                <Text className="text-gray-700 text-[16px] leading-relaxed mb-[12px] m-0">
                  • Activity logs and usage analytics
                </Text>
                <Text className="text-gray-700 text-[16px] leading-relaxed mb-[12px] m-0">
                  • Communication history and preferences
                </Text>
                <Text className="text-gray-700 text-[16px] leading-relaxed m-0">
                  • Any backups containing your personal data
                </Text>
              </Section>

              {/* Important Notice */}
              <Section className="bg-gray-50 rounded-[8px] p-[24px] mb-[24px] border-l-[4px] border-l-gray-500">
                <Heading className="text-gray-800 text-[16px] font-semibold mb-[12px] m-0">
                  Important Notice
                </Heading>
                <Text className="text-gray-700 text-[14px] leading-relaxed m-0">
                  • You will lose access to all Sociava's services once deletion is complete
                </Text>
              </Section>

              <Hr className="border-gray-200 my-[24px]" />

              <Text className="text-gray-700 text-[16px] leading-relaxed mb-[24px] m-0">
                If you have any questions about this deletion request or need to make any changes, please contact our Data Protection Officer at{' '}
                <Link href="mailto:privacy@purrquinox.com" className="text-red-600 underline">
                  privacy@purrquinox.com
                </Link>{' '}
                as soon as possible.
              </Text>

              <Text className="text-gray-700 text-[16px] leading-relaxed m-0">
                We're sorry to see you go. Thank you for being part of the Sociava community.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 px-[40px] py-[24px] rounded-b-[12px] border-t border-gray-200">
              <Text className="text-center text-gray-600 text-[14px] mb-[12px] m-0">
                <strong>Sociava Platform</strong>
              </Text>
              <Text className="text-center text-gray-600 text-[14px] mb-[12px] m-0">
                Powered by{' '}
                <Link href="https://purrquinox.com" className="text-red-600 underline">
                  Purrquinox Technologies
                </Link>
              </Text>
              <Text className="text-center text-gray-500 text-[12px] mb-[8px] m-0">
                Incheon, South Korea
              </Text>
              <Text className="text-center text-gray-500 text-[12px] m-0">
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