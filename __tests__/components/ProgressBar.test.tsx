import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from '@/components/ProgressBar';

describe('ProgressBar', () => {
  it('2/4 => 50%', () => {
    const { getByTestId } = render(<ProgressBar step={2} totalSteps={4} />);
    expect(getByTestId('progress-bar')).toHaveStyle({ width: '50%' });
  });

  it('0/5 => 0%', () => {
    const { getByTestId } = render(<ProgressBar step={0} totalSteps={5} />);
    expect(getByTestId('progress-bar')).toHaveStyle({ width: '0%' });
  });

  it('1/1 => 100%', () => {
    const { getByTestId } = render(<ProgressBar step={1} totalSteps={1} />);
    expect(getByTestId('progress-bar')).toHaveStyle({ width: '100%' });
  });
});
