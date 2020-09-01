import React from 'react';
import DeskEditor from '../DeskEditor';
import { mockStore } from '../../../tests/mockStore';
import { Room, buildRoom, addDesk, addStudent } from '../../models/room';
import { RootState } from '../../app/rootSlice';
import { render, fireEvent, wait } from '@testing-library/react';
import { Provider } from 'react-redux';
import ResizeObserver from 'resize-observer-polyfill';
import { act } from 'react-dom/test-utils';

jest.mock('resize-observer-polyfill', () => {
  return jest.fn().mockImplementation((callback) => {
    return {
      observe: jest.fn(),
      disconnect: jest.fn()
    };
  });
});

let room: Room;

beforeEach(() => {
  room = buildRoom();
});

afterEach(() => {
  ResizeObserver.mockClear();
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
  it('should automatically arrange desks', async () => {
    addDesk(room);
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><DeskEditor menu="" redirect={jest.fn()} /></Provider>);

    await(() => expect(ResizeObserver).toHaveBeenCalledTimes(2));
    for (let index = 0; index < ResizeObserver.mock.calls.length; index++) {
      const callback = ResizeObserver.mock.calls[index][0];
      const size = index === 2 ? 500 : 100; // Yikes, hard to tell who is calling
      act(() => {
        callback([{
          target: null,
          contentRect: { width: size, height: size }
        }]);
      });
    }

    await wait(() => {
      const actions = store.getActions();
      expect(actions[actions.length - 1]).toEqual({ type: 'room/toggleNewVersion', payload: false });
    });
  });

  it('should rearrange desks', async () => {
    addDesk(room); addDesk(room);
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: false } });
    const result = render(<Provider store={store}><DeskEditor menu="" redirect={jest.fn()} /></Provider>);

    await wait(() => expect(ResizeObserver).toHaveBeenCalledTimes(3));
    for (let index = 0; index < ResizeObserver.mock.calls.length; index++) {
      const callback = ResizeObserver.mock.calls[index][0];
      const size = index === 2 ? 500 : 100; // Yikes, hard to tell who is calling
      act(() => {
        callback([{
          target: null,
          contentRect: { width: size, height: size }
        }]);
      });
    }

    fireEvent.click(result.getByAltText('Arrange'));

    await wait(() => {
      const actions = store.getActions();
      const action = actions[actions.length - 1];

      expect(action.payload.x).not.toEqual(0);
      expect(action.payload.y).not.toEqual(0);
    });
  });
});
