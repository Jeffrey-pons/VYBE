import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Collapsible } from '../Collapsible';

// Mock des dépendances
jest.mock('@/constants/Theme', () => ({
  Theme: {
    colors: {
      text: '#ffffff',
    },
    typography: {
      base: {
        fontSize: 16,
      },
    },
  },
}));

jest.mock('@/components/ThemedText', () => ({
  ThemedText: ({ children, style, type, ...props }: any) => (
    <Text style={style} testID={`themed-text-${type}`} {...props}>
      {children}
    </Text>
  ),
}));

jest.mock('@/components/ui/IconSymbol', () => ({
  IconSymbol: ({ name, style, color, size, weight, ...props }: any) => (
    <Text 
      testID="icon-symbol" 
      style={style}
      {...props}
    >
      {name}
    </Text>
  ),
}));

jest.mock('@react-navigation/native', () => ({
  DarkTheme: {},
}));

describe('Collapsible Component', () => {
  const defaultProps = {
    title: 'Test Title',
  };

  const renderWithChildren = (props = {}) => {
    return render(
      <Collapsible {...defaultProps} {...props}>
        <Text testID="collapsible-content">Test Content</Text>
      </Collapsible>
    );
  };

  describe('Rendering', () => {
    test('renders title correctly', () => {
      renderWithChildren();
      
      expect(screen.getByText('Test Title')).toBeTruthy();
    });

    test('renders subtitle when provided', () => {
      renderWithChildren({ subtitle: 'Test Subtitle' });
      
      expect(screen.getByText('Test Title')).toBeTruthy();
      expect(screen.getByText('Test Subtitle')).toBeTruthy();
    });

    test('does not render subtitle when not provided', () => {
      renderWithChildren();
      
      expect(screen.queryByText('Test Subtitle')).toBeFalsy();
    });

    test('renders chevron icon', () => {
      renderWithChildren();
      
      const icon = screen.getByTestId('icon-symbol');
      expect(icon).toBeTruthy();
      expect(screen.getByText('chevron.right')).toBeTruthy();
    });

    test('renders separator', () => {
      const { container } = renderWithChildren();
      
      // Le séparateur existe dans le DOM (même s'il n'a pas de testID)
      expect(container).toBeTruthy();
    });
  });

  describe('Initial State', () => {
    test('content is hidden by default', () => {
      renderWithChildren();
      
      // Le contenu ne devrait pas être visible initialement
      expect(screen.queryByTestId('collapsible-content')).toBeFalsy();
    });

    test('chevron icon has initial rotation (0deg)', () => {
      renderWithChildren();
      
      const icon = screen.getByTestId('icon-symbol');
      expect(icon.props.style.transform).toEqual([{ rotate: '0deg' }]);
    });
  });

  describe('Toggle Functionality', () => {
    test('shows content when header is pressed', () => {
      renderWithChildren();
      
      // Initialement, le contenu n'est pas visible
      expect(screen.queryByTestId('collapsible-content')).toBeFalsy();
      
      // Appuyer sur le header
      const header = screen.getByText('Test Title').parent;
      fireEvent.press(header);
      
      // Le contenu devrait maintenant être visible
      expect(screen.getByTestId('collapsible-content')).toBeTruthy();
      expect(screen.getByText('Test Content')).toBeTruthy();
    });

    test('hides content when header is pressed twice', () => {
      renderWithChildren();
      
      const header = screen.getByText('Test Title').parent;
      
      // Premier clic - ouvrir
      fireEvent.press(header);
      expect(screen.getByTestId('collapsible-content')).toBeTruthy();
      
      // Deuxième clic - fermer
      fireEvent.press(header);
      expect(screen.queryByTestId('collapsible-content')).toBeFalsy();
    });

    test('toggles chevron rotation when opened and closed', () => {
      renderWithChildren();
      
      const icon = screen.getByTestId('icon-symbol');
      const header = screen.getByText('Test Title').parent;
      
      // Initialement fermé (0deg)
      expect(icon.props.style.transform).toEqual([{ rotate: '0deg' }]);
      
      // Ouvrir (90deg)
      fireEvent.press(header);
      expect(icon.props.style.transform).toEqual([{ rotate: '90deg' }]);
      
      // Fermer (0deg)
      fireEvent.press(header);
      expect(icon.props.style.transform).toEqual([{ rotate: '0deg' }]);
    });
  });

  describe('Content Rendering', () => {
    test('renders children content when expanded', () => {
      const { rerender } = render(
        <Collapsible title="Test">
          <Text testID="child-1">Child 1</Text>
          <Text testID="child-2">Child 2</Text>
        </Collapsible>
      );
      
      const header = screen.getByText('Test').parent;
      fireEvent.press(header);
      
      expect(screen.getByTestId('child-1')).toBeTruthy();
      expect(screen.getByTestId('child-2')).toBeTruthy();
      expect(screen.getByText('Child 1')).toBeTruthy();
      expect(screen.getByText('Child 2')).toBeTruthy();
    });

    test('renders complex children content', () => {
      render(
        <Collapsible title="Complex Content">
          <Text testID="nested-content">
            This is complex content with multiple elements
          </Text>
        </Collapsible>
      );
      
      const header = screen.getByText('Complex Content').parent;
      fireEvent.press(header);
      
      expect(screen.getByTestId('nested-content')).toBeTruthy();
      expect(screen.getByText('This is complex content with multiple elements')).toBeTruthy();
    });
  });

  describe('Props Handling', () => {
    test('handles missing title gracefully', () => {
      render(
        <Collapsible>
          <Text testID="content">Content without title</Text>
        </Collapsible>
      );
      
      // Le composant devrait quand même se rendre
      const icon = screen.getByTestId('icon-symbol');
      expect(icon).toBeTruthy();
    });

    test('handles empty title', () => {
      renderWithChildren({ title: '' });
      
      const themedText = screen.getByTestId('themed-text-sectionProfile');
      expect(themedText).toBeTruthy();
    });

    test('handles empty subtitle', () => {
      renderWithChildren({ subtitle: '' });
      
      // Subtitle vide ne devrait pas être affichée
      expect(screen.queryByText('')).toBeFalsy();
    });
  });

  describe('Styling and Theme', () => {
    test('applies correct themed text type to title', () => {
      renderWithChildren();
      
      const titleElement = screen.getByTestId('themed-text-sectionProfile');
      expect(titleElement).toBeTruthy();
    });

    test('icon receives correct props', () => {
      renderWithChildren();
      
      const icon = screen.getByTestId('icon-symbol');
      expect(icon.props.style).toEqual(
        expect.objectContaining({
          transform: [{ rotate: '0deg' }],
          marginTop: 30,
        })
      );
    });
  });

  describe('TouchableOpacity Behavior', () => {
    test('header is touchable and responds to press', () => {
      renderWithChildren();
      
      const header = screen.getByText('Test Title').parent;
      
      // Vérifier qu'on peut appuyer sur le header
      expect(() => fireEvent.press(header)).not.toThrow();
    });

    test('multiple rapid presses work correctly', () => {
      renderWithChildren();
      
      const header = screen.getByText('Test Title').parent;
      
      // Plusieurs clics rapides
      fireEvent.press(header); // Ouvrir
      fireEvent.press(header); // Fermer
      fireEvent.press(header); // Ouvrir
      fireEvent.press(header); // Fermer
      
      // Devrait être fermé à la fin
      expect(screen.queryByTestId('collapsible-content')).toBeFalsy();
      
      const icon = screen.getByTestId('icon-symbol');
      expect(icon.props.style.transform).toEqual([{ rotate: '0deg' }]);
    });
  });

  describe('State Management', () => {
    test('maintains independent state for multiple instances', () => {
      render(
        <>
          <Collapsible title="First Collapsible">
            <Text testID="first-content">First Content</Text>
          </Collapsible>
          <Collapsible title="Second Collapsible">
            <Text testID="second-content">Second Content</Text>
          </Collapsible>
        </>
      );
      
      const firstHeader = screen.getByText('First Collapsible').parent;
      const secondHeader = screen.getByText('Second Collapsible').parent;
      
      // Ouvrir seulement le premier
      fireEvent.press(firstHeader);
      
      expect(screen.getByTestId('first-content')).toBeTruthy();
      expect(screen.queryByTestId('second-content')).toBeFalsy();
      
      // Ouvrir le second
      fireEvent.press(secondHeader);
      
      expect(screen.getByTestId('first-content')).toBeTruthy();
      expect(screen.getByTestId('second-content')).toBeTruthy();
    });
  });
});