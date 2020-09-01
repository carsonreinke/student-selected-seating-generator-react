import React from 'react';
import DeskEditor from '../DeskEditor';
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
    const result = render(<Provider store={store}><DeskEditor menu="" redirect={jest.fn()} /></Provider>);

    expect(result.getByText('Provide the arrangement of desks for the room.')).toBeInTheDocument();
  });

  it('should render desks and students', () => {
    room.name = 'Room Testing';
    const desk = addDesk(room);
    const student = addStudent(room);
    student.name = 'Student Testing';
    room.desks.students[desk.id].push(student.id);
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><DeskEditor menu="" redirect={jest.fn()} /></Provider>);

    expect(result.getByText('Room Testing')).toBeInTheDocument();
    expect(result.getByText('Student Testing')).toBeInTheDocument();
  });
});

describe('start over', () => {
  it('should redirect on click', async () => {
    const redirect = jest.fn();
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><DeskEditor menu="" redirect={redirect} /></Provider>);

    fireEvent.click(result.getByAltText('Start Over'));

    await wait(() => expect(redirect).toHaveBeenCalledWith('/'));
  });
});

describe('next', () => {
  it('should redirect on click', async () => {
    const redirect = jest.fn();
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><DeskEditor menu="" redirect={redirect} /></Provider>);

    fireEvent.click(result.getByAltText('Next'));

    await wait(() => expect(redirect).toHaveBeenCalledWith('/students'));
  });
});

describe('arrange', () => {

});
