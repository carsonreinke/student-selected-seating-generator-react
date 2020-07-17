import RandomStrategy from '../random-strategy';
import Room from '../room';

test('constructor', () => {
  const strat = new RandomStrategy();
  expect(strat).not.toBeNull();
});

test('arrange empty', () => {
  const strat = new RandomStrategy();
  strat.arrange(new Room(strat));
});

test('arrange', () => {
  const strat = new RandomStrategy();
  const room = new Room(strat);

  room.addDesk(); room.addDesk();
  room.addStudent().name = 'Student #1';
  room.addStudent().name = 'Student #2';

  strat.arrange(room);

  expect(room.desks[0].student).not.toBeNull();
  expect(room.desks[1].student).not.toBeNull();
  expect(room.desks[0].student).not.toEqual(room.desks[1].student);
});
