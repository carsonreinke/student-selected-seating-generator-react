import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Room from '../models/room';
import { unmarshal } from '../models';
import { stat } from 'fs';
import { AppThunk } from './store';

const VERSION_PREFIX = 'sssg-';
const VERSION_REFS = '-refs';
const INITIAL_DESKS = 6;

const saveRoomToStorage = (room: Room): void => {
  const refs = {},
    version = room.createdAt;

  window.localStorage.setItem(`${VERSION_PREFIX}${version}`, JSON.stringify(room.marshal(refs)));
  window.localStorage.setItem(`${VERSION_PREFIX}${version}${VERSION_REFS}`, JSON.stringify(refs));
};

const loadRoomFromStorage = (version: string): Room => {
  const itemVersion = window.localStorage.getItem(`${version}`),
    itemRefs = window.localStorage.getItem(`${version}${VERSION_REFS}`);
  if (!itemVersion || !itemRefs) {
    throw new Error('Missing correctly formatted data in local storage');
  }

  const object = JSON.parse(itemVersion),
    refs = JSON.parse(itemRefs);

  //TODO
  return unmarshal(object, refs) as Room;
};

interface AppState {
  expanded: boolean;
  versions: Room[];
  newVersion: boolean;
}

const initialState: AppState = {
  expanded: false,
  versions: [],
  newVersion: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggle: (state: AppState) => {
      state.expanded = !state.expanded
    },
    addVersion: (state: AppState, action: PayloadAction<Room>) => {
      state.versions.push(action.payload);
    },
    clearVersions: (state: AppState) => {
      state.versions = [];
    }
  }
});

export const {
  toggle,
  addVersion
} = appSlice.actions;

export default appSlice.reducer;

export const versions = (): AppThunk => async (dispatch) => {
  dispatch(appSlice.actions.clearVersions());
  [...Array(window.localStorage.length)].map((_, index) => window.localStorage.key(index))
    .filter(version => version && version.startsWith(VERSION_PREFIX))
    .filter(version => version && !version.endsWith(VERSION_REFS))
    .forEach((version) => {
      if(!version) {
        return;
      }

      try {
        const room = loadRoomFromStorage(version);
        dispatch(addVersion(room));
      }
      catch (err) {
        console.error(err);
      }
    });
}
