import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import Loader from '../Loader';

// Mock du contexte de chargement
const mockUseLoading = jest.fn();
jest.mock('@/contexts/LoadingContext', () => ({
  useLoading: () => mockUseLoading(),
}));

// Mock du composant ThemedText
jest.mock('@/components/ThemedText', () => ({
  ThemedText: ({ children, type, ...props }: any) => (
    <span testID={`themed-text-${type}`} {...props}>
      {children}
    </span>
  ),
}));

describe('Loader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When loading is active', () => {
    beforeEach(() => {
      mockUseLoading.mockReturnValue({
        isLoading: true,
      });
    });

    test('renders loader container when isLoading is true', () => {
      render(<Loader />);
      
      // Vérifier que le container de loader est présent
      const loaderContainer = screen.getByTestId('themed-text-text').parent;
      expect(loaderContainer).toBeTruthy();
    });

    test('displays loading text', () => {
      render(<Loader />);
      
      expect(screen.getByText('Chargement...')).toBeTruthy();
    });

    test('renders ActivityIndicator with correct props', () => {
      const { UNSAFE_getByType } = render(<Loader />);
      
      const activityIndicator = UNSAFE_getByType(ActivityIndicator);
      expect(activityIndicator).toBeTruthy();
      expect(activityIndicator.props.size).toBe('large');
      expect(activityIndicator.props.color).toBe('white');
    });

    test('renders ThemedText with correct type', () => {
      render(<Loader />);
      
      const themedText = screen.getByTestId('themed-text-text');
      expect(themedText).toBeTruthy();
      expect(themedText).toHaveTextContent('Chargement...');
    });

    test('applies correct styling to loader container', () => {
      render(<Loader />);
      
      const themedText = screen.getByTestId('themed-text-text');
      const loaderContainer = themedText.parent;
      
      expect(loaderContainer.props.style).toEqual(
        expect.objectContaining({
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        })
      );
    });
  });

  describe('When loading is not active', () => {
    beforeEach(() => {
      mockUseLoading.mockReturnValue({
        isLoading: false,
      });
    });

    test('returns null when isLoading is false', () => {
      const { container } = render(<Loader />);
      
      // Le composant ne devrait rien rendre
      expect(container.children.length).toBe(0);
    });

    test('does not render loading text when isLoading is false', () => {
      render(<Loader />);
      
      expect(screen.queryByText('Chargement...')).toBeFalsy();
    });

    test('does not render ActivityIndicator when isLoading is false', () => {
      const { UNSAFE_queryByType } = render(<Loader />);
      
      const activityIndicator = UNSAFE_queryByType(ActivityIndicator);
      expect(activityIndicator).toBeFalsy();
    });
  });

  describe('Loading context integration', () => {
    test('calls useLoading hook', () => {
      mockUseLoading.mockReturnValue({
        isLoading: true,
      });

      render(<Loader />);
      
      expect(mockUseLoading).toHaveBeenCalledTimes(1);
    });

    test('reacts to loading state changes', () => {
      // Premier rendu avec isLoading = false
      mockUseLoading.mockReturnValue({
        isLoading: false,
      });

      const { rerender } = render(<Loader />);
      expect(screen.queryByText('Chargement...')).toBeFalsy();

      // Deuxième rendu avec isLoading = true
      mockUseLoading.mockReturnValue({
        isLoading: true,
      });

      rerender(<Loader />);
      expect(screen.getByText('Chargement...')).toBeTruthy();
    });

    test('handles undefined loading context gracefully', () => {
      mockUseLoading.mockReturnValue({
        isLoading: undefined,
      });

      expect(() => render(<Loader />)).not.toThrow();
      
      // Avec une valeur falsy, le loader ne devrait pas s'afficher
      expect(screen.queryByText('Chargement...')).toBeFalsy();
    });
  });

  describe('Component behavior', () => {
    test('renders consistently with same props', () => {
      mockUseLoading.mockReturnValue({
        isLoading: true,
      });

      const { rerender } = render(<Loader />);
      
      expect(screen.getByText('Chargement...')).toBeTruthy();
      
      // Re-render avec les mêmes props
      rerender(<Loader />);
      
      expect(screen.getByText('Chargement...')).toBeTruthy();
    });

    test('maintains overlay positioning', () => {
      mockUseLoading.mockReturnValue({
        isLoading: true,
      });

      render(<Loader />);
      
      const themedText = screen.getByTestId('themed-text-text');
      const container = themedText.parent;
      
      // Vérifier les props de positionnement pour l'overlay
      expect(container.props.style.position).toBe('absolute');
      expect(container.props.style.top).toBe(0);
      expect(container.props.style.left).toBe(0);
      expect(container.props.style.right).toBe(0);
      expect(container.props.style.bottom).toBe(0);
    });

    test('has semi-transparent background for overlay effect', () => {
      mockUseLoading.mockReturnValue({
        isLoading: true,
      });

      render(<Loader />);
      
      const themedText = screen.getByTestId('themed-text-text');
      const container = themedText.parent;
      
      expect(container.props.style.backgroundColor).toBe('rgba(0, 0, 0, 0.5)');
    });
  });

  describe('Accessibility', () => {
    test('provides loading indication for screen readers', () => {
      mockUseLoading.mockReturnValue({
        isLoading: true,
      });

      render(<Loader />);
      
      // Le texte "Chargement..." sert d'indication pour les lecteurs d'écran
      expect(screen.getByText('Chargement...')).toBeTruthy();
    });

    test('ActivityIndicator is accessible', () => {
      mockUseLoading.mockReturnValue({
        isLoading: true,
      });

      const { UNSAFE_getByType } = render(<Loader />);
      
      const activityIndicator = UNSAFE_getByType(ActivityIndicator);
      expect(activityIndicator).toBeTruthy();
      
      // ActivityIndicator de React Native a une accessibilité intégrée
    });
  });

  describe('Edge cases', () => {
    test('handles loading context returning null', () => {
      mockUseLoading.mockReturnValue(null);

      expect(() => render(<Loader />)).toThrow();
    });

    test('handles loading context with extra properties', () => {
      mockUseLoading.mockReturnValue({
        isLoading: true,
        extraProp: 'should be ignored',
        anotherProp: 123,
      });

      render(<Loader />);
      
      expect(screen.getByText('Chargement...')).toBeTruthy();
    });

    test('works with boolean-like values', () => {
      // Test avec des valeurs truthy/falsy
      const truthyValues = [true, 1, 'true', {}, []];
      const falsyValues = [false, 0, '', null, undefined];

      truthyValues.forEach(value => {
        mockUseLoading.mockReturnValue({
          isLoading: value,
        });

        const { unmount } = render(<Loader />);
        expect(screen.queryByText('Chargement...')).toBeTruthy();
        unmount();
      });

      falsyValues.forEach(value => {
        mockUseLoading.mockReturnValue({
          isLoading: value,
        });

        const { unmount } = render(<Loader />);
        expect(screen.queryByText('Chargement...')).toBeFalsy();
        unmount();
      });
    });
  });
});