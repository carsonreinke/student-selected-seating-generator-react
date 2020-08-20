import React from 'react';
import Room from '../Room';
import { render, fireEvent, wait } from '@testing-library/react';
import { buildRoom, addDesk, addStudent } from '../../models/room';

describe('render', () => {
  it('should render editable', () => {
    const room = buildRoom();
    const results = render(<Room editable={true} room={room} editName={jest.fn()} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} />);

    expect(results.getByText(room.name)).toBeInTheDocument();
  });

  it('should render uneditable', () => {
    const room = buildRoom();
    const results = render(<Room editable={false} room={room} editName={jest.fn()} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} />);

    expect(results.getByText(room.name)).toBeInTheDocument();
  });

  it('should render a desk', () => {
    const room = buildRoom();
    addDesk(room);

    const results = render(<Room editable={false} room={room} editName={jest.fn()} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} />);

    expect(results.getByText('Student')).toBeInTheDocument();
  });

  it('should render multiple desks', () => {
    const room = buildRoom();
    [...Array(3)].forEach(() => addDesk(room));

    const results = render(<Room editable={false} room={room} editName={jest.fn()} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} />);

    expect(results.getAllByText('Student')).toHaveLength(3);
  });

  it('should render student name to desk', () => {
    const room = buildRoom();
    const desk = addDesk(room),
      student = addStudent(room);
    student.name = 'Testing Name';

    room.desks.students[desk.id].push(student.id);

    const results = render(<Room editable={false} room={room} editName={jest.fn()} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} />);

    expect(results.getByText(student.name)).toBeInTheDocument();
  });
});

describe('editName', () => {
  it('should ', () => {
    const room = buildRoom();
    const editName = jest.fn();
    const results = render(<Room editable={false} room={room} editName={editName} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} />);

    fireEvent.focus(results.getByText(room.name));
    fireEvent.blur(results.getByText(room.name));

    expect(editName).not.toHaveBeenCalled();
  });

  it('should not do anything when uneditable', () => {
    const room = buildRoom();
    const editName = jest.fn();
    const results = render(<Room editable={true} room={room} editName={editName} moveDesk={jest.fn()} removeDesk={jest.fn()} rotateDesk={jest.fn()} />);

    fireEvent.focus(results.getByText(room.name));
    fireEvent.keyDown(results.getByText(room.name), { keyCode: 13 });

    wait(() => expect(editName).toHaveBeenCalled());
  });
});
