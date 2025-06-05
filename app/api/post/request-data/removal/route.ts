import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { v4 as uuidv4 } from "uuid";
import { render } from "@react-email/components";
import GDPRDeletionRequestEmail from "@/components/emails/gdpr/data-removal";
import { transporter, FROM_EMAIL } from "@/lib/emailClient";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  // Authenticate user
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get email from next-auth session
    const email = session.user.email;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    if (!user.email || typeof user.email !== "string") {
      return NextResponse.json(
        { error: "User email is missing or invalid." },
        { status: 400 },
      );
    }

    // Generate request ID and dates
    const requestId = uuidv4();
    const requestDate = new Date();
    const completionDate = new Date(requestDate);
    completionDate.setDate(requestDate.getDate() + 30); // 30 days from now

    // Store user email before deletion for sending confirmation
    const userEmail = user.email;
    const userName = user.username || "User";

    // Delete user and all related data (cascading if set in Prisma)
    await prisma.user.delete({ where: { id: user.id } });

    // Render GDPR deletion confirmation email to HTML string
    const html = await render(
      GDPRDeletionRequestEmail({
        userName,
        userEmail,
        requestDate: requestDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        requestId,
        completionDate: completionDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }),
    );

    // Send email using Nodemailer and Zoho SMTP
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: userEmail,
      subject: "Your GDPR Data Deletion Request Received",
      html,
    });

    return NextResponse.json({
      success: true,
      message: "Account deletion request processed successfully",
      requestId,
    });
  } catch (err: any) {
    console.error("GDPR deletion request error:", err);
    return NextResponse.json(
      {
        error: err.message || "Internal server error.",
      },
      { status: 500 },
    );
  }
}
