import React from 'react';
import Hamburger from '../Hamburger';
import { render, fireEvent } from '@testing-library/react';

it('should render collapsed', () => {
  const result = render(<Hamburger expanded={false} toggle={jest.fn()} />);

  expect(result.getByTitle('Expand')).toBeInTheDocument();
});

it('should render expanded', () => {
  const result = render(<Hamburger expanded={true} toggle={jest.fn()} />);

  expect(result.getByTitle('Collapse')).toBeInTheDocument();
});

it('should expand when clicked', () => {
  const toggle = jest.fn();
  const result = render(<Hamburger expanded={false} toggle={toggle} />);

  fireEvent.click(result.getByTitle('Expand'));

  expect(toggle).toHaveBeenCalled();
});
