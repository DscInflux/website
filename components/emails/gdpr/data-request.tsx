import * as React from "react";
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
  Hr,
} from "@react-email/components";

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
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[12px] shadow-lg max-w-[600px] mx-auto">
            {/* Header with Logo */}
            <Section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-[12px] px-[40px] py-[32px] text-center">
              <Img
                src="https://sociava.xyz/logo.webp"
                alt="Sociava Logo"
                className="w-full h-auto object-cover max-w-[120px] mx-auto mb-[16px]"
              />
              <Heading className="text-white text-[28px] font-bold m-0 leading-tight text-black">
                GDPR Data Request
              </Heading>
              <Text className="text-blue text-[16px] m-0 mt-[8px]">
                Your data privacy rights matter to us
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="px-[40px] py-[32px]">
              <Text className="text-gray-800 text-[18px] font-semibold mb-[24px] m-0">
                Hello {props.userName || "Valued User"},
              </Text>

              <Text className="text-gray-700 text-[16px] leading-relaxed mb-[20px] m-0">
                We have received your request for access to your personal data
                under the General Data Protection Regulation (GDPR). We take
                your privacy seriously and are committed to providing you with
                complete transparency about the data we hold.
              </Text>

              {/* Request Details */}
              <Section className="bg-gray-50 rounded-[8px] p-[24px] mb-[24px] border-l-[4px] border-l-blue-500">
                <Heading className="text-gray-800 text-[18px] font-semibold mb-[16px] m-0">
                  Request Details
                </Heading>
                <Text className="text-gray-700 text-[14px] mb-[8px] m-0">
                  <strong>Request ID:</strong> {props.requestId}
                </Text>
                <Text className="text-gray-700 text-[14px] mb-[8px] m-0">
                  <strong>Email:</strong> {props.userEmail}
                </Text>
                <Text className="text-gray-700 text-[14px] mb-[8px] m-0">
                  <strong>Request Date:</strong>{" "}
                  {props.requestDate ||
                    new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </Text>
                <Text className="text-gray-700 text-[14px] m-0">
                  <strong>Platform:</strong> Sociava (sociava.xyz)
                </Text>
              </Section>

              <Text className="text-gray-700 text-[16px] leading-relaxed mb-[20px] m-0">
                Under Article 15 of the GDPR, you have the right to obtain
                confirmation as to whether or not personal data concerning you
                is being processed, and access to such data. We will process
                your request within 30 days as required by law.
              </Text>

              {/* What We'll Provide */}
              <Section className="mb-[24px]">
                <Heading className="text-gray-800 text-[18px] font-semibold mb-[16px] m-0">
                  What's Included in Your Data Package
                </Heading>
                <Text className="text-gray-700 text-[16px] leading-relaxed mb-[12px] m-0">
                  • All personal data we hold about you
                </Text>
                <Text className="text-gray-700 text-[16px] leading-relaxed mb-[12px] m-0">
                  • The purposes of processing your data
                </Text>
                <Text className="text-gray-700 text-[16px] leading-relaxed mb-[12px] m-0">
                  • Categories of personal data we process
                </Text>
                <Text className="text-gray-700 text-[16px] leading-relaxed mb-[12px] m-0">
                  • Recipients or categories of recipients of your data
                </Text>
                <Text className="text-gray-700 text-[16px] leading-relaxed m-0">
                  • Retention periods for your personal data
                </Text>
              </Section>

              <Hr className="border-gray-200 my-[24px]" />

              <Text className="text-gray-700 text-[16px] leading-relaxed mb-[24px] m-0">
                If you have any questions about this request or need to make any
                changes, please don't hesitate to contact our Data Protection
                Officer at{" "}
                <Link
                  href="mailto:privacy@purrquinox.com"
                  className="text-blue-600 underline"
                >
                  privacy@purrquinox.com
                </Link>
              </Text>

              <Text className="text-gray-700 text-[16px] leading-relaxed m-0">
                Thank you for trusting Sociava with your data. We're committed
                to protecting your privacy and ensuring full compliance with
                GDPR regulations.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 px-[40px] py-[24px] rounded-b-[12px] border-t border-gray-200">
              <Text className="text-center text-gray-600 text-[14px] mb-[12px] m-0">
                <strong>Sociava Platform</strong>
              </Text>
              <Text className="text-center text-gray-600 text-[14px] mb-[12px] m-0">
                Powered by{" "}
                <Link
                  href="https://purrquinox.com"
                  className="text-blue-600 underline"
                >
                  Purrquinox Technologies
                </Link>
              </Text>
              <Text className="text-center text-gray-500 text-[12px] mb-[8px] m-0">
                Busan, South Korea
              </Text>
              <Text className="text-center text-gray-500 text-[12px] m-0">
                © 2025 Purrquinox Technologies. All rights reserved. |{" "}
                <Link
                  href="https://purrquinox.com/privacy"
                  className="text-blue-600 underline"
                >
                  Privacy Policy
                </Link>{" "}
                |{" "}
                <Link
                  href="https://sociava.xyz/unsubscribe"
                  className="text-blue-600 underline"
                >
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
