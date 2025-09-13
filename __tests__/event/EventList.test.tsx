import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import EventList from '@/components/events/EventListCard';
import { Event } from '@/interfaces/event';

const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };
jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  router: mockRouter,
}));

const ev = (over: Partial<Event> = {}): Event =>
  ({
    uid: 'e1',
    originAgenda: { uid: 'ag1' },
    title: { fr: 'Soirée Electro' },
    location: { city: 'Paris', name: 'Warehouse' },
    dateRange: { fr: 'Vendredi 2 mai 2025 - 23:00' },
    image: { base: 'https://x/', filename: 'a.jpg' },
    ...over,
  }) as unknown as Event;

describe('EventList', () => {
  beforeEach(() => jest.clearAllMocks());

  it("affiche 'Aucun événement trouvé' quand vide", () => {
    render(<EventList events={[]} />);
    expect(screen.getByText('Aucun événement trouvé')).toBeTruthy();
  });

  it('rend des items et permet la navigation', () => {
    render(<EventList events={[ev(), ev({ uid: 'e2' })]} />);

    // plusieurs titres identiques -> getAllByText
    expect(screen.getAllByText('Soirée Electro').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Paris - Vendredi 2 mai 2025 - 23:00').length).toBeGreaterThan(0);

    // image présente au moins une fois (libellé d’accessibilité)
    expect(screen.getAllByLabelText(/Image de l'événement/i).length).toBeGreaterThan(0);

    // navigation via le premier "Voir plus"
    fireEvent.press(screen.getAllByText('Voir plus')[0]);
    expect(mockRouter.push).toHaveBeenCalledWith('/event/ag1/e1');
  });

  it('warn et pas de navigation si uid/agenda absents', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<EventList events={[ev({ uid: undefined as unknown as string })]} />);

    fireEvent.press(screen.getByText('Voir plus'));
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith('UID ou originAgenda manquant');
    warn.mockRestore();
  });
});
