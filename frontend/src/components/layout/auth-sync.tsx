'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';

export function AuthSync() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const googleAuth = searchParams.get('google_auth');
    const token = searchParams.get('token');
    const userData = searchParams.get('userData');

    if (googleAuth === 'success' && token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        dispatch(setCredentials({ user, token }));
        // Remove params from URL bar cleanly
        router.replace(window.location.pathname);
      } catch (e) {
        console.error('Failed to parse Google user payload:', e);
      }
    }
  }, [searchParams, dispatch, router]);

  return null;
}
