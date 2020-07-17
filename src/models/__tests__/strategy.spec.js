import Strategy from '../strategy';
import Room from '../room';

test('distance', () => {
  const room = new Room();
  room.arrangementStrategy = new Strategy();

  const d1 = room.addDesk(),
    d2 = room.addDesk();
  d1.student = room.addStudent();
  d2.student = room.addStudent();

  expect(room.arrangementStrategy.distance(room, d1.student, d2.student)).toEqual(0);

  d2.position.x = 10;
  expect(room.arrangementStrategy.distance(room, d1.student, d2.student)).toEqual(10);
});
