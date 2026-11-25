import * as React from 'react';
import { render } from '@react-email/components';
import { Resend } from 'resend';
import { OneTimeCodeEmail } from '../emails/ledger/one-time-code';
import { brand } from '../emails/ledger/kit';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendVerificationEmail(
  toEmail: string,
  code: string,
  expiresInMinutes = 10
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY is not configured. Verification code:', code);
    return { success: false, error: 'Email service is not configured on server' };
  }

  const fromAddress = process.env.EMAIL_FROM || `${brand.name} <onboarding@resend.dev>`;

  try {
    // 1. Render the React Email template (NO ATTACHMENTS - PURE CLEAN EMAIL)
    const emailHtml = await render(
      React.createElement(OneTimeCodeEmail, {
        code,
        userEmail: toEmail,
        expiresInMinutes,
      })
    );

    // 2. Dispatch cleanly without email attachments
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [toEmail],
      subject: `[${brand.name}] ${code} is your authorization code`,
      html: emailHtml,
      text: `Your ${brand.name} one-time authorization code is: ${code}. This code expires in ${expiresInMinutes} minutes. Do not share it with anyone.`,
    });

    if (error) {
      console.error('[RESEND ERROR]', error);
      return { success: false, error: error.message };
    }

    console.log(`[RESEND SUCCESS] Sent clean ledger OTP email to ${toEmail}, id: ${data?.id}`);
    return { success: true };
  } catch (err: any) {
    console.error('[RESEND EXCEPTION]', err);
    return { success: false, error: err?.message || 'Failed to dispatch email' };
  }
}
