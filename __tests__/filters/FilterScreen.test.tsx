import React from 'react';
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react-native';

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: (v: string) => v,
}));

jest.mock('@/utils/citiesUtils', () => ({
  cities: [
    { label: 'Paris', value: 'Paris' },
    { label: 'Lyon', value: 'Lyon' },
  ],
}));

const mockEventListCard = jest.fn();

jest.mock('@/components/events/EventListCard', () => {
  const MockEventListCard = (props: { events: unknown[] }) => {
    mockEventListCard(props);
    return null;
  };
  return { __esModule: true, default: MockEventListCard };
});

// Mock useFilteredEvents
const mockUseFilteredEvents = jest.fn();
jest.mock('@/hooks/useFilteredEvents', () => ({
  useFilteredEvents: (args: unknown) => mockUseFilteredEvents(args),
}));

import FilterScreen from '@/app/(tabs)/explore';
import { useFilterStore } from '@/stores/useFilterStore';

const resetStore = () =>
  act(() =>
    useFilterStore.setState({
      search: '',
      date: '',
      city: '',
      keyword: '',
      showDatePicker: false,
      showCityInput: false,
    }),
  );

describe('FilterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetStore();
    mockEventListCard.mockClear();
  });

  it('affiche erreur quand hook renvoie error', () => {
    mockUseFilteredEvents.mockReturnValue({ events: [], error: 'Oups' });

    render(<FilterScreen />);
    expect(screen.getByText(/Erreur : Oups/i)).toBeTruthy();
  });

  it('recherche: on saisit un mot-clé -> store.keyword mis à jour', () => {
    mockUseFilteredEvents.mockReturnValue({ events: [], error: null });

    render(<FilterScreen />);
    const input = screen.getByLabelText('Champ pour entrer la recherche');
    fireEvent.changeText(input, 'rock');

    expect(useFilterStore.getState().keyword).toBe('rock');
  });

  it('ouverture modale villes → sélection Lyon → store.city="Lyon" & fermeture', async () => {
    mockUseFilteredEvents.mockReturnValue({ events: [], error: null });

    render(<FilterScreen />);

    fireEvent.press(screen.getByLabelText('Ouvrir le sélecteur de ville'));
    await waitFor(() => expect(screen.getByText('Lyon')).toBeTruthy());
    fireEvent.press(screen.getByText('Lyon'));

    expect(useFilterStore.getState().city).toBe('Lyon');
    expect(useFilterStore.getState().showCityInput).toBe(false);
  });

  it('bouton "Réinitialiser le lieu" remet city="" et ferme', async () => {
    mockUseFilteredEvents.mockReturnValue({ events: [], error: null });

    act(() => useFilterStore.getState().setShowCityInput(true));

    render(<FilterScreen />);

    await waitFor(() => expect(screen.getByLabelText('Réinitialiser le lieu')).toBeTruthy());
    fireEvent.press(screen.getByLabelText('Réinitialiser le lieu'));

    expect(useFilterStore.getState().city).toBe('');
    expect(useFilterStore.getState().showCityInput).toBe(false);
  });

  it('filtre local: city/date/keyword réduisent la liste avant envoi à EventList', () => {
    // 3 events → 1 seul doit passer
    mockUseFilteredEvents.mockReturnValue({
      error: null,
      events: [
        {
          title: { fr: 'Soirée Electro' },
          dateRange: { fr: 'Vendredi 2 mai 2025 - 23:00' },
          location: { city: 'Paris', name: 'Club' },
          keywords: { fr: ['electro', 'night'] },
        },
        {
          title: { fr: 'Expo' },
          dateRange: { fr: 'Vendredi 2 mai 2025 - 23:00' },
          location: { city: 'Lyon', name: 'Musée' },
          keywords: { fr: ['art'] },
        },
        {
          title: { fr: 'Rock Show' },
          dateRange: { fr: 'Samedi 3 mai 2025 - 20:00' },
          location: { city: 'Paris', name: 'Zénith' },
          keywords: { fr: ['rock'] },
        },
      ],
    });

    act(() => {
      useFilterStore.getState().setCity('Paris');
      useFilterStore.getState().setDate('Vendredi 2 mai 2025');
      useFilterStore.getState().setKeyword('electro');
    });

    render(<FilterScreen />);

    expect(mockEventListCard).toHaveBeenCalled();

    // Récupération des events du dernier appel
    const lastCall = mockEventListCard.mock.calls[mockEventListCard.mock.calls.length - 1];
    const events = lastCall?.[0]?.events || [];
    expect(events.length).toBe(1);

    // Optionnel: vérification plus précise
    expect(events[0]).toMatchObject({
      title: { fr: 'Soirée Electro' },
    });
  });

  it('affiche "Chargement..." si le hook renvoie loading', () => {
    mockUseFilteredEvents.mockReturnValue({ events: [], error: null, loading: true });

    render(<FilterScreen />);
    expect(screen.getByText('Chargement...')).toBeTruthy();
  });
});

describe("FilterScreen - Tests d'intégration améliorés", () => {
  it('workflow utilisateur complet: recherche → sélection ville → filtrage', async () => {
    const mockEvents = [
      {
        title: { fr: 'Concert Rock Paris' },
        location: { city: 'Paris' },
        dateRange: { fr: 'Vendredi 2 mai 2025 - 20:00' },
        keywords: { fr: ['rock', 'live'] },
      },
      {
        title: { fr: 'Expo Art Lyon' },
        location: { city: 'Lyon' },
        dateRange: { fr: 'Samedi 3 mai 2025 - 14:00' },
        keywords: { fr: ['art', 'exposition'] },
      },
    ];

    mockUseFilteredEvents.mockReturnValue({ events: mockEvents, error: null });

    render(<FilterScreen />);

    const searchInput = screen.getByLabelText('Champ pour entrer la recherche');
    fireEvent.changeText(searchInput, 'rock');
    expect(useFilterStore.getState().keyword).toBe('rock');

    fireEvent.press(screen.getByLabelText('Ouvrir le sélecteur de ville'));
    await waitFor(() => expect(screen.getByText('Paris')).toBeTruthy());
    fireEvent.press(screen.getByText('Paris'));

    expect(useFilterStore.getState().city).toBe('Paris');

    await waitFor(() => {
      const lastCall = mockEventListCard.mock.calls[mockEventListCard.mock.calls.length - 1];
      const filteredEvents = lastCall?.[0]?.events || [];

      // Doit ne garder que l'événement Rock à Paris
      expect(filteredEvents).toHaveLength(1);
      expect(filteredEvents[0].title.fr).toBe('Concert Rock Paris');
    });
  });

  it("gère les grandes listes d'événements sans ralentissement", async () => {
    const largeEventList = Array.from({ length: 1000 }, (_, i) => ({
      title: { fr: `Event ${i}` },
      location: { city: i % 2 === 0 ? 'Paris' : 'Lyon' },
      dateRange: { fr: 'Vendredi 2 mai 2025 - 20:00' },
      keywords: { fr: ['test'] },
    }));

    mockUseFilteredEvents.mockReturnValue({ events: largeEventList, error: null });

    const startTime = performance.now();
    render(<FilterScreen />);

    act(() => {
      useFilterStore.getState().setCity('Paris');
      useFilterStore.getState().setKeyword('test');
    });

    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(100);

    const lastCall = mockEventListCard.mock.calls[mockEventListCard.mock.calls.length - 1];
    const events = lastCall?.[0]?.events || [];
    expect(events).toHaveLength(500); // Moitié des événements (Paris seulement)
  });
});
