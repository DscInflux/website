import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { exportUserData } from '@/lib/gdpr/exportUserData';
import { v4 as uuidv4 } from 'uuid';
import { render } from '@react-email/components';
import GDPRDataRequestEmail from '@/components/emails/gdpr/data-request';
import { transporter, FROM_EMAIL } from '@/lib/emailClient';
import { auth } from '@/auth';

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Get session and email from next-auth v5 using auth()
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const email = session.user.email;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    if (!user.email || typeof user.email !== 'string') {
      return NextResponse.json({ error: 'User email is missing or invalid.' }, { status: 400 });
    }

    // Generate GDPR data zip
    const zipBuffer = await exportUserData(user.id);
    
    // Type-safe buffer conversion with proper type guards
    let attachmentBuffer: Buffer;
    
    // Cast to unknown first to avoid TypeScript issues with instanceof
    const buffer = zipBuffer as unknown;
    
    if (Buffer.isBuffer(buffer)) {
      attachmentBuffer = buffer;
    } else if (buffer instanceof Uint8Array) {
      attachmentBuffer = Buffer.from(buffer);
    } else if (buffer && typeof buffer === 'object' && 'data' in buffer) {
      // Handle case where zipBuffer might be an object with data property
      const data = (buffer as any).data;
      if (Array.isArray(data)) {
        attachmentBuffer = Buffer.from(data);
      } else if (data instanceof Uint8Array) {
        attachmentBuffer = Buffer.from(data);
      } else if (Buffer.isBuffer(data)) {
        attachmentBuffer = data;
      } else {
        throw new Error('Invalid data format in zipBuffer.data');
      }
    } else {
      throw new Error('exportUserData returned unsupported format. Type: ' + typeof buffer);
    }

    const requestId = uuidv4();
    const fileName = `gdpr-data-${user.id}-${requestId}.zip`;

    // Render the React Email component to HTML string
    const html = await render(
      GDPRDataRequestEmail({
        userName: user.username || 'User',
        userEmail: user.email,
        requestDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        requestId,
      })
    );

    // Send email with zip attachment
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: user.email,
      subject: 'Your GDPR Data Request Received',
      html,
      attachments: [
        {
          filename: fileName,
          content: attachmentBuffer,
          contentType: 'application/zip',
        },
      ],
    });

    return NextResponse.json({ 
      success: true, 
      message: 'GDPR data request processed successfully',
      requestId 
    });
    
  } catch (err: any) {
    console.error('GDPR data request error:', err);
    return NextResponse.json({ 
      error: err.message || 'Internal server error.' 
    }, { status: 500 });
  }
}