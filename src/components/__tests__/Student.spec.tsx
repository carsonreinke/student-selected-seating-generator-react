import React from 'react';
import Student, { preferenceChange } from '../Student';
import { Room, buildRoom, addStudent } from '../../models/room';
import { render } from '@testing-library/react';

let room: Room;

beforeEach(() => {
  room = buildRoom();
});

describe('render', () => {
  it('should render student', () => {
    const student = addStudent(room);
    student.name = 'Testing';

    const results = render(<Student student={student} students={room.students} addPreference={jest.fn()} editName={jest.fn()} removePreference={jest.fn()} />);

    expect(results.getByDisplayValue(student.name)).toBeInTheDocument();
  });
});

describe('editName', () => {

});

describe('addPreference', () => {
  it('should add a preference', () => {
    const s1 = addStudent(room),
      s2 = addStudent(room);
    const add = jest.fn();

    preferenceChange(s1, room.students, [{ label: s2.name, value: s2.id }], add, jest.fn());

    expect(add).toHaveBeenCalledWith(s1.id, s2.id);
  });
});

describe('removePreference', () => {
  it('should remove a preference', () => {
    const s1 = addStudent(room),
      s2 = addStudent(room);
    room.students.preferences[s1.id].push(s2.id);
    const remove = jest.fn();

    preferenceChange(s1, room.students, [], jest.fn(), remove);

    expect(remove).toHaveBeenCalledWith(s1.id, s2.id);
  });
});
