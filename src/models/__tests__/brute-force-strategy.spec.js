import BruteForceStrategy from '../brute-force-strategy';
import Room from '../room';

test('constructor', () => {
  const strat = new BruteForceStrategy();
  expect(strat).not.toBeNull();
});

test('arrange empty', () => {
  const strat = new BruteForceStrategy();
  strat.arrange(new Room(strat));
});

test('averageDistance', () => {
  const room = new Room(new BruteForceStrategy());
  const d1 = room.addDesk(),
    d2 = room.addDesk();
  d1.student = room.addStudent();
  d2.student = room.addStudent();
  d1.student.addPreference(d2.student);
  d2.position.x = 10;

  expect(
    room.arrangementStrategy.averageDistance(room, d1.student)
  ).toEqual(10);
});

test('totalAverage', () => {
  const room = new Room(new BruteForceStrategy());

  var count = -1;
  while (++count < 3) {
    let d1 = room.addDesk(),
      d2 = room.addDesk();
    d1.student = room.addStudent();
    d2.student = room.addStudent();
    d1.student.addPreference(d2.student);
    d2.position.x = 10;
  }

  expect(
    room.arrangementStrategy.totalAverageDistance(room)
  ).toEqual(30);
});

test('arrange', () => {
  const studentCount = 8;
  const preferenceCount = 3;
  const strat = new BruteForceStrategy();
  const room = new Room(strat);
  let desk;

  for (let index = 0; index < studentCount; index++) {
    desk = room.addDesk();
    desk.position.x = index;
    desk.position.y = index;
    room.addStudent();
  }
  for (let index = 0; index < studentCount; index++) {
    const student = room.students[index];
    student.name = `Student #${index + 1}`;

    //Add student as preference on opposite side of array
    student.addPreference(room.students[Math.abs(index - studentCount) - 1]);
  }

  strat.arrange(room);

  room.desks.forEach((desk, index) => {
    expect(desk.student).not.toBeNull();
  });
});
