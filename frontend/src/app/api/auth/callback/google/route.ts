import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  if (error || !code) {
    console.error('Google auth error or denied:', error);
    return NextResponse.redirect(`${appUrl}/login?error=google_auth_failed`);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    const redirectUri = `${appUrl}/api/auth/callback/google`;

    // 1. Exchange code for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Failed to exchange Google code:', tokenData);
      return NextResponse.redirect(`${appUrl}/login?error=token_exchange_failed`);
    }

    // 2. Fetch user profile from Google
    const userProfileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userProfileRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${appUrl}/login?error=no_email_provided`);
    }

    // 3. Register or authenticate with backend
    const backendRes = await fetch(`${apiUrl}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: googleUser.email,
        name: googleUser.name,
        avatarUrl: googleUser.picture,
      }),
    });

    const authData = await backendRes.json();
    if (!backendRes.ok || !authData.success) {
      return NextResponse.redirect(`${appUrl}/login?error=backend_auth_failed`);
    }

    // 4. Redirect to citizen dashboard with auth payload
    const redirectUrl = new URL(`${appUrl}/citizen`);
    redirectUrl.searchParams.set('google_auth', 'success');
    redirectUrl.searchParams.set('token', authData.token);
    redirectUrl.searchParams.set('userData', JSON.stringify(authData.user));

    const response = NextResponse.redirect(redirectUrl.toString());
    response.cookies.set('civicpulse_session', authData.token, {
      path: '/',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error('Exception during Google OAuth callback:', err);
    return NextResponse.redirect(`${appUrl}/login?error=internal_oauth_error`);
  }
}
