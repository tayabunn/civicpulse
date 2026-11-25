const fs = require('fs');
const { Resend } = require('resend');
require('dotenv').config({ path: './backend/.env' });
const resend = new Resend(process.env.RESEND_API_KEY);

const blueLogo = fs.readFileSync('./frontend/public/email-logo-blue.png');
const x = fs.readFileSync('./frontend/public/email-x.png');

async function run() {
  const r = await resend.emails.send({
    from: 'CivicPulse <onboarding@resend.dev>',
    to: ['tayabunnesa@gmail.com'],
    subject: 'Attachment CID Test',
    html: '<p>Logo: <img src="cid:logo" width="28" height="28" /> X: <img src="cid:x" width="18" height="18" /></p>',
    attachments: [
      { filename: 'logo.png', content: blueLogo, cid: 'logo' },
      { filename: 'x.png', content: x, cid: 'x' },
    ],
  });
  console.log('RESULT:', r);
}
run();
