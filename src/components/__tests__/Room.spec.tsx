import React from 'react';
import Room from '../Room';
import { render, fireEvent, wait } from '@testing-library/react';
import { buildRoom, addDesk, addStudent } from '../../models/room';
import ResizeObserver from 'resize-observer-polyfill';

jest.mock('resize-observer-polyfill', () => {
  return jest.fn().mockImplementation((callback) => {
    return {
      observe: jest.fn(),
      disconnect: jest.fn()
    };
  });
});

afterEach(() => {
  ResizeObserver.mockClear();
});

describe('render', () => {
  it('should render editable', () => {
    const room = buildRoom();
    const results = render(<Room editable={true} room={room} editName={jest.fn()} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} editDimension={jest.fn()} deskEditDimension={jest.fn()} />);

    expect(results.getByText(room.name)).toBeInTheDocument();
  });

  it('should render uneditable', () => {
    const room = buildRoom();
    const results = render(<Room editable={false} room={room} editName={jest.fn()} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} editDimension={jest.fn()} deskEditDimension={jest.fn()} />);

    expect(results.getByText(room.name)).toBeInTheDocument();
  });

  it('should render a desk', () => {
    const room = buildRoom();
    addDesk(room);

    const results = render(<Room editable={false} room={room} editName={jest.fn()} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} editDimension={jest.fn()} deskEditDimension={jest.fn()} />);

    expect(results.getByText('Student')).toBeInTheDocument();
  });

  it('should render multiple desks', () => {
    const room = buildRoom();
    [...Array(3)].forEach(() => addDesk(room));

    const results = render(<Room editable={false} room={room} editName={jest.fn()} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} editDimension={jest.fn()} deskEditDimension={jest.fn()} />);

    expect(results.getAllByText('Student')).toHaveLength(3);
  });

  it('should render student name to desk', () => {
    const room = buildRoom();
    const desk = addDesk(room),
      student = addStudent(room);
    student.name = 'Testing Name';

    room.desks.students[desk.id].push(student.id);

    const results = render(<Room editable={false} room={room} editName={jest.fn()} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} editDimension={jest.fn()} deskEditDimension={jest.fn()} />);

    expect(results.getByText(student.name)).toBeInTheDocument();
  });
});

describe('editName', () => {
  it('should allow editing of name', () => {
    const room = buildRoom();
    const editName = jest.fn();
    const results = render(<Room editable={false} room={room} editName={editName} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} editDimension={jest.fn()} deskEditDimension={jest.fn()} />);

    fireEvent.focus(results.getByText(room.name));
    fireEvent.blur(results.getByText(room.name));

    expect(editName).not.toHaveBeenCalled();
  });

  it('should not do anything when uneditable', async () => {
    const room = buildRoom();
    const editName = jest.fn();
    const results = render(<Room editable={true} room={room} editName={editName} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} editDimension={jest.fn()} deskEditDimension={jest.fn()} />);

    fireEvent.focus(results.getByText(room.name));
    fireEvent.keyDown(results.getByText(room.name), { keyCode: 13 });

    await wait(() => expect(editName).not.toHaveBeenCalled());
  });
});

describe('editDimension', () => {
  it('should call edit dimension when resized', async () => {
    const editDimension = jest.fn();
    const results = render(<Room editable={true} room={buildRoom()} editName={jest.fn()} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} editDimension={editDimension} deskEditDimension={jest.fn()} />);

    expect(ResizeObserver).toHaveBeenCalled();
    const callback = ResizeObserver.mock.calls[0][0];

    // Manually trigger callback instead of event
    callback([{
      target: results.container.firstChild,
      contentRect: {
        width: 1, height: 1
      }
    }]);

    await wait(() => expect(editDimension).toHaveBeenCalled());
  });
});
