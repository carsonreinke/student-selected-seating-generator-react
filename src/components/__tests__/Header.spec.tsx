import React from 'react';
import Header from '../Header';
import { render } from '@testing-library/react';

it('should render', () => {
  const result = render(<Header />);

  expect(result.getByText('Student Selected Seating Generator')).toBeInTheDocument();
});
