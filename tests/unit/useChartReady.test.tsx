// =============================================================================
// YYC3-Learning-Platform — useChartReady Hook Tests
// =============================================================================
// Tests chart container readiness detection via ResizeObserver & fallback polling.
// =============================================================================

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChartReady } from '../../hooks/useChartReady';

describe('useChartReady Hook', () => {
  let originalResizeObserver: typeof ResizeObserver;

  beforeEach(() => {
    originalResizeObserver = globalThis.ResizeObserver;
    vi.useFakeTimers();
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;
    vi.useRealTimers();
  });

  // ─── Immediate Readiness ──────────────────────────────────────────────

  it('should be immediately ready when container has non-zero dimensions', () => {
    const { result } = renderHook(() => useChartReady());

    const mockDiv = document.createElement('div');
    Object.defineProperty(mockDiv, 'clientWidth', { value: 400 });
    Object.defineProperty(mockDiv, 'clientHeight', { value: 300 });

    act(() => {
      result.current.containerRef(mockDiv);
    });

    expect(result.current.isReady).toBe(true);
  });

  // ─── Not Ready Initially ──────────────────────────────────────────────

  it('should not be ready when container has zero dimensions', () => {
    // Provide a mock ResizeObserver that doesn't immediately trigger
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;

    const { result } = renderHook(() => useChartReady());

    const mockDiv = document.createElement('div');
    Object.defineProperty(mockDiv, 'clientWidth', { value: 0 });
    Object.defineProperty(mockDiv, 'clientHeight', { value: 0 });

    act(() => {
      result.current.containerRef(mockDiv);
    });

    expect(result.current.isReady).toBe(false);
  });

  // ─── Reset on Null Node ───────────────────────────────────────────────

  it('should reset isReady when node is removed (null)', () => {
    const { result } = renderHook(() => useChartReady());

    // First, set a valid node
    const mockDiv = document.createElement('div');
    Object.defineProperty(mockDiv, 'clientWidth', { value: 400 });
    Object.defineProperty(mockDiv, 'clientHeight', { value: 300 });

    act(() => {
      result.current.containerRef(mockDiv);
    });
    expect(result.current.isReady).toBe(true);

    // Remove the node
    act(() => {
      result.current.containerRef(null);
    });
    expect(result.current.isReady).toBe(false);
  });

  // ─── ResizeObserver Path ──────────────────────────────────────────────

  it('should use ResizeObserver to detect dimension changes', () => {
    let observeCallback: ResizeObserverCallback | null = null;

    globalThis.ResizeObserver = class {
      constructor(callback: ResizeObserverCallback) {
        observeCallback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;

    const { result } = renderHook(() => useChartReady(10)); // 10ms debounce

    const mockDiv = document.createElement('div');
    Object.defineProperty(mockDiv, 'clientWidth', { value: 0 });
    Object.defineProperty(mockDiv, 'clientHeight', { value: 0 });

    act(() => {
      result.current.containerRef(mockDiv);
    });
    expect(result.current.isReady).toBe(false);

    // Simulate the element gaining size
    Object.defineProperty(mockDiv, 'clientWidth', { value: 500, configurable: true });
    Object.defineProperty(mockDiv, 'clientHeight', { value: 400, configurable: true });

    act(() => {
      if (observeCallback) {
        observeCallback(
          [{ target: mockDiv }] as unknown as ResizeObserverEntry[],
          {} as ResizeObserver
        );
      }
      vi.advanceTimersByTime(20); // past debounce
    });

    expect(result.current.isReady).toBe(true);
  });

  // ─── Polling Fallback ─────────────────────────────────────────────────

  it('should fall back to polling when ResizeObserver is unavailable', () => {
    // Remove ResizeObserver
    (globalThis as Record<string, unknown>).ResizeObserver = undefined;

    const { result } = renderHook(() => useChartReady());

    const mockDiv = document.createElement('div');
    Object.defineProperty(mockDiv, 'clientWidth', { value: 0, configurable: true });
    Object.defineProperty(mockDiv, 'clientHeight', { value: 0, configurable: true });

    act(() => {
      result.current.containerRef(mockDiv);
    });
    expect(result.current.isReady).toBe(false);

    // Simulate element gaining size after some polls
    Object.defineProperty(mockDiv, 'clientWidth', { value: 300, configurable: true });
    Object.defineProperty(mockDiv, 'clientHeight', { value: 200, configurable: true });

    act(() => {
      vi.advanceTimersByTime(200); // 2 poll cycles at 100ms
    });

    expect(result.current.isReady).toBe(true);
  });

  // ─── Cleanup on Unmount ───────────────────────────────────────────────

  it('should clean up observers and timers on unmount', () => {
    let disconnectCalled = false;

    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() { disconnectCalled = true; }
    } as unknown as typeof ResizeObserver;

    const { result, unmount } = renderHook(() => useChartReady());

    const mockDiv = document.createElement('div');
    Object.defineProperty(mockDiv, 'clientWidth', { value: 0 });
    Object.defineProperty(mockDiv, 'clientHeight', { value: 0 });

    act(() => {
      result.current.containerRef(mockDiv);
    });

    unmount();

    // The disconnect should be called during cleanup
    // (either through containerRef(null) or useEffect cleanup)
    expect(disconnectCalled).toBe(true);
  });

  // ─── Edge: Width > 0 but Height = 0 ──────────────────────────────────

  it('should not be ready when only width is non-zero', () => {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;

    const { result } = renderHook(() => useChartReady());
    const mockDiv = document.createElement('div');
    Object.defineProperty(mockDiv, 'clientWidth', { value: 400 });
    Object.defineProperty(mockDiv, 'clientHeight', { value: 0 });

    act(() => {
      result.current.containerRef(mockDiv);
    });
    expect(result.current.isReady).toBe(false);
  });

  it('should not be ready when only height is non-zero', () => {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;

    const { result } = renderHook(() => useChartReady());
    const mockDiv = document.createElement('div');
    Object.defineProperty(mockDiv, 'clientWidth', { value: 0 });
    Object.defineProperty(mockDiv, 'clientHeight', { value: 300 });

    act(() => {
      result.current.containerRef(mockDiv);
    });
    expect(result.current.isReady).toBe(false);
  });
});
