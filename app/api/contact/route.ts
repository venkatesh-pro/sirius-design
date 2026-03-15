import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('EMAIL_PASSWORD', process.env.EMAIL_PASSWORD);

  const data = await req.json();

  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    // secure: true,
    auth: {
      user: process.env.LOGIN,
      pass: process.env.PASSWORD,
    },
  });

  const upgrades =
    data?.configurator?.optionalUpgrades?.length > 0
      ? data.configurator.optionalUpgrades.join(', ')
      : 'None';

  const formattedPrice = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(data?.configurator?.totalPrice);

  await transporter.sendMail({
    from: 'contact@siriusbuildings.com',
    to: data.emailAddress,
    subject: 'Sirius Contact Form',
    text: `
      CONTACT DETAILS
      -----------------------
      Company : ${data.company}
      Name : ${data.name}
      Site Address : ${data.siteAddress}
      Postal Code : ${data.postalCode}
      Project Type : ${data.projectType}
      Email : ${data.emailAddress}
      Phone Number : ${data.phoneNumber}

      CONFIGURATION
      -----------------------
      Size: ${data.configurator.size}
      Exterior Finish: ${data.configurator.exteriorFinish}
      Interior Finish: ${data.configurator.interiorFinish}
      Upgrades: ${upgrades}

      TOTAL PRICE
      -----------------------
      A$${formattedPrice}

    `,
  });

  return NextResponse.json({ success: true });
}
