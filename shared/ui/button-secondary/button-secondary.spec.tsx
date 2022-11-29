import React from 'react';
import { render } from '@testing-library/react';
import { BasicButtonSecondary } from './button-secondary.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicButtonSecondary />);
  const rendered = getByText('hello world!');
  expect(rendered).toBeTruthy();
});
