import React from 'react';
import { mockStore } from '../../../tests/mockStore';
import { RootState } from '../../app/rootSlice';
import ReportViewer from '../ReportViewer';
import { render, fireEvent, wait } from '@testing-library/react';
import { Provider } from 'react-redux';
import { buildRoom, Room, addDesk, addStudent } from '../../models/room';
import { assignStudent } from '../../models/desks';

let room: Room;

beforeEach(() => {
  room = buildRoom();
});

describe('render', () => {
  it('should render empty room', () => {
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><ReportViewer menu='' redirect={jest.fn()} /></Provider>);

    expect(result.getByText('Print, save for later, or start new.')).toBeInTheDocument();
  });

  it('should render desks and students', () => {
    room.name = 'Room Testing';
    const desk = addDesk(room);
    const student = addStudent(room);
    student.name = 'Student Testing';
    assignStudent(room, desk, student);
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><ReportViewer menu="" redirect={jest.fn()} /></Provider>);

    expect(result.getByText('Room Testing')).toBeInTheDocument();
    expect(result.getByText('Student Testing')).toBeInTheDocument();
  });
});

describe('start over', () => {
  it('should redirect on click', async () => {
    const redirect = jest.fn();
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><ReportViewer menu="" redirect={redirect} /></Provider>);

    fireEvent.click(result.getByAltText('Start Over'));

    await wait(() => expect(redirect).toHaveBeenCalledWith('/'));
  });
});

describe('previous', () => {
  it('should redirect on click', async () => {
    const redirect = jest.fn();
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><ReportViewer menu="" redirect={redirect} /></Provider>);

    fireEvent.click(result.getByAltText('Previous'));

    await wait(() => expect(redirect).toHaveBeenCalledWith('/students'));
  });
});

describe('print', () => {
  it('should call print', () => {
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><ReportViewer menu="" redirect={jest.fn()} /></Provider>);

    fireEvent.click(result.getByAltText('Print'));

    expect(window.print).toHaveBeenCalled();
  });
});

describe('save', () => {
  it('should call action', () => {
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><ReportViewer menu="" redirect={jest.fn()} /></Provider>);

    fireEvent.click(result.getByAltText('Save'));

    wait(() => {
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });
  });
});
