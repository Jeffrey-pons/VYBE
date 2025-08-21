import React, { PropsWithChildren } from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { useFilteredEvents } from '@/hooks/useFilteredEvents';

// ⚙️ Mocks
const mockGetFiveUpcomingEvents = jest.fn();
jest.mock('@/services/eventService', () => ({
  getFiveUpcomingEvents: (...args: unknown[]) => mockGetFiveUpcomingEvents(...args),
}));

const mockSetLoading = jest.fn();
jest.mock('@/contexts/LoadingContext', () => ({
  useLoading: () => ({ setLoading: mockSetLoading }),
}));

// Petit composant de test pour lire la sortie du hook
const HookProbe: React.FC<
  PropsWithChildren<{ city: string; date: string; keyword: string }>
> = ({ city, date, keyword }) => {
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
    mockGetFiveUpcomingEvents.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);

    const { getByTestId, rerender } = render(
      <HookProbe city="Paris" date="2025-05-02" keyword="rock" />
    );

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    expect(getByTestId('count').props.children).toBe(2);

    // Vérifie les filtres construits par le hook
    expect(mockGetFiveUpcomingEvents).toHaveBeenCalledWith({
      city: 'Paris',
      timings: { gte: '2025-05-02T00:00:00Z', lte: '2025-05-02T23:59:59Z' },
      keyword: 'rock',
    });

    // Re-render → nouveau keyword
    mockGetFiveUpcomingEvents.mockResolvedValueOnce([{ id: 3 }]);
    rerender(<HookProbe city="Paris" date="2025-05-02" keyword="jazz" />);

    await waitFor(() => {
      expect(mockGetFiveUpcomingEvents).toHaveBeenCalledWith({
        city: 'Paris',
        timings: { gte: '2025-05-02T00:00:00Z', lte: '2025-05-02T23:59:59Z' },
        keyword: 'jazz',
      });
    });
  });

  it('sur erreur -> setError + stop loading', async () => {
    mockGetFiveUpcomingEvents.mockRejectedValueOnce(new Error('boom'));

    const { getByTestId } = render(
      <HookProbe city="Lyon" date="" keyword="" />
    );

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(getByTestId('error').props.children).toBe('Erreur lors du chargement des événements.');
    });
  });
});
