import { renderHook, act } from '@testing-library/react-native';
import { useDebounce } from '@/hooks/useDebounce';

jest.useFakeTimers();

it('renvoie la valeur après 500ms', () => {
  const { result, rerender } = renderHook(({ v }) => useDebounce(v, 500), {
    initialProps: { v: 'a' },
  });

  expect(result.current).toBe('a'); // initial
  rerender({ v: 'abc' });

  // avant 500ms -> pas encore
  act(() => { jest.advanceTimersByTime(499); });
  expect(result.current).toBe('a');

  // après 500ms -> updated
  act(() => { jest.advanceTimersByTime(1); });
  expect(result.current).toBe('abc');
});

it('remplace le timer si la valeur change avant 500ms', () => {
  const { result, rerender } = renderHook(({ v }) => useDebounce(v, 500), {
    initialProps: { v: 'a' },
  });

  rerender({ v: 'b' });
  act(() => { jest.advanceTimersByTime(300); });
  rerender({ v: 'c' }); // reset debounce
  act(() => { jest.advanceTimersByTime(499); });
  expect(result.current).toBe('a'); // toujours pas c
  act(() => { jest.advanceTimersByTime(1); });
  expect(result.current).toBe('c');
});
