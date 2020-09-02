import React from 'react';
import StudentEditor from '../StudentEditor';
import { mockStore } from '../../../tests/mockStore';
import { Room, buildRoom, addDesk, addStudent } from '../../models/room';
import { RootState } from '../../app/rootSlice';
import { render, fireEvent, wait } from '@testing-library/react';
import { Provider } from 'react-redux';

let room: Room;

beforeEach(() => {
  room = buildRoom();
});

describe('render', () => {
  it('should render empty room', () => {
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><StudentEditor menu="" redirect={jest.fn()} /></Provider>);

    expect(result.getByText('Provide the name of each student and their preferences.')).toBeInTheDocument();
  });
});

describe('start over', () => {
  it('should redirect on click', async () => {
    const redirect = jest.fn();
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><StudentEditor menu="" redirect={redirect} /></Provider>);

    fireEvent.click(result.getByAltText('Start Over'));

    await wait(() => expect(redirect).toHaveBeenCalledWith('/'));
  });
});

describe('next', () => {
  it('should redirect on click', async () => {
    const redirect = jest.fn();
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><StudentEditor menu="" redirect={redirect} /></Provider>);

    fireEvent.click(result.getByAltText('Next'));

    await wait(() => expect(redirect).toHaveBeenCalledWith('/report'));
  });
});

describe('previous', () => {
  it('should redirect on click', async () => {
    const redirect = jest.fn();
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><StudentEditor menu="" redirect={redirect} /></Provider>);

    fireEvent.click(result.getByAltText('Previous'));

    await wait(() => expect(redirect).toHaveBeenCalledWith('/desks'));
  });
});
