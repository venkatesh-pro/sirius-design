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
    subject: 'Sirius Contact Form',
    text: `
      Company : ${data.company}
      Name : ${data.name}
      Site Address : ${data.siteAddress}
      Postal Code : ${data.postalCode}
      Project Type : ${data.projectType}
      Email : ${data.emailAddress}
      Phone Number : ${data.phoneNumber}
    `,
  });

  return NextResponse.json({ success: true });
}
