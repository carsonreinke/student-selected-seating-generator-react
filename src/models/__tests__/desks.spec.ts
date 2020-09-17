import { distance, assignStudent } from '../desks';
import createDataId from '../../utils/data-id';
import { Room, buildRoom, addDesk, addStudent } from '../room';

describe('distance', () => {
  it('should be zero when same location', () => {
    const o1 = { id: createDataId(), x: 0, y: 0, angle: 0 };
    const o2 = { id: createDataId(), x: 0, y: 0, angle: 0 };
    expect(distance(o1, o2)).toEqual(0)
  });

  it('should calculate distance between', () => {
    const o1 = { id: createDataId(), x: 0, y: 0, angle: 0 };
    const o2 = { id: createDataId(), x: 1, y: 1, angle: 0 };
    expect(distance(o1, o2)).toBeCloseTo(1.4, 1);
    expect(distance(o2, o1)).toBeCloseTo(1.4, 1);
  });
});

describe('assignStudent', () => {
  let room: Room;

  beforeEach(() => {
    room = buildRoom();
  });

  it('should assign a student', () => {
    const desk = addDesk(room);
    const student = addStudent(room);
    assignStudent(room, desk, student);

    expect(room.desks.student[desk.id]).toEqual(student.id);
  });

  it('should reset student', () => {
    const desk = addDesk(room);
    assignStudent(room, desk, null);

    expect(room.desks.student[desk.id]).toBeNull();
  });
});
