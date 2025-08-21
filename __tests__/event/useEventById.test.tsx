import { renderHook, act } from '@testing-library/react-native';
import { useEventById } from '@/hooks/useEventById';
import * as svc from '@/services/eventService';

jest.mock('@/services/eventService', () => ({
  getEventDetails: jest.fn(),
}));

it('OK -> remonte event & stop loading', async () => {
  (svc.getEventDetails as jest.Mock).mockResolvedValue({ id: 'ev1' });
  const { result } = renderHook(() => useEventById('ag1', 'ev1'));
  await act(async () => {});
  expect(result.current.event).toEqual({ id: 'ev1' });
  expect(result.current.error).toBeNull?.();
});

it('erreur -> set error', async () => {
  (svc.getEventDetails as jest.Mock).mockRejectedValue(new Error('boom'));
  const { result } = renderHook(() => useEventById('ag1', 'ev1'));
  await act(async () => {});
  expect(result.current.error).toBeTruthy();
});
