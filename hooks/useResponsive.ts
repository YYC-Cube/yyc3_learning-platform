import { useState, useEffect } from 'react';
import type { Breakpoint, ResponsiveState } from '../types';

export type { Breakpoint, ResponsiveState };

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    breakpoint: 'desktop',
    screenWidth: 1200
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      let breakpoint: Breakpoint;
      let isMobile = false;
      let isTablet = false;
      let isDesktop = false;

      if (width <= 768) {
        breakpoint = 'mobile';
        isMobile = true;
      } else if (width <= 1024) {
        breakpoint = 'tablet';
        isTablet = true;
      } else {
        breakpoint = 'desktop';
        isDesktop = true;
      }

      setState({
        isMobile,
        isTablet,
        isDesktop,
        breakpoint,
        screenWidth: width
      });
    };

    // Initial check
    updateBreakpoint();

    // Add event listener
    window.addEventListener('resize', updateBreakpoint);

    // Cleanup
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return state;
}

export const breakpoints = {
  mobile: 768,
  tablet: 1024
} as const;

export const gridColumns = {
  mobile: 4,
  tablet: 8,
  desktop: 12
} as const;

export const spacing = {
  mobile: {
    padding: '16px',
    margin: '12px',
    gap: '12px'
  },
  tablet: {
    padding: '24px',
    margin: '16px',
    gap: '16px'
  },
  desktop: {
    padding: '32px',
    margin: '24px',
    gap: '24px'
  }
} as const;