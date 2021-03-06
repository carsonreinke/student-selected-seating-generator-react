import room, { addDesk, moveDesk, rotateDesk, removeDesk, addStudent, normalize, newVersion, removeStudent, loadVersion, editRoomName, addStudentPreference, removeStudentPreference, editStudentName, arrange } from '../roomSlice';
import { buildRoom, addDesk as roomAddDesk, addStudent as roomAddStudent } from '../../models/room';
import { mockStore } from '../../../tests/mockStore';
import { length, toArray } from '../../utils/collection';
import { RootState } from '../rootSlice';
import BruteForceStrategy from '../../models/brute-force-strategy';
import { assignStudent } from '../../models/desks';

const mockStrategyArrange = jest.fn();
jest.mock('../../models/brute-force-strategy', () => {
  return jest.fn().mockImplementation(() => {
    return { arrange: mockStrategyArrange };
  });
});

it('should use initial state', () => {
  expect(
    room(undefined, { type: '' }).current
  ).toHaveProperty('id');
});

describe('addDesk', () => {
  it('should action', () => {
    const state = room({ current: buildRoom(), newVersion: true }, addDesk);

    expect(length(state.current.desks)).toEqual(1);
  });
});

describe('moveDesk', () => {
  it('should move to new position', () => {
    const r = buildRoom();
    const desk = roomAddDesk(r);
    const state = room({ current: r, newVersion: true }, moveDesk(desk.id, 1, 2));

    expect(state.current.desks.data[desk.id].x).toEqual(1);
    expect(state.current.desks.data[desk.id].y).toEqual(2);
  });
});

describe('rotateDesk', () => {
  it('should rotate to new angle', () => {
    const r = buildRoom();
    const desk = roomAddDesk(r);
    const state = room({ current: r, newVersion: true }, rotateDesk(desk.id, 90));

    expect(state.current.desks.data[desk.id].angle).toEqual(90);
  });
});

describe('removeDesk', () => {
  it('should remove existing desk', () => {
    const r = buildRoom();
    const desk = roomAddDesk(r);
    const state = room({ current: r, newVersion: true }, removeDesk(desk.id));

    expect(toArray(state.current.desks)).toEqual([]);
  });
});

describe('addStudent', () => {
  it('action', () => {
    const state = room({ current: buildRoom(), newVersion: true }, addStudent);

    expect(length(state.current.students)).toEqual(1);
  });
});

describe('removeDesk', () => {
  it('should action', () => {
    const r = buildRoom();
    const student = roomAddStudent(r);
    const state = room({ current: r, newVersion: true }, removeStudent(student.id));

    expect(toArray(state.current.students)).toEqual([]);
  });

  it('should remove associated desk', () => {
    const r = buildRoom();
    const student = roomAddStudent(r);
    const desk = roomAddDesk(r);
    assignStudent(r, desk, student);
    const state = room({ current: r, newVersion: true }, removeStudent(student.id));

    expect(toArray(state.current.students)).toEqual([]);
    expect(toArray(state.current.desks)).toEqual([]);
  });
});

describe('loadVersion', () => {
  it('should action', () => {
    const r = buildRoom();

    const state = room({ current: buildRoom(), newVersion: true }, loadVersion(r));

    expect(state.current).toEqual(r);
    expect(state.newVersion).toBeFalsy();
  });
});

describe('normalize', () => {
  it('should empty', async () => {
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: buildRoom(), newVersion: true } });
    await store.dispatch(normalize());

    expect(store.getActions()).toEqual([]);
  });

  it('should too many desks', async () => {
    const room = buildRoom();
    roomAddDesk(room); roomAddDesk(room);
    roomAddStudent(room);
    const store = mockStore({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const state = store.getState();

    await store.dispatch(normalize());

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toEqual(addStudent.type);
  });

  it('should too many students', async () => {
    const room = buildRoom();
    roomAddDesk(room);
    roomAddStudent(room); roomAddStudent(room);
    const store = mockStore({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const state = store.getState();

    await store.dispatch(normalize());

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toEqual(removeStudent.type);
  });
});

describe('newVersion', () => {
  it('should state reset', async () => {
    const room = buildRoom();
    const store = mockStore({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: false } });

    await store.dispatch(newVersion());

    const types = store.getActions().map(action => action.type);
    expect(types).toContain('room/clearRoom');
    expect(types).toContain('room/toggleNewVersion');
    expect(types).toContain(addDesk.type);
  });
});

describe('editName', () => {
  it('should set name', () => {
    const name = 'Testing';
    const state = room({ current: buildRoom(), newVersion: true }, editRoomName(name));

    expect(state.current.name).toEqual(name);
  });
});

describe('addPreference', () => {
  it('should add preference', () => {
    const r = buildRoom();
    const s1 = roomAddStudent(r),
      s2 = roomAddStudent(r);

    const state = room({ current: r, newVersion: true }, addStudentPreference({ id: s1.id, preference: s2.id }));

    expect(state.current.students.preferences[s1.id]).toContain(s2.id);
  });

  it('should ignore duplicates', () => {
    const r = buildRoom();
    const s1 = roomAddStudent(r),
      s2 = roomAddStudent(r);
    r.students.preferences[s1.id].push(s2.id);

    const state = room({ current: r, newVersion: true }, addStudentPreference({ id: s1.id, preference: s2.id }));

    expect(state.current.students.preferences[s1.id].filter(id => id === s2.id)).toHaveLength(1);
  });
});

describe('removePreference', () => {
  it('should add preference', () => {
    const r = buildRoom();
    const s1 = roomAddStudent(r),
      s2 = roomAddStudent(r);
    r.students.preferences[s1.id].push(s2.id);

    const state = room({ current: r, newVersion: true }, removeStudentPreference({ id: s1.id, preference: s2.id }));

    expect(state.current.students.preferences[s1.id]).not.toContain(s2.id);
  });
});

describe('editStudentName', () => {
  it('should set name', () => {
    const r = buildRoom();
    const s = roomAddStudent(r);

    const state = room({ current: r, newVersion: true }, editStudentName({ id: s.id, name: 'Testing' }));

    expect(state.current.students.data[s.id].name).toEqual('Testing');
  });
});

describe('arrange', () => {
  it('should call strategy', () => {
    room({ current: buildRoom(), newVersion: true }, arrange);

    expect(BruteForceStrategy).toHaveBeenCalled();
    expect(mockStrategyArrange).toHaveBeenCalled();
  });
});
