import React from 'react';
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react-native';

jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: (v: string) => v, 
}));

// Mock de la liste des villes (petite liste)
jest.mock('@/utils/citiesUtils', () => ({
  cities: [
    { label: 'Paris', value: 'Paris' },
    { label: 'Lyon', value: 'Lyon' },
  ],
}));

// Mock EventListCard → on affiche juste le nombre d’events reçus (en NOMBRE, pas string)
jest.mock('@/components/events/EventListCard', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockEventListCard = ({ events }: { events: unknown[] }) =>
    React.createElement(Text, { testID: 'events-count' }, events.length);

  return { __esModule: true, default: MockEventListCard };
});

// Mock useFilteredEvents → on contrôle les events renvoyés / erreurs
const mockUseFilteredEvents = jest.fn();
jest.mock('@/hooks/useFilteredEvents', () => ({
  useFilteredEvents: (args: unknown) => mockUseFilteredEvents(args),
}));

// 👉 ADAPTE ce chemin vers ton écran FilterScreen si besoin
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

    // Ouvre la modale
    fireEvent.press(screen.getByLabelText('Ouvrir le sélecteur de ville'));
    // Clique sur "Lyon"
    await waitFor(() => expect(screen.getByText('Lyon')).toBeTruthy());
    fireEvent.press(screen.getByText('Lyon'));

    expect(useFilterStore.getState().city).toBe('Lyon');
    expect(useFilterStore.getState().showCityInput).toBe(false);
  });

  it('bouton "Réinitialiser le lieu" remet city="" et ferme', async () => {
    mockUseFilteredEvents.mockReturnValue({ events: [], error: null });

    // Ouvre directement la modale
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

    // On met des filtres stricts
    act(() => {
      useFilterStore.getState().setCity('Paris');
      useFilterStore.getState().setDate('Vendredi 2 mai 2025'); // correspond à un include() dans dateRange.fr
      useFilterStore.getState().setKeyword('electro');
    });

    const { getByTestId } = render(<FilterScreen />);
    // Un seul event matche: Paris + date "Vendredi 2 mai 2025" + keyword "electro"
    expect(getByTestId('events-count').props.children).toBe(1);
  });

  it('affiche "Chargement..." si le hook renvoie loading', () => {
    // même si ton hook ne renvoie pas loading en prod, FilterScreen le lit — on le fournit ici
    mockUseFilteredEvents.mockReturnValue({ events: [], error: null, loading: true });

    render(<FilterScreen />);
    expect(screen.getByText('Chargement...')).toBeTruthy();
  });
});