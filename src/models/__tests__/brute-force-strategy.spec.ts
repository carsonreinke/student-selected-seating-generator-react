import BruteForceStrategy from '../brute-force-strategy';
import { buildRoom, addDesk, addStudent } from '../room';
import { toArray } from '../../utils/collection';

describe('constructor', () => {
  it('should create object', () => {
    expect(new BruteForceStrategy()).not.toBeNull();
  });
});

describe('averageDistance', () => {
  it('should calculate', () => {
    const room = buildRoom();
    const d1 = addDesk(room);
    const d2 = addDesk(room);
    const s1 = addStudent(room);
    const s2 = addStudent(room);
    room.desks.students[d1.id] = [s1.id];
    room.desks.students[d2.id] = [s2.id];
    room.students.preferences[s1.id].push(s2.id);
    d1.x = 10;

    expect(new BruteForceStrategy().averageDistance(room, s1)).toEqual(10);
  });
});

describe('totalAverage', () => {
  it('should calculate', () => {
    const room = buildRoom();

    var count = -1;
    while (++count < 3) {

      let d1 = addDesk(room);
      let d2 = addDesk(room);
      let s1 = addStudent(room);
      let s2 = addStudent(room);
      room.desks.students[d1.id] = [s1.id];
      room.desks.students[d2.id] = [s2.id];
      room.students.preferences[s1.id] = [s2.id];
      d2.x = 10;
    }

    expect(
      new BruteForceStrategy().totalAverageDistance(room)
    ).toEqual(30);
  });
});

describe('arrange', () => {
  it('should arrange', () => {
    const studentCount = 8;
    const preferenceCount = 3;
    const strat = new BruteForceStrategy();
    const room = buildRoom();
    let desk;

    for (let index = 0; index < studentCount; index++) {
      desk = addDesk(room);
      desk.x = index;
      desk.y = index;
      addStudent(room);
    }
    const desks = toArray(room.desks);
    const students = toArray(room.students);
    for (let index = 0; index < studentCount; index++) {
      const student = students[index];
      student.name = `Student #${index + 1}`;

      //Add student as preference on opposite side of array
      room.students.preferences[student.id].push(students[Math.abs(index - studentCount) - 1].id);
    }

    strat.arrange(room);

    desks.forEach((desk, index) => {
      expect(room.desks.students[desk.id][0]).not.toBeNull();
    });
  });
});
