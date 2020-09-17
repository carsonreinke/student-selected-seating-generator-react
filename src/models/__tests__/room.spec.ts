import { buildRoom, addDesk, addStudent, removeDesk, removeStudent, Room, findStudentDesk } from '../room';
import { CoreDesk, assignStudent } from '../desks';
import { CoreStudent } from '../students';

describe('buildRoom', () => {
  it('should create a default room', () => {
    const room = buildRoom();

    expect(room.id).not.toBeNull();
    expect(room.name).not.toBeNull();
    expect(room.createdAt).not.toBeNull();
  });
});

describe('addDesk', () => {
  let room: Room;

  beforeEach(() => {
    room = buildRoom();
  });

  it('should create a desk', () => {
    const desk = addDesk(room);

    expect(desk).not.toBeNull();
  });

  it('should add desks to list', () => {
    const desk = addDesk(room);

    expect(Object.keys(room.desks.data)).toContain(desk.id);
  });

  it('should add students list to desk', () => {
    const desk = addDesk(room);

    expect(Object.keys(room.desks.student)).toContain(desk.id);
    expect(room.desks.student[desk.id]).toBeNull();
  });
});

describe('addStudent', () => {
  let room: Room;

  beforeEach(() => {
    room = buildRoom();
  });

  it('should create a student', () => {
    const student = addStudent(room);

    expect(student).not.toBeNull();
  });

  it('should add students to list', () => {
    const student = addStudent(room);

    expect(Object.keys(room.students.data)).toContain(student.id);
  });

  it('should add preferences list to student', () => {
    const student = addStudent(room);

    expect(Object.keys(room.students.preferences)).toContain(student.id);
    expect(room.students.preferences[student.id]).toEqual([]);
  });
});

describe('removeDesk', () => {
  let room: Room,
    desk: CoreDesk;

  beforeEach(() => {
    room = buildRoom();
    desk = addDesk(room);
  });

  it('should remove desk from list', () => {
    removeDesk(room, desk);

    expect(Object.keys(room.desks.data)).not.toContain(desk.id);
    expect(Object.keys(room.desks.student)).not.toContain(desk.id);
  });

  it('should remove student', () => {
    const student = addStudent(room);
    assignStudent(room, desk, student)
    removeDesk(room, desk);

    expect(Object.keys(room.students.data)).not.toContain(student.id);
    expect(Object.keys(room.students.preferences)).not.toContain(student.id);
  });
});

describe('removeStudent', () => {
  let room: Room,
    student: CoreStudent;

  beforeEach(() => {
    room = buildRoom();
    student = addStudent(room);
  });

  it('should remove student from list', () => {
    removeStudent(room, student);

    expect(Object.keys(room.students.data)).not.toContain(student.id);
    expect(Object.keys(room.students.preferences)).not.toContain(student.id);
  });

  it('should remove desk', () => {
    const desk = addDesk(room);
    assignStudent(room, desk, student);
    removeStudent(room, student);

    expect(Object.keys(room.desks.data)).not.toContain(desk.id);
    expect(Object.keys(room.desks.student)).not.toContain(desk.id);
  });
});

describe('findStudentDesk', () => {
  it('should find desk when student assigned', () => {
    const room = buildRoom();
    const desk = addDesk(room);
    const student = addStudent(room);

    assignStudent(room, desk, student);

    expect(findStudentDesk(room, student)).toEqual(desk);
  });

  it('should be null when student not assigned', () => {
    const room = buildRoom();
    addDesk(room);
    const student = addStudent(room);

    expect(findStudentDesk(room, student)).toBeNull();
  });
});
