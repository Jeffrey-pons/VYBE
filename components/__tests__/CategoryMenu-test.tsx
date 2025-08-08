import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import CategoryMenu from '../CategoryMenu';

describe('CategoryMenu', () => {
  const mockSetActiveCategory = jest.fn();

  beforeEach(() => {
    mockSetActiveCategory.mockClear();
  });

  const defaultProps = {
    activeCategory: null,
    setActiveCategory: mockSetActiveCategory,
  };

  it('should render categories correctly', () => {
    render(<CategoryMenu {...defaultProps} />);

    expect(screen.getByText('Ce soir')).toBeTruthy();
    expect(screen.getByText('Concerts')).toBeTruthy();
    expect(screen.getByText('DJ')).toBeTruthy();
  });

  it('should call setActiveCategory when category is pressed', () => {
    render(<CategoryMenu {...defaultProps} />);

    const concertButton = screen.getByText('Concerts');
    fireEvent.press(concertButton);

    expect(mockSetActiveCategory).toHaveBeenCalledWith('concert');
  });

  // it('should highlight active category', () => {
  //   render(<CategoryMenu {...defaultProps} activeCategory="concert" />);

  //   const concertButton = screen.getByText('Concerts').parent;
  //   expect(concertButton?.props.style).toEqual(
  //     expect.arrayContaining([
  //       expect.objectContaining({ borderColor: 'yellow' })
  //     ])
  //   );
  // });
});