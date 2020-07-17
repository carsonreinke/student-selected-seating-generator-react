import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store';
import App from '../App';

test('home', () => {
  render(<Provider store={store}><MemoryRouter initialEntries={['/']}><App /></MemoryRouter></Provider>);
  fail('Not yet');
});

test('desks', () => {
  render(<Provider store={store}><MemoryRouter initialEntries={['/desks']}><App /></MemoryRouter></Provider>);
  fail('Not yet');
});

test('students', () => {
  render(<Provider store={store}><MemoryRouter initialEntries={['/students']}><App /></MemoryRouter></Provider>);
  fail('Not yet');
});

test('report', () => {
  render(<Provider store={store}><MemoryRouter initialEntries={['/report']}><App /></MemoryRouter></Provider>);
  fail('Not yet');
});
