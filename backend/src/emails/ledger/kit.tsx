/**
 * Wensity Email Kit Configuration: Halden / Ledger Theme for CivicPulse
 * Sets brand identity, exact website color palette, typography and links.
 */

export const brand = {
  name: 'CivicPulse',
  tagline: 'Delivering real-time municipal telemetry and rapid urban infrastructure resolution.',
  url: 'https://civicpulse.gov',
  supportUrl: 'https://civicpulse.gov/#contact',
  supportEmail: 'support@civicpulse.gov',

  // Website Brand Color Palette
  colors: {
    // Upper Main Card Background (Clean White as in reference screenshot)
    canvasBg: '#FFFFFF',
    
    // Green marked sections in reference:
    // Soft Lime / Green (#e2fa6b) background with dark legible text
    softGreenBg: '#e2fa6b',
    softGreenBorder: '#cce848',
    softGreenNoticeBg: 'rgba(226, 250, 107, 0.35)',
    softGreenNoticeBorder: 'rgba(204, 232, 72, 0.6)',
    
    // Blue marked section in reference:
    // CivicPulse Main Blue (#305dff / #315CFF) background with crisp white typography
    footerBlueBg: '#305dff',
    footerBlueBorder: '#254ce0',
    footerTextPrimary: '#FFFFFF',
    footerTextSecondary: 'rgba(255, 255, 255, 0.85)',
    footerTextMuted: 'rgba(255, 255, 255, 0.65)',
    
    // Top Card & Typography
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    borderLight: '#E2E8F0',
  },

  fonts: {
    // Exact requested font: Manrope with system fallbacks
    manrope: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
};
