import { render, fireEvent, screen } from '@testing-library/react-native';
import { Collapsible } from '@/components/Collapsible';
import { Text } from 'react-native';

jest.mock('@/components/ui/IconSymbol', () => ({
  IconSymbol: () => null,
}));

describe('Collapsible', () => {
  it('est fermé par défaut puis s’ouvre au tap', () => {
    render(
      <Collapsible title="Section A" subtitle="Détails">
        <Text>Contenu</Text>
      </Collapsible>
    );

    expect(screen.queryByText('Contenu')).toBeNull();

    fireEvent.press(screen.getByText('Section A'));

    expect(screen.getByText('Contenu')).toBeTruthy();
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
