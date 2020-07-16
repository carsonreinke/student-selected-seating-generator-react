import { combineReducers } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import roomReducer from './roomSlice';

const rootReducer = combineReducers({
  app: appReducer,
  room: roomReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export const selectExpanded = (state: RootState) => state.app.expanded;

export default rootReducer;
