import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter} from 'react-router-dom';
import App from './App';

test('home', () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  fail('Not yet');
});

test('desks', () => {
  render(<MemoryRouter initialEntries={['/desks']}><App /></MemoryRouter>);
  fail('Not yet');
});

test('students', () => {
  render(<MemoryRouter initialEntries={['/students']}><App /></MemoryRouter>);
  fail('Not yet');
});

test('report', () => {
  render(<MemoryRouter initialEntries={['/report']}><App /></MemoryRouter>);
  fail('Not yet');
});