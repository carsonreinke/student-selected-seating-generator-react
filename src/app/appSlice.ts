import { createSlice, PayloadAction, Action, ThunkAction } from '@reduxjs/toolkit';
import Room from '../models/room';
import { unmarshal } from '../models';

const VERSION_PREFIX = 'sssg-';
const VERSION_REFS = '-refs';

const saveRoomToStorage = (storage: Storage, room: Room): void => {
  const refs = {},
    version = room.createdAt;

  storage.setItem(`${VERSION_PREFIX}${version}`, JSON.stringify(room.marshal(refs)));
  storage.setItem(`${VERSION_PREFIX}${version}${VERSION_REFS}`, JSON.stringify(refs));
};

const loadRoomFromStorage = (storage: Storage, version: string): Room => {
  const itemVersion = storage.getItem(`${version}`),
    itemRefs = storage.getItem(`${version}${VERSION_REFS}`);
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

type AppThunk = ThunkAction<void, AppState, null, Action<string>>;

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
  addVersion,
  clearVersions
} = appSlice.actions;

export default appSlice.reducer;

export const versions = (storage: Storage): AppThunk => async (dispatch) => {
  dispatch(clearVersions());
  [...Array(storage.length)].map((_, index) => storage.key(index))
    .filter(version => version && version.startsWith(VERSION_PREFIX))
    .filter(version => version && !version.endsWith(VERSION_REFS))
    .forEach((version) => {
      if (!version) {
        return;
      }

      //try {
        const room = loadRoomFromStorage(storage, version);
        dispatch(addVersion(room));
      //}
      //catch (err) {
        //TODO wrong place for this
      //  console.error(err);
      //}
    });
}

export const saveVersion = (storage: Storage, room: Room): AppThunk => async (dispatch, getState) => {
  saveRoomToStorage(storage, room);

  //Add version if new
  if (!getState().versions.includes(room)) {
    dispatch(addVersion(room));
  }
}
