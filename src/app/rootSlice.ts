import { combineReducers, createSelector } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import roomReducer from './roomSlice';
import { Room } from '../models/room';
import { CoreDesk } from '../models/desks';
import { toArray } from '../utils/collection';
import { CoreStudent } from '../models/students';

const rootReducer = combineReducers({
  app: appReducer,
  room: roomReducer
});

export type RootState = ReturnType<typeof rootReducer>;

//Room selectors
export const selectCurrentRoom = (state: RootState): Room => state.room.current;
export const selectName = createSelector(selectCurrentRoom, (room: Room): string => {
  return room.name;
});

//Desk selectors
export const selectAllDesks = createSelector(selectCurrentRoom, (room: Room): CoreDesk[] => {
  return toArray(room.desks);
});
export const selectDeskCount = createSelector(selectAllDesks, (desks: CoreDesk[]): number => {
  return desks.length;
});

//Student selectors
export const selectAllStudents = createSelector(selectCurrentRoom, (room: Room): CoreStudent[] => {
  return toArray(room.students);
});
export const selectStudentCount = createSelector(selectAllStudents, (students: CoreStudent[]): number => {
  return students.length;
});

// //General
export const selectExpanded = (state: RootState): boolean => state.app.expanded;
export const selectIsEmpty = createSelector([selectDeskCount, selectStudentCount], (c1: number, c2: number): boolean => {
  return c1 === 0 && c2 === 0;
});
export const selectVersions = (state: RootState): Room[] => state.app.versions;
export const selectNewVersion = (state: RootState): boolean => state.room.newVersion;

export default rootReducer;
