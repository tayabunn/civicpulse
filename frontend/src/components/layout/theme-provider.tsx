'use client';

import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setTheme } from '../../store/uiSlice';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.ui.theme);
  const initialized = useRef(false);

  // Sync with localStorage on initial mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      try {
        const storedTheme = localStorage.getItem('civicpulse_theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
          if (storedTheme !== theme) {
            dispatch(setTheme(storedTheme));
          }
        }
      } catch {
        // Ignore localStorage access errors
      }
    }
  }, [dispatch, theme]);

  // Apply theme to document root and persist
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('civicpulse_theme', theme);
    } catch {
      // Ignore localStorage access errors
    }
  }, [theme]);

  return <>{children}</>;
}
