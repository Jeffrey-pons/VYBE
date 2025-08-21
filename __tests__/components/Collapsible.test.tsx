import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Collapsible } from '@/components/Collapsible';

jest.mock('@/components/ui/IconSymbol', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    IconSymbol: (props: any) => <Text testID="icon">{String(props.name)}</Text>,
  };
});

describe('Collapsible', () => {
  it('est fermé par défaut puis s’ouvre au tap', () => {
    render(
      <Collapsible title="Section A" subtitle="Détails">
        <Text>Contenu</Text>
      </Collapsible>
    );

    // Fermé -> pas de contenu
    expect(screen.queryByText('Contenu')).toBeNull();

    // Tap sur le titre
    fireEvent.press(screen.getByText('Section A'));

    // Ouvert -> contenu visible
    expect(screen.getByText('Contenu')).toBeTruthy();
    // Le sous-titre est visible dans le header
    expect(screen.getByText('Détails')).toBeTruthy();
  });

  it('se referme si on retape', () => {
    render(
      <Collapsible title="Section B">
        <Text>Bloc</Text>
      </Collapsible>
    );

    fireEvent.press(screen.getByText('Section B'));
    expect(screen.getByText('Bloc')).toBeTruthy();

    fireEvent.press(screen.getByText('Section B'));
    expect(screen.queryByText('Bloc')).toBeNull();
  });
});

// Petit util <Text> pour TS dans ce fichier
function Text(props: any) {
  // eslint-disable-next-line react-native/no-inline-styles
  return <reactNative.Text style={{}} {...props} />;
}
const reactNative = require('react-native');
