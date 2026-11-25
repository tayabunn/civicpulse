import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Font,
  Img,
} from '@react-email/components';
import { brand } from './kit';

export interface OneTimeCodeEmailProps {
  code: string;
  userEmail?: string;
  expiresInMinutes?: number;
}

export function OneTimeCodeEmail({
  code = '482913',
  userEmail = 'citizen@civicpulse.gov',
  expiresInMinutes = 10,
}: OneTimeCodeEmailProps) {
  const digits = code.split('');

  // 100% Reliable Public CDN Images (No attachments, pristine rendering in Gmail)
  const logoUrl = 'https://i.imgur.com/hhhJ5vh.png';
  const xIconUrl = 'https://img.icons8.com/ios-filled/50/ffffff/twitterx.png';
  const githubIconUrl = 'https://img.icons8.com/ios-filled/50/ffffff/github.png';
  const linkedinIconUrl = 'https://img.icons8.com/ios-filled/50/ffffff/linkedin.png';
  const youtubeIconUrl = 'https://img.icons8.com/ios-filled/50/ffffff/youtube-play.png';

  return (
    <Html lang="en">
      <Head>
        <title>{`${brand.name} One-Time Verification Code`}</title>
        <Font
          fontFamily="Manrope"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/manrope/v15/xn7gOHwg135P2I0cq54.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Manrope"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/manrope/v15/xn7gOHwg135P2I0cq54.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>
      <Preview>{`Your ${brand.name} verification code is ${code}`}</Preview>
      <Body style={mainBody}>
        <Container style={mainContainer}>
          {/* ============================================================== */}
          {/* TOP SECTION (WHITE CARD BACKGROUND)                            */}
          {/* ============================================================== */}
          <Section style={topSection}>
            {/* Header: Exact Official CivicPulse Logo from Imgur + Name & Open Link */}
            <table width="100%" cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: 'collapse', marginBottom: '32px' }}>
              <tbody>
                <tr>
                  <td align="left" style={{ verticalAlign: 'middle' }}>
                    <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          {/* Official CivicPulse Blue Geometric Logo directly from Imgur */}
                          <td style={{ verticalAlign: 'middle', paddingRight: '12px', lineHeight: 0 }}>
                            <Img
                              src={logoUrl}
                              alt="CivicPulse Logo"
                              width="26"
                              height="26"
                              style={{ display: 'block', border: 'none', outline: 'none' }}
                            />
                          </td>
                          <td style={{ verticalAlign: 'middle' }}>
                            <Text style={logoText}>{brand.name}</Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td align="right" style={{ verticalAlign: 'middle' }}>
                    <Link href={brand.url} style={topActionLink} target="_blank">
                      Open {brand.name} &rarr;
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Headline */}
            <Heading as="h1" style={headline}>
              Your code
            </Heading>

            {/* Instruction paragraph */}
            <Text style={instructionText}>
              Enter this code in the window where you started signing in.
            </Text>

            {/* DIGITS SECTION: Exact 1st image pill styling with guaranteed spacing */}
            <Section style={codeGridSection}>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ margin: '0', borderCollapse: 'separate' }}>
                <tbody>
                  <tr>
                    {digits.map((digit, index) => (
                      <React.Fragment key={index}>
                        <td
                          align="center"
                          valign="middle"
                          style={{
                            width: '50px',
                            height: '64px',
                            backgroundColor: '#F5F5F3',
                            border: '1px solid #E5E5E2',
                            borderRadius: '14px',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            padding: '0',
                          }}
                        >
                          <span
                            style={{
                              display: 'block',
                              width: '50px',
                              lineHeight: '64px',
                              fontSize: '28px',
                              fontWeight: 700,
                              fontFamily: brand.fonts.manrope,
                              color: '#0F172A',
                              textAlign: 'center',
                            }}
                          >
                            {digit}
                          </span>
                        </td>
                        {/* Explicit Spacer Gap between digit cells */}
                        {index < digits.length - 1 && (
                          <td style={{ width: '10px', minWidth: '10px', lineHeight: 0, fontSize: 0 }}>
                            &nbsp;
                          </td>
                        )}
                      </React.Fragment>
                    ))}
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Expiry Subtitle */}
            <Text style={expirySubtext}>
              Expires in {expiresInMinutes} minutes &bull; Works once, on that device only
            </Text>

            {/* Security Notice Card with Soft Green (#e2fa6b) Accent */}
            <Section style={securityNoticeCard}>
              <Text style={securityNoticeContent}>
                <strong style={{ color: '#0F172A', fontWeight: 700 }}>Never share this code.</strong>{' '}
                {brand.name} will never ask for it by phone, chat or email.{' '}
                Didn&apos;t try to sign in?{' '}
                <Link href={brand.supportUrl} style={secureAccountLink} target="_blank">
                  Secure your account
                </Link>.
              </Text>
            </Section>
          </Section>

          {/* ============================================================== */}
          {/* BLUE FOOTER SECTION (CIVICPULSE BRAND BLUE #305dff)            */}
          {/* ============================================================== */}
          <Section style={blueFooterSection}>
            {/* Logo in Footer */}
            <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: 'collapse', marginBottom: '16px' }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: 'middle', paddingRight: '10px', lineHeight: 0 }}>
                    <Img
                      src={logoUrl}
                      alt="CivicPulse Logo"
                      width="22"
                      height="22"
                      style={{
                        display: 'block',
                        border: 'none',
                        outline: 'none',
                        filter: 'brightness(0) invert(1)', // Pure crisp white version for blue footer
                      }}
                    />
                  </td>
                  <td style={{ verticalAlign: 'middle' }}>
                    <Text style={footerLogoText}>{brand.name}</Text>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Editorial Brand Bio */}
            <Text style={footerBioText}>
              {brand.name} is the municipal workspace where citizens and city teams collaborate to report and resolve civic infrastructure issues.
            </Text>

            {/* Social Media Links (X, GitHub, LinkedIn, YouTube) */}
            <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: 'collapse', marginBottom: '28px' }}>
              <tbody>
                <tr>
                  {/* X (Twitter) */}
                  <td style={socialIconCell}>
                    <Link href="https://twitter.com" target="_blank" style={socialIconLink}>
                      <Img
                        src={xIconUrl}
                        alt="X"
                        width="18"
                        height="18"
                        style={{ display: 'block', border: 'none' }}
                      />
                    </Link>
                  </td>
                  {/* GitHub */}
                  <td style={socialIconCell}>
                    <Link href="https://github.com" target="_blank" style={socialIconLink}>
                      <Img
                        src={githubIconUrl}
                        alt="GitHub"
                        width="18"
                        height="18"
                        style={{ display: 'block', border: 'none' }}
                      />
                    </Link>
                  </td>
                  {/* LinkedIn */}
                  <td style={socialIconCell}>
                    <Link href="https://linkedin.com" target="_blank" style={socialIconLink}>
                      <Img
                        src={linkedinIconUrl}
                        alt="LinkedIn"
                        width="18"
                        height="18"
                        style={{ display: 'block', border: 'none' }}
                      />
                    </Link>
                  </td>
                  {/* YouTube */}
                  <td style={socialIconCell}>
                    <Link href="https://youtube.com" target="_blank" style={socialIconLink}>
                      <Img
                        src={youtubeIconUrl}
                        alt="YouTube"
                        width="18"
                        height="18"
                        style={{ display: 'block', border: 'none' }}
                      />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Thin Horizontal Divider */}
            <Hr style={footerDivider} />

            {/* Legal Navigation Links */}
            <Text style={footerLegalNav}>
              <Link href={brand.supportUrl} style={footerLegalLink} target="_blank">
                Help center
              </Link>{' '}
              &bull;{' '}
              <Link href={`${brand.url}/privacy`} style={footerLegalLink} target="_blank">
                Privacy
              </Link>{' '}
              &bull;{' '}
              <Link href={`${brand.url}/terms`} style={footerLegalLink} target="_blank">
                Terms
              </Link>
            </Text>

            {/* Reason explanation */}
            <Text style={footerNoticeText}>
              You got this email because someone tried to sign in to {brand.name} with this address.
            </Text>

            {/* Copyright line */}
            <Text style={footerCopyrightText}>
              &copy; {new Date().getFullYear()} {brand.name} Labs Inc. &bull; Dhaka Smart City Infrastructure
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ============================================================================
// INLINE STYLES (EXACT 1ST IMAGE SPECIFICATION)
// ============================================================================

const mainBody: React.CSSProperties = {
  backgroundColor: '#F3F4F6',
  fontFamily: brand.fonts.manrope,
  padding: '40px 16px',
  margin: 0,
};

const mainContainer: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #E5E7EB',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
};

const topSection: React.CSSProperties = {
  padding: '42px 42px 32px 42px',
  backgroundColor: '#FFFFFF',
};

const logoText: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#0F172A',
  margin: 0,
  letterSpacing: '-0.3px',
};

const topActionLink: React.CSSProperties = {
  fontSize: '14px',
  color: '#475569',
  textDecoration: 'none',
  fontWeight: 500,
};

const headline: React.CSSProperties = {
  fontSize: '34px',
  fontWeight: 700,
  color: '#0F172A',
  letterSpacing: '-0.8px',
  margin: '0 0 12px 0',
  lineHeight: 1.15,
};

const instructionText: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.5',
  color: '#475569',
  margin: '0 0 28px 0',
};

// ---------------- DIGIT CELLS SECTION ---------------- //
const codeGridSection: React.CSSProperties = {
  margin: '0 0 18px 0',
};

const expirySubtext: React.CSSProperties = {
  fontSize: '13px',
  color: '#64748B',
  margin: '0 0 26px 0',
};

// ---------------- SECURITY NOTICE CARD ---------------- //
const securityNoticeCard: React.CSSProperties = {
  backgroundColor: 'rgba(226, 250, 107, 0.35)',
  border: '1px solid rgba(204, 232, 72, 0.8)',
  borderRadius: '12px',
  padding: '16px 20px',
};

