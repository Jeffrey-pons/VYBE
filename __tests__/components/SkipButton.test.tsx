import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SkipButton from '@/components/SkipButton';

describe('SkipButton', () => {
  it('rend le bouton et déclenche onPress', () => {
    const onPress = jest.fn();
    const { getByLabelText, getByText } = render(<SkipButton onPress={onPress} />);

    expect(getByLabelText(/Passer cette étape/i)).toBeTruthy();
    expect(getByText('Passer')).toBeTruthy();

    fireEvent.press(getByLabelText(/Passer cette étape/i));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
