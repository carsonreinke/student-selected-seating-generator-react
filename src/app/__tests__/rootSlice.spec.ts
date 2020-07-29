import { selectExpanded, RootState, selectCurrentRoom, selectName, selectAllDesks, selectDeskCount, selectAllStudents, selectStudentCount, selectIsEmpty, selectVersions, selectNewVersion } from '../rootSlice';
import { buildRoom, addDesk, addStudent } from '../../models/room';

let state: RootState;

beforeEach(() => {
  state = {
    app: {expanded: false, versions: []},
    room: {current: buildRoom(), newVersion: true}
  };
});

test('select expanded', () => {
  state.app.expanded = false;
  expect(selectExpanded(state)).toBeFalsy();

  state.app.expanded = true;
  expect(selectExpanded(state)).toBeTruthy();
});

test('select current room', () => {
  expect(selectCurrentRoom(state)).toEqual(state.room.current);
});

test('select name', () => {
  state.room.current.name = 'Testing';

  expect(selectName(state)).toEqual('Testing');
});

test('select desks', () => {
  const desk = addDesk(state.room.current);

  expect(selectAllDesks(state)).toEqual([desk]);
});

test('select desk count', () => {
  addDesk(state.room.current);

  expect(selectDeskCount(state)).toEqual(1);
});

test('select students', () => {
  const student = addStudent(state.room.current);

  expect(selectAllStudents(state)).toEqual([student]);
});

test('select student count', () => {
  addStudent(state.room.current);

  expect(selectStudentCount(state)).toEqual(1);
});

test('select is empty with no desks or students', () => {
  expect(selectIsEmpty(state)).toBeTruthy();
});

test('select is empty with desk', () => {
  addDesk(state.room.current);

  expect(selectIsEmpty(state)).toBeFalsy();
});

test('select is empty with student', () => {
  addStudent(state.room.current);

  expect(selectIsEmpty(state)).toBeFalsy();
});

test('select versions', () => {
  const room = buildRoom();
  state.app.versions.push(room);

  expect(selectVersions(state)).toEqual([room]);
});

test('select new version', () => {
  state.room.newVersion = true;

  expect(selectNewVersion(state)).toBeTruthy();
});
