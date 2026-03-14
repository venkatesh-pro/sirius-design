import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('EMAIL_PASSWORD', process.env.EMAIL_PASSWORD);

  const data = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'contact@siriusbuildings.com',
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: 'contact@siriusbuildings.com',
    to: 'programervenkatesh@gmail.com',
    subject: 'New Form Submission',
    text: `
Name: ${data.name}
Email: ${data.email}
Message: ${data.message}
    `,
  });

  return NextResponse.json({ success: true });
}
