import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import CategoryMenu from '@/components/CategoryMenu';

jest.mock('@/utils/imagesUtils', () => ({
  iconTonight: 1,
  iconThisWeek: 1,
  iconConcert: 1,
  iconFestival: 1,
  iconSpectacle: 1,
  iconExposition: 1,
  iconHumor: 1,
  iconAtelier: 1,
  iconDj: 1,
}));

describe('CategoryMenu', () => {
  const mockSetActiveCategory: jest.MockedFunction<(category: string) => void> = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rend toutes les catégories (libellés)', () => {
    render(<CategoryMenu activeCategory={null} setActiveCategory={mockSetActiveCategory} />);

    const labels = [
      'Ce soir',
      'Cette semaine',
      'Concerts',
      'Festivals',
      'Spectacles',
      'Expositions',
      'Humours',
      'Ateliers',
      'Soirées',
      'DJ',
    ];

    for (const label of labels) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });

  it('au clic, appelle setActiveCategory avec la bonne clé', () => {
    render(<CategoryMenu activeCategory={null} setActiveCategory={mockSetActiveCategory} />);

    fireEvent.press(screen.getByText('Concerts'));
    expect(mockSetActiveCategory).toHaveBeenCalledWith('concert');

    fireEvent.press(screen.getByText('Ce soir'));
    expect(mockSetActiveCategory).toHaveBeenCalledWith('tonight');

    fireEvent.press(screen.getByText('DJ'));
    expect(mockSetActiveCategory).toHaveBeenCalledWith('techno');
  });

  it('met en évidence la catégorie active (bordure jaune)', () => {
    render(<CategoryMenu activeCategory="concert" setActiveCategory={mockSetActiveCategory} />);

    const concertsText = screen.getByText('Concerts');
    const parent = concertsText.parent; 

    const styles = Array.isArray(parent?.props.style)
      ? parent?.props.style
      : [parent?.props.style];

    const hasYellowBorder = styles?.some(
      (s) => s && typeof s === 'object' && (s as Record<string, unknown>).borderColor === 'yellow'
    );

    expect(hasYellowBorder).toBe(true);
  });

  it("affiche l'icône accessible d'une catégorie (ex: Concerts)", () => {
    render(<CategoryMenu activeCategory={null} setActiveCategory={mockSetActiveCategory} />);
    expect(screen.getByLabelText('Icône de la catégorie Concerts')).toBeTruthy();
  });
});
