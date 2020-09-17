import { addStudentPreference, removeStudentPreference } from '../students';
import { Room, buildRoom, addStudent } from '../room';
let room: Room;

beforeEach(() => {
  room = buildRoom();
});

describe('addStudentPreference', () => {
  it('should add preference', () => {
    const s1 = addStudent(room);
    const s2 = addStudent(room);
    addStudentPreference(room, s1, s2);

    expect(room.students.preferences[s1.id].includes(s2.id)).toBeTruthy();
  });

  it('should not add duplicates', () => {
    const s1 = addStudent(room);
    const s2 = addStudent(room);
    addStudentPreference(room, s1, s2);
    addStudentPreference(room, s1, s2);

    expect(room.students.preferences[s1.id]).toHaveLength(1);
  });
});

describe('removeStudentPreference', () => {
  it('should remove preference', () => {
    const s1 = addStudent(room);
    const s2 = addStudent(room);
    addStudentPreference(room, s1, s2);
    removeStudentPreference(room, s1, s2);

    expect(room.students.preferences[s1.id]).toHaveLength(0);
  });
});
