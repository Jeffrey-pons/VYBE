import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';

jest.mock('@/utils/imagesUtils', () => ({
  iconInformation: 1,
  iconPlace: 1,
  iconAccessibility: 1,
  iconStatus: 1,
  iconWordKey: 1,
  iconChoiceLocation: 1,
  iconApi: 1,
  iconCroix: 1,
  iconFavorite: 1,
  iconLink: 1,
  iconArrowDown: 1,
  iconArrowUp: 1,
}));

jest.mock('react-native-maps', () => {
  const React = jest.requireActual('react') as typeof import('react');
  const { View } = jest.requireActual('react-native') as typeof import('react-native');
  const MapView = ({ children }: { children?: React.ReactNode }) => (
    <View testID="map">{children}</View>
  );
  const Marker = () => <View testID="marker" />;
  return { __esModule: true, default: MapView, Marker };
});

// --- Mock format durée + prix
jest.mock('@/utils/dateUtils', () => ({
  getEventDuration: () => '2h30',
}));
jest.mock('@/utils/priceUtils', () => ({
  extractPriceLabel: () => 'À partir de 12€',
}));

// --- Mocks expo-router
const mockRouter = { back: jest.fn(), push: jest.fn(), replace: jest.fn() };
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'e1', agendaId: 'a1' }),
  useRouter: () => mockRouter,
}));

// --- Mock hook data
const mockUseEventById = jest.fn();
jest.mock('@/hooks/useEventById', () => ({
  useEventById: (...args: unknown[]) => mockUseEventById(...args),
}));

// --- On espionne Linking.openURL
jest.spyOn(Linking, 'openURL').mockResolvedValue();

// ⚠️ ADAPTE ce chemin si besoin
import EventDetailPage from '@/app/event/[agendaId]/[id]';

const makeEvent = () => ({
  uid: 'e1',
  image: { base: 'https://img/', filename: 'pic.jpg' },
  title: { fr: 'Mega Concert' },
  dateRange: { fr: 'Samedi 3 mai 2025 - 21:00' },
  location: {
    name: 'Le Dôme',
    city: 'Marseille',
    address: '12 rue de la Musique',
    latitude: 43.3,
    longitude: 5.4,
  },
  longDescription: { fr: 'Ceci est une très longue description '.repeat(10) + 'THE-END' },
  conditions: { fr: 'Entrée libre' },
  // [0] = URL pour le bouton "Prends ta place"
  registration: [
    { type: 'url', value: 'https://buy.tld' },
    { type: 'phone', value: '0601020304' },
    { type: 'email', value: 'info@site.tld' },
  ],
  firstTiming: { begin: '2025-05-03T19:00:00Z', end: '2025-05-03T21:30:00Z' },
  accessibility: { pi: true, hi: true, vi: false, ii: false, mi: false },
  keywords: { fr: ['rock', 'live'] },
  status: 5, // "Complet — ..."
  originAgenda: { title: 'OpenAgenda Marseille', uid: 'ag123' },
});

describe('EventDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche "Chargement...", "Erreur", ou "introuvable" selon l’état du hook', () => {
    mockUseEventById.mockReturnValueOnce({ loading: true, error: null, event: null });
    const { rerender } = render(<EventDetailPage />);
    expect(screen.getByText('Chargement...')).toBeTruthy();

    mockUseEventById.mockReturnValueOnce({ loading: false, error: 'Oups', event: null });
    rerender(<EventDetailPage />);
    expect(screen.getByText('Erreur : Oups')).toBeTruthy();

    mockUseEventById.mockReturnValueOnce({ loading: false, error: null, event: null });
    rerender(<EventDetailPage />);
    expect(screen.getByText('Événement introuvable')).toBeTruthy();
  });

  it('rend les infos principales + map + status + API', () => {
    mockUseEventById.mockReturnValue({ loading: false, error: null, event: makeEvent() });

    render(<EventDetailPage />);

    // Image principale
    expect(screen.getByLabelText("Image de l'évènement")).toBeTruthy();
    // Titre / date / lieu
    expect(screen.getByText('Mega Concert')).toBeTruthy();
    expect(screen.getByText('Samedi 3 mai 2025 - 21:00')).toBeTruthy();
    expect(screen.getByText('Marseille')).toBeTruthy();
    // Map + marker
    expect(screen.getByTestId('map')).toBeTruthy();
    expect(screen.getByTestId('marker')).toBeTruthy();
    // Status "Complet — ..."
    expect(screen.getByText(/Complet — L’événement affiche complet/i)).toBeTruthy();
    // API info
    expect(
      screen.getByText(/Données fournies par OpenAgenda Marseille/i)
    ).toBeTruthy();
    // Prix (barre du bas)
    expect(screen.getByText('À partir de 12€')).toBeTruthy();
  });

  it('section Contact : affiche téléphone + email si présents', () => {
    mockUseEventById.mockReturnValue({ loading: false, error: null, event: makeEvent() });

    render(<EventDetailPage />);
    // Section "Contact"
    expect(screen.getByText('Contact')).toBeTruthy();
    // Lignes téléphone + email, préfixées d’emoji
    expect(screen.getByText(/📱 0601020304/)).toBeTruthy();
    expect(screen.getByText(/📧 info@site.tld/)).toBeTruthy();
  });

  it('bouton fermer -> router.back()', () => {
    mockUseEventById.mockReturnValue({ loading: false, error: null, event: makeEvent() });

    render(<EventDetailPage />);
    fireEvent.press(screen.getByLabelText('Icône croix'));
    expect(mockRouter.back).toHaveBeenCalled();
  });
});
