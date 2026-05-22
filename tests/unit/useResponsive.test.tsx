// =============================================================================
// YYC3-Learning-Platform — useResponsive Hook Tests
// =============================================================================
// Tests breakpoint detection, responsive state, and exported constants.
// =============================================================================

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResponsive, breakpoints, gridColumns, spacing } from '../../hooks/useResponsive';
import { mockWindowResize } from '../setup';

describe('useResponsive Hook', () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  // ─── Mobile Breakpoint ──────────────────────────────────────────────────

  it('should detect mobile breakpoint (width ≤ 768)', () => {
    mockWindowResize(375);
    const { result } = renderHook(() => useResponsive());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.breakpoint).toBe('mobile');
    expect(result.current.screenWidth).toBe(375);
  });

  it('should detect mobile at exact boundary (768)', () => {
    mockWindowResize(768);
    const { result } = renderHook(() => useResponsive());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.breakpoint).toBe('mobile');
  });

  it('should detect mobile at minimum viewport (320)', () => {
    mockWindowResize(320);
    const { result } = renderHook(() => useResponsive());

    expect(result.current.isMobile).toBe(true);
  });

  // ─── Tablet Breakpoint ─────────────────────────────────────────────────

  it('should detect tablet breakpoint (769–1024)', () => {
    mockWindowResize(900);
    const { result } = renderHook(() => useResponsive());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.breakpoint).toBe('tablet');
  });

  it('should detect tablet at exact boundary (1024)', () => {
    mockWindowResize(1024);
    const { result } = renderHook(() => useResponsive());

    expect(result.current.isTablet).toBe(true);
    expect(result.current.breakpoint).toBe('tablet');
  });

  it('should detect tablet at lower boundary (769)', () => {
    mockWindowResize(769);
    const { result } = renderHook(() => useResponsive());

    expect(result.current.isTablet).toBe(true);
  });

  // ─── Desktop Breakpoint ────────────────────────────────────────────────

  it('should detect desktop breakpoint (> 1024)', () => {
    mockWindowResize(1440);
    const { result } = renderHook(() => useResponsive());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.breakpoint).toBe('desktop');
  });

  it('should detect desktop at lower boundary (1025)', () => {
    mockWindowResize(1025);
    const { result } = renderHook(() => useResponsive());

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.breakpoint).toBe('desktop');
  });

  it('should handle ultra-wide viewport (3840)', () => {
    mockWindowResize(3840);
    const { result } = renderHook(() => useResponsive());

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.screenWidth).toBe(3840);
  });

  // ─── Resize Transitions ───────────────────────────────────────────────

  it('should react to window resize events', () => {
    mockWindowResize(1440);
    const { result } = renderHook(() => useResponsive());

    expect(result.current.breakpoint).toBe('desktop');

    act(() => {
      mockWindowResize(500);
    });

    expect(result.current.breakpoint).toBe('mobile');
    expect(result.current.isMobile).toBe(true);
  });

  it('should transition mobile → tablet → desktop', () => {
    mockWindowResize(375);
    const { result } = renderHook(() => useResponsive());
    expect(result.current.breakpoint).toBe('mobile');

    act(() => mockWindowResize(900));
    expect(result.current.breakpoint).toBe('tablet');

    act(() => mockWindowResize(1440));
    expect(result.current.breakpoint).toBe('desktop');
  });

  // ─── Cleanup ──────────────────────────────────────────────────────────

  it('should clean up resize listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useResponsive());

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeSpy.mockRestore();
  });

  // ─── Mutual Exclusivity ───────────────────────────────────────────────

  it('should ensure only one boolean is true at a time', () => {
    for (const width of [320, 375, 768, 769, 900, 1024, 1025, 1440, 1920]) {
      mockWindowResize(width);
      const { result } = renderHook(() => useResponsive());
      const booleans = [result.current.isMobile, result.current.isTablet, result.current.isDesktop];
      const trueCount = booleans.filter(Boolean).length;
      expect(trueCount).toBe(1);
    }
  });
});

// =============================================================================
// Exported Constants
// =============================================================================

describe('Responsive Constants', () => {
  it('breakpoints should define mobile and tablet thresholds', () => {
    expect(breakpoints.mobile).toBe(768);
    expect(breakpoints.tablet).toBe(1024);
  });

  it('gridColumns should define columns for all breakpoints', () => {
    expect(gridColumns.mobile).toBe(4);
    expect(gridColumns.tablet).toBe(8);
    expect(gridColumns.desktop).toBe(12);
  });

  it('spacing should define padding, margin, gap for all breakpoints', () => {
    for (const bp of ['mobile', 'tablet', 'desktop'] as const) {
      expect(spacing[bp]).toHaveProperty('padding');
      expect(spacing[bp]).toHaveProperty('margin');
      expect(spacing[bp]).toHaveProperty('gap');
    }
  });

  it('spacing values should increase with breakpoint size', () => {
    const paddings = [spacing.mobile.padding, spacing.tablet.padding, spacing.desktop.padding];
    const numericPaddings = paddings.map(p => parseInt(p));
    expect(numericPaddings[0]).toBeLessThan(numericPaddings[1]);
    expect(numericPaddings[1]).toBeLessThan(numericPaddings[2]);
  });
});
