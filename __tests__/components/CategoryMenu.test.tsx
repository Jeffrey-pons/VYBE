import React from 'react';
import { render, screen } from '@testing-library/react-native';
import CategoryMenu from '@/components/CategoryMenu';

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
});
