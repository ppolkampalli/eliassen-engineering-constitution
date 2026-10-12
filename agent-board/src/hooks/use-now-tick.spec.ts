import { act, renderHook } from '@testing-library/react';

import { useNowTick } from './use-now-tick';

describe('useNowTick', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts at 0 and increments once per interval', () => {
    const { result } = renderHook(() => useNowTick(30000));
    expect(result.current).toBe(0);

    act(() => {
      jest.advanceTimersByTime(30000);
    });
    expect(result.current).toBe(1);

    act(() => {
      jest.advanceTimersByTime(60000);
    });
    expect(result.current).toBe(3);
  });

  it('clears its interval on unmount', () => {
    const clearSpy = jest.spyOn(global, 'clearInterval');
    const { unmount } = renderHook(() => useNowTick(30000));
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });
});
