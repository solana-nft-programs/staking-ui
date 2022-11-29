import React from 'react';
import { render } from '@testing-library/react';
import { BasicButtonPrimary } from './button-primary.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicButtonPrimary />);
  const rendered = getByText('hello world!');
  expect(rendered).toBeTruthy();
});
