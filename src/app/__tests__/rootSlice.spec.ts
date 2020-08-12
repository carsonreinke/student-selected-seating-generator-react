import { selectExpanded, RootState, selectCurrentRoom, selectName, selectAllDesks, selectDeskCount, selectAllStudents, selectStudentCount, selectIsEmpty, selectVersions, selectNewVersion } from '../rootSlice';
import { buildRoom, addDesk, addStudent } from '../../models/room';

let state: RootState;

beforeEach(() => {
  state = {
    app: { expanded: false, versions: [] },
    room: { current: buildRoom(), newVersion: true }
  };
});

describe('selectors', () => {
  it('should select expanded', () => {
    state.app.expanded = false;
    expect(selectExpanded(state)).toBeFalsy();

    state.app.expanded = true;
    expect(selectExpanded(state)).toBeTruthy();
  });

  it('should select current room', () => {
    expect(selectCurrentRoom(state)).toEqual(state.room.current);
  });

  it('should select name', () => {
    state.room.current.name = 'Testing';

    expect(selectName(state)).toEqual('Testing');
  });

  it('should select desks', () => {
    const desk = addDesk(state.room.current);

    expect(selectAllDesks(state)).toEqual([desk]);
  });

  it('should select desk count', () => {
    addDesk(state.room.current);

    expect(selectDeskCount(state)).toEqual(1);
  });

  it('should select students', () => {
    const student = addStudent(state.room.current);

    expect(selectAllStudents(state)).toEqual([student]);
  });

  it('should select student count', () => {
    addStudent(state.room.current);

    expect(selectStudentCount(state)).toEqual(1);
  });

  it('should select is empty with no desks or students', () => {
    expect(selectIsEmpty(state)).toBeTruthy();
  });

  it('should select is empty with desk', () => {
    addDesk(state.room.current);

    expect(selectIsEmpty(state)).toBeFalsy();
  });

  it('should select is empty with student', () => {
    addStudent(state.room.current);

    expect(selectIsEmpty(state)).toBeFalsy();
  });

  it('should select versions', () => {
    const room = buildRoom();
    state.app.versions.push(room);

    expect(selectVersions(state)).toEqual([room]);
  });

  it('should select new version', () => {
    state.room.newVersion = true;

    expect(selectNewVersion(state)).toBeTruthy();
  });
});