const securityNoticeContent: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: '1.55',
  color: '#1C2810',
  margin: 0,
};

const secureAccountLink: React.CSSProperties = {
  color: '#0F172A',
  textDecoration: 'underline',
  fontWeight: 600,
};

// ---------------- VIBRANT CIVICPULSE BLUE FOOTER SECTION ---------------- //
const blueFooterSection: React.CSSProperties = {
  backgroundColor: '#305dff',
  padding: '36px 42px',
  color: '#FFFFFF',
  borderTop: '1px solid #244be0',
};

const footerLogoText: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  color: '#FFFFFF',
  margin: 0,
  letterSpacing: '-0.3px',
};

const footerBioText: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: 'rgba(255, 255, 255, 0.9)',
  margin: '0 0 22px 0',
  maxWidth: '440px',
};

const socialIconCell: React.CSSProperties = {
  paddingRight: '16px',
  verticalAlign: 'middle',
};

const socialIconLink: React.CSSProperties = {
  display: 'inline-block',
  textDecoration: 'none',
  lineHeight: 0,
};

const footerDivider: React.CSSProperties = {
  borderColor: 'rgba(255, 255, 255, 0.2)',
  margin: '22px 0',
};

const footerLegalNav: React.CSSProperties = {
  fontSize: '13px',
  color: 'rgba(255, 255, 255, 0.85)',
  margin: '0 0 10px 0',
};

const footerLegalLink: React.CSSProperties = {
  color: '#FFFFFF',
  textDecoration: 'none',
  fontWeight: 500,
};

const footerNoticeText: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: '1.5',
  color: 'rgba(255, 255, 255, 0.7)',
  margin: '0 0 6px 0',
};

const footerCopyrightText: React.CSSProperties = {
  fontSize: '12px',
  color: 'rgba(255, 255, 255, 0.65)',
  margin: 0,
};
