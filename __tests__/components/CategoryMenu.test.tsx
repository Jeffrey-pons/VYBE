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
      'A venir',
      'Cette semaine',
      'Concerts',
      'Festivals',
      'Spectacles',
      'Expositions',
      'Humours',
      'Ateliers',
      'Soirées',
    ];

    for (const label of labels) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });

  it('au clic, appelle setActiveCategory avec la bonne clé', () => {
    render(<CategoryMenu activeCategory={null} setActiveCategory={mockSetActiveCategory} />);

    fireEvent.press(screen.getByText('Concerts'));
    expect(mockSetActiveCategory).toHaveBeenCalledWith('concert');

    fireEvent.press(screen.getByText('A venir'));
    expect(mockSetActiveCategory).toHaveBeenCalledWith('upcoming');

    fireEvent.press(screen.getByText('Soirées'));
    expect(mockSetActiveCategory).toHaveBeenCalledWith('soiree');
  });

  it('met en évidence la catégorie active (bordure jaune)', () => {
  render(<CategoryMenu activeCategory="concert" setActiveCategory={mockSetActiveCategory} />);

  const card = screen.getByTestId('category-concert');
  expect(card).toHaveStyle({ borderColor: 'yellow' });
});

  it("affiche l'icône accessible d'une catégorie (ex: Concerts)", () => {
    render(<CategoryMenu activeCategory={null} setActiveCategory={mockSetActiveCategory} />);
    expect(screen.getByLabelText('Icône de la catégorie Concerts')).toBeTruthy();
  });
});
