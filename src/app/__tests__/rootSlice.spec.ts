import { selectExpanded, RootState, selectCurrentRoom, selectName, selectAllDesks, selectDeskCount, selectAllStudents, selectStudentCount, selectIsEmpty, selectVersions, selectNewVersion } from '../rootSlice';
import Room from '../../models/room';

let state: RootState;

beforeEach(() => {
  state = {
    app: {expanded: false, newVersion: false, versions: []},
    room: {current: new Room()}
  };
});

it('select expanded', () => {
  state.app.expanded = false;
  expect(selectExpanded(state)).toBeFalsy();

  state.app.expanded = true;
  expect(selectExpanded(state)).toBeTruthy();
});

it('select current room', () => {
  expect(selectCurrentRoom(state)).toEqual(state.room.current);
});

it('select name', () => {
  state.room.current.name = 'Testing';

  expect(selectName(state)).toEqual('Testing');
});

it('select desks', () => {
  const desk = state.room.current.addDesk();

  expect(selectAllDesks(state)).toEqual([desk]);
});

it('select desk count', () => {
  state.room.current.addDesk();

  expect(selectDeskCount(state)).toEqual(1);
});

it('select students', () => {
  const student = state.room.current.addStudent();

  expect(selectAllStudents(state)).toEqual([student]);
});

it('select student count', () => {
  state.room.current.addStudent();

  expect(selectStudentCount(state)).toEqual(1);
});

it('select is empty with no desks or students', () => {
  expect(selectIsEmpty(state)).toBeTruthy();
});

it('select is empty with desk', () => {
  state.room.current.addDesk();

  expect(selectIsEmpty(state)).toBeFalsy();
});

it('select is empty with student', () => {
  state.room.current.addStudent();

  expect(selectIsEmpty(state)).toBeFalsy();
});

it('select versions', () => {
  const room = new Room();
  state.app.versions.push(room);

  expect(selectVersions(state)).toEqual([room]);
});

it('select new version', () => {
  state.app.newVersion = true;

  expect(selectNewVersion(state)).toBeTruthy();
});
