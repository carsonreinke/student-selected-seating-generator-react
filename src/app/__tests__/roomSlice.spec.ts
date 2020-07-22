import room, { addDesk, moveDesk, rotateDesk, removeDesk, addStudent, normalize, newVersion, removeStudent } from '../roomSlice';
import Room from '../../models/room';
import Desk from '../../models/desk';
import { mockStore } from '../../../tests/mockStore';

test('initial state', () => {
  expect(
    room(undefined, { type: '' }).current
  ).toBeInstanceOf(Room);
});

describe('add desk', () => {
  test('action', () => {
    const state = room({current: new Room(), newVersion: true}, addDesk);

    expect(state.current.desks.length).toEqual(1);
  });
});

describe('move desk', () => {
  test('move to new position', () => {
    const r = new Room();
    const desk = r.addDesk();
    const state = room({current: r, newVersion: true}, moveDesk(desk, 1, 2));

    expect(desk.position.x).toEqual(1);
    expect(desk.position.y).toEqual(2);
  });
});

describe('rotate desk', () => {
  test('rotate to new angle', () => {
    const r = new Room();
    const desk = r.addDesk();
    const state = room({current: r, newVersion: true}, rotateDesk(desk, 90));

    expect(desk.position.angle).toEqual(90);
  });
});

describe('remove desk', () => {
  test('remove existing desk', () => {
    const r = new Room();
    const desk = r.addDesk();
    const state = room({current: r, newVersion: true}, removeDesk(desk));

    expect(state.current.desks).toEqual([]);
  });
});

describe('add student', () => {
  test('action', () => {
    const state = room({current: new Room(), newVersion: true}, addStudent);

    expect(state.current.students.length).toEqual(1);
  });
});

describe('remove desk', () => {
  test('action', () => {
    const r = new Room();
    const student = r.addStudent();
    const state = room({current: r, newVersion: true}, removeStudent(student));

    expect(state.current.students).toEqual([]);
  });

  test('remove associated desk', () => {
    const r = new Room();
    const student = r.addStudent();
    const desk = r.addDesk();
    desk.student = student;
    const state = room({current: r, newVersion: true}, removeStudent(student));

    expect(state.current.students).toEqual([]);
    expect(state.current.desks).toEqual([]);
  });
});

describe('normalize', () => {
  test('empty', async () => {
    const store = mockStore({current: new Room(), newVersion: true});
    await store.dispatch(normalize());

    expect(store.getActions()).toEqual([]);
  });

  test('too many desks', async () => {
    const room = new Room();
    room.addDesk(); room.addDesk();
    room.addStudent();
    const store = mockStore({current: room, newVersion: true});
    const state = store.getState();

    await store.dispatch(normalize());

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toEqual(addStudent.type);
  });

  test('too many students', async () => {
    const room = new Room();
    room.addDesk();
    room.addStudent(); room.addStudent();
    const store = mockStore({current: room, newVersion: true});
    const state = store.getState();

    await store.dispatch(normalize());

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toEqual(removeStudent.type);
  });
});

describe('new version', () => {
  test('state reset', async () => {
    const room = new Room();
    const store = mockStore({current: room, newVersion: false});

    await store.dispatch(newVersion());

    const types = store.getActions().map(action => action.type);
    expect(types).toContain('room/clearRoom');
    expect(types).toContain('room/toggleNewVersion');
    expect(types).toContain(addDesk.type);
  });
});
