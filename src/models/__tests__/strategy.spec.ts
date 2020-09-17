import Strategy from '../strategy';
import { buildRoom, addDesk, addStudent, Room } from '../room';
import { CoreStudent } from '../students';
import { toArray } from '../../utils/collection';

let room: Room, students: CoreStudent[];

describe('constructor', () => {
  it('should create object', () => {
    expect(new Strategy()).not.toBeNull();
  });
});

describe('distance', () => {
  beforeEach(() => {
    room = buildRoom();
    students = [0, 1].map(() => {
      const desk = addDesk(room);
      const student = addStudent(room);

      room.desks.students[desk.id] = [student.id];

      return student;
    });
  });

  it('should calculate zero when at same location', () => {
    expect(new Strategy().distance(room, students[0], students[1])).toEqual(0);
  });

  it('should calculate distance', () => {
    toArray(room.desks)[0].x = 10;
    expect(new Strategy().distance(room, students[0], students[1])).toEqual(10);
  });
});
