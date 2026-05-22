import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook to safely mount Recharts charts inside animated/lazy-sized containers.
 * Returns a ref callback to attach to the chart wrapper div and a boolean `isReady`
 * that becomes `true` only after the container has a non-zero width AND height,
 * avoiding the "width(0) and height(0) should be greater than 0" console error.
 *
 * Uses a callback ref pattern so it works correctly even when the target element
 * mounts late (e.g. inside a modal or AnimatePresence).
 */

interface UseChartReadyReturn {
  containerRef: React.RefCallback<HTMLDivElement>;
  isReady: boolean;
}

export function useChartReady(debounceMs = 50): UseChartReadyReturn {
  const [isReady, setIsReady] = useState(false);
  const observerRef = useRef<ResizeObserver | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup helper
  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Clean up previous observers
      cleanup();

      if (!node) {
        // Element was removed — reset readiness so chart re-checks when remounted
        setIsReady(false);
        return;
      }

      // Immediate size check
      const { clientWidth, clientHeight } = node;
      if (clientWidth > 0 && clientHeight > 0) {
        setIsReady(true);
        return;
      }

      // Use ResizeObserver when available
      if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver((entries) => {
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            const target = entries[0]?.target as HTMLElement | undefined;
            if (target && target.clientWidth > 0 && target.clientHeight > 0) {
              setIsReady(true);
              observer.disconnect();
              observerRef.current = null;
            }
          }, debounceMs);
        });
        observer.observe(node);
        observerRef.current = observer;
      } else {
        // Fallback: poll every 100ms
        intervalRef.current = setInterval(() => {
          if (node.clientWidth > 0 && node.clientHeight > 0) {
            setIsReady(true);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }, 100);
      }
    },
    [cleanup, debounceMs],
  );

  return { containerRef, isReady };
}
