import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Room from '../models/room';
import BruteForceStrategy from '../models/brute-force-strategy';

interface RoomState {
  room: Room
}

const initialState: RoomState = {
  room: new Room(new BruteForceStrategy())
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    loadVersion: (state: RoomState, action: PayloadAction<Room>) => {
      state.room = action.payload;
    }
  }
});

export const { loadVersion } = roomSlice.actions;

export default roomSlice.reducer;
