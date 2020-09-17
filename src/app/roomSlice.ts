import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import { length } from '../utils/collection';
import { Room, buildRoom, addDesk as roomAddDesk, removeDesk as roomRemoveDesk, addStudent as roomAddStudent, removeStudent as roomRemoveStudent } from '../models/room';
import BruteForceStrategy from '../models/brute-force-strategy';

const INITIAL_DESKS = 6;

interface RoomState {
  current: Room;
  newVersion: boolean;
}

interface MoveDeskPayload {
  id: string;
  x: number;
  y: number;
}

interface RotateDeskPayload {
  id: string;
  angle: number;
}

interface EditDimensionPayload {
  width: number;
  height: number;
}

interface StudentPreferencePayload {
  id: string;
  preference: string;
}

interface StudentNameChange {
  id: string;
  name: string;
}

const initialState: RoomState = {
  current: buildRoom(),
  newVersion: true
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    loadVersion: (state: RoomState, action: PayloadAction<Room>) => {
      state.current = action.payload;
      state.newVersion = false;
    },
    addDesk: (state: RoomState) => {
      roomAddDesk(state.current);
    },
    removeDesk: (state: RoomState, action: PayloadAction<string>) => {
      roomRemoveDesk(state.current, action.payload);
    },
    addStudent: (state: RoomState) => {
      roomAddStudent(state.current);
    },
    removeStudent: (state: RoomState, action: PayloadAction<string>) => {
      roomRemoveStudent(state.current, action.payload);
    },
    moveDesk: {
      reducer: (state: RoomState, action: PayloadAction<MoveDeskPayload>) => {
        const desk = state.current.desks.data[action.payload.id];
        desk.x = action.payload.x;
        desk.y = action.payload.y;
      },
      prepare: (desk: string, x: number, y: number) => {
        return {
          payload: {
            id: desk, x, y
          }
        };
      }
    },
    rotateDesk: {
      reducer: (state: RoomState, action: PayloadAction<RotateDeskPayload>) => {
        const desk = state.current.desks.data[action.payload.id];
        desk.angle = action.payload.angle;
      },
      prepare: (desk: string, angle: number) => {
        return {
          payload: {
            id: desk, angle
          }
        };
      }
    },
    clearRoom: (state: RoomState) => {
      state.current = buildRoom();
    },
    toggleNewVersion: (state: RoomState, action: PayloadAction<boolean>) => {
      state.newVersion = action.payload;
    },
    editRoomName: (state: RoomState, action: PayloadAction<string>) => {
      state.current.name = action.payload;
    },
    addStudentPreference: (state: RoomState, action: PayloadAction<StudentPreferencePayload>) => {
      const preferences = state.current.students.preferences[action.payload.id];
      if(!preferences.includes(action.payload.preference)) {
        preferences.push(action.payload.preference);
      }
    },
    removeStudentPreference: (state: RoomState, action: PayloadAction<StudentPreferencePayload>) => {
      state.current.students.preferences[action.payload.id] =
        state.current.students.preferences[action.payload.id].filter(preference => preference !== action.payload.preference);
    },
    editStudentName: (state: RoomState, action: PayloadAction<StudentNameChange>) => {
      state.current.students.data[action.payload.id].name = action.payload.name;
    },
    arrange: (state: RoomState) => {
      new BruteForceStrategy().arrange(state.current);
    }
  }
});

export const {
  loadVersion,
  removeDesk,
  addDesk,
  removeStudent,
  addStudent,
  moveDesk,
  rotateDesk,
  editRoomName,
  toggleNewVersion,
  addStudentPreference,
  removeStudentPreference,
  editStudentName,
  arrange
} = roomSlice.actions;

export default roomSlice.reducer;

/**
 *
 */
export const normalize = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const diff = length(state.room.current.desks)
    - length(state.room.current.students);

  if (diff < 0) {
    Object.getOwnPropertyNames(state.room.current.students.data).slice(diff).forEach((student: string) => dispatch(removeStudent(student)));
  }
  else if (diff > 0) {
    [...Array(diff)].forEach(() => dispatch(addStudent()));
  }
};

/**
 *
 */
export const newVersion = (): AppThunk => async (dispatch) => {
  await dispatch(roomSlice.actions.clearRoom());
  await dispatch(roomSlice.actions.toggleNewVersion(true));

  await Promise.all([...Array(INITIAL_DESKS)].map(async () => {
    return dispatch(addDesk());
  }));

  await dispatch(normalize());
}
