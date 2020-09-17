import RandomStrategy from '../random-strategy';
import { buildRoom, addDesk, addStudent } from '../room';
import { toArray } from '../../utils/collection';

describe('constructor', () => {
  it('should create object', () => {
    expect(new RandomStrategy()).not.toBeNull();
  });
});

describe('arrange', () => {
  it('should arrange empty room', () => {
    new RandomStrategy().arrange(buildRoom());
  });

  it('should arrange', () => {
    const room = buildRoom();

    [1, 2].forEach((val) => {
      addDesk(room);
      const student = addStudent(room);
      student.name = `Student #${val}`;
    });

    new RandomStrategy().arrange(room);

    const desks = toArray(room.desks);
    expect(room.desks.students[desks[0].id]).not.toBeNull();
    expect(room.desks.students[desks[1].id]).not.toBeNull();
    expect(room.desks.students[desks[0].id]).not.toEqual(room.desks.students[desks[1].id]);
  });
});
