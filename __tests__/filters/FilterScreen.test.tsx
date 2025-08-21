import React from 'react';
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react-native';

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
    })
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

    await waitFor(() =>
      expect(screen.getByLabelText('Réinitialiser le lieu')).toBeTruthy()
    );
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
      title: { fr: 'Soirée Electro' }
    });
  });

  it('affiche "Chargement..." si le hook renvoie loading', () => {
    mockUseFilteredEvents.mockReturnValue({ events: [], error: null, loading: true });

    render(<FilterScreen />);
    expect(screen.getByText('Chargement...')).toBeTruthy();
  });
});