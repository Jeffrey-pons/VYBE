import React, { PropsWithChildren } from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { useFilteredEvents } from '@/hooks/useFilteredEvents';
import { renderHook } from '@testing-library/react-native';

function makeDayRangeISO(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  const start = new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
  const end = new Date(y, (m ?? 1) - 1, d ?? 1, 23, 59, 59, 999);
  return { gte: start.toISOString(), lte: end.toISOString() };
}

const mockGetFiveUpcomingEvents = jest.fn();
jest.mock('@/services/eventService', () => ({
  getFiveUpcomingEvents: (...args: unknown[]) => mockGetFiveUpcomingEvents(...args),
}));

const mockSetLoading = jest.fn();
jest.mock('@/contexts/LoadingContext', () => ({
  useLoading: () => ({ setLoading: mockSetLoading }),
}));

// Petit composant de test pour lire la sortie du hook
const HookProbe: React.FC<PropsWithChildren<{ city: string; date: string; keyword: string }>> = ({
  city,
  date,
  keyword,
}) => {
  const { events, error } = useFilteredEvents({ city, date, keyword });
  return (
    <View>
      <Text testID="count">{events.length}</Text>
      {error ? <Text testID="error">{error}</Text> : null}
    </View>
  );
};

describe('useFilteredEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('appelle getFiveUpcomingEvents avec city/keyword et timings (quand date fourni)', async () => {
    mockGetFiveUpcomingEvents.mockResolvedValueOnce([]);

    renderHook(() => useFilteredEvents({ city: 'Paris', date: '2025-05-02', keyword: 'rock' }));

    const { gte, lte } = makeDayRangeISO('2025-05-02');

    await waitFor(() => {
      expect(mockGetFiveUpcomingEvents).toHaveBeenCalledWith({
        city: 'Paris',
        timings: { gte, lte },
        keyword: 'rock',
      });
    });
  });

  it('sur erreur -> setError + stop loading', async () => {
    mockGetFiveUpcomingEvents.mockRejectedValueOnce(new Error('boom'));

    const { getByTestId } = render(<HookProbe city="Lyon" date="" keyword="" />);

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(getByTestId('error').props.children).toBe('Erreur lors du chargement des événements.');
    });
  });
});
