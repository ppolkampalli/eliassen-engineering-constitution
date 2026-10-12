import { useEffect, useState } from 'react';

/**
 * Forces a re-render every `intervalMs` by incrementing an internal counter.
 * Used by <Card> so "Xm ago" labels keep moving even when the underlying
 * log is quiet, without re-fetching or re-deriving the whole board.
 */
export function useNowTick(intervalMs: number): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((value) => value + 1);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return tick;
}
