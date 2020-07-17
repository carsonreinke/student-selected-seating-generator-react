import Room from '../room';
import RandomStrategy from '../random-strategy';

test('constructor', () => {
  const obj = new Room();
  expect(obj).not.toBeNull();
});

test('arrange', () => {
  const strategy = new RandomStrategy();
  jest.spyOn(strategy, 'arrange');
  const obj = new Room(strategy);

  obj.arrange();

  expect(strategy.arrange).toHaveBeenCalled();
});

test('findStudentDesk', () => {
  const room = new Room();
  const desk = room.addDesk();
  desk.student = room.addStudent();

  expect(room.findStudentDesk(desk.student)).toEqual(desk);
});

test('findStudentDesk missing', () => {
  const room = new Room();
  const student = room.addStudent();

  expect(room.findStudentDesk(student)).toBeUndefined();
});

test('findStudentDesk multiple', () => {
  const room = new Room();
  const d1 = room.addDesk(),
    d2 = room.addDesk();
  d1.student = room.addStudent();
  d2.student = room.addStudent();

  expect(room.findStudentDesk(d2.student)).toEqual(d2);
});

test('createdAtDate', () => {
  const room = new Room();
  expect(room.createdAtDate()).toBeInstanceOf(Date);
});

test('removeStudent', () => {
  const room = new Room();
  const student = room.addStudent();

  expect(room.students).toContain(student);
  room.removeStudent(student);
  expect(room.students).not.toContain(student);
});

test('removeDesk', () => {
  const room = new Room();
  const desk = room.addDesk();

  expect(room.desks).toContain(desk);
  room.removeDesk(desk);
  expect(room.desks).not.toContain(desk);
});
