// __tests__/components/EventCard.test.tsx
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { EventCard } from '@/components/events/EventCard';
import { router } from 'expo-router';
import { Event } from '@/interfaces/event';

const makeEvent = (over: Partial<Event> = {}): Event =>
  ({
    uid: 'ev123',
    title: { fr: 'Concert de Jazz' },
    originAgenda: { uid: 'ag456' },
    image: { base: 'https://img/', filename: 'pic.jpg' },
    location: { name: 'Le Club', city: 'Paris' },
    dateRange: { fr: 'Lundi 1 janvier 2025 - 20:00' },
    ...over,
  } as unknown as Event);

describe('EventCard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('affiche image, titre, date et lieu', () => {
    const ev = makeEvent();
    render(<EventCard event={ev} />);

    expect(screen.getByLabelText(/Preview/i)).toBeTruthy();
    expect(screen.getByText('Concert de Jazz')).toBeTruthy();
    expect(screen.getByText('Lundi 1 janvier 2025 - 20:00')).toBeTruthy();
    expect(screen.getByText('Le Club')).toBeTruthy();
  });

  it('navigue vers la page détail quand uid + originAgenda.uid présents', () => {
    const ev = makeEvent();
    render(<EventCard event={ev} />);

    fireEvent.press(screen.getByLabelText(/Voir les détails/i));
    expect(router.push).toHaveBeenCalledWith('/event/ag456/ev123');
  });

  it('warn + pas de navigation si uid manquant', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const ev = makeEvent({ uid: undefined as unknown as string });

    render(<EventCard event={ev} />);
    fireEvent.press(screen.getByLabelText(/Voir les détails/i));

    expect(router.push).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith('UID ou originAgenda manquant');
    warn.mockRestore();
  });

  it("variant 'horizontal' applique la bonne hauteur d'image", () => {
    const ev = makeEvent();
    render(<EventCard event={ev} variant="horizontal" />);
    expect(screen.getByLabelText(/Preview/i)).toHaveStyle({ height: 200 });
  });

  it("fallback sur le titre si title.fr absent", () => {
    const ev = makeEvent({ title: { fr: '' } as any });
    render(<EventCard event={ev} />);
    expect(screen.getByText("Titre de l'évènement indisponible")).toBeTruthy();
  });
});
