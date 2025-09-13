import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SkipButton from '@/components/SkipButton';

describe('SkipButton', () => {
  it('déclenche onPress via le texte aussi', () => {
  const onPress = jest.fn();
  const { getByText } = render(<SkipButton onPress={onPress} />);
  
  fireEvent.press(getByText('Passer'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
});
