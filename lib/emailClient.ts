import nodemailer from 'nodemailer';

// Nodemailer transporter config for Zoho SMTP
export const transporter = nodemailer.createTransport({
	host: 'smtppro.zoho.com',
	port: 465,
	secure: true,
	auth: {
		user: 'noreply@purrquinox.com',
		pass: process.env.ZOHO_SMTP_PASSWORD
	}
});

export const FROM_EMAIL = 'noreply@purrquinox.com';
