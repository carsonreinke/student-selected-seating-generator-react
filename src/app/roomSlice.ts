import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Room from '../models/room';
import BruteForceStrategy from '../models/brute-force-strategy';

interface RoomState {
  current: Room
}

const initialState: RoomState = {
  current: new Room(new BruteForceStrategy())
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    loadVersion: (state: RoomState, action: PayloadAction<Room>) => {
      state.current = action.payload;
    }
  }
});

export const { loadVersion } = roomSlice.actions;

export default roomSlice.reducer;

/*
import Vue from 'vue';
import Vuex from 'vuex';
import Room from '@/models/room';
import BruteForceStrategy from '@/models/brute-force-strategy';
import { unmarshal } from '@/models';

Vue.use(Vuex);

//const debug = process.env.NODE_ENV !== 'production'

const VERSION_PREFIX = 'sssg-';
const VERSION_REFS = '-refs';
const INITIAL_DESKS = 6;

const saveRoomToStorage = (room) => {
  const refs = {},
    version = room.createdAt;

  window.localStorage.setItem(`${VERSION_PREFIX}${version}`, JSON.stringify(room.marshal(refs)));
  window.localStorage.setItem(`${VERSION_PREFIX}${version}${VERSION_REFS}`, JSON.stringify(refs));
};

const loadRoomFromStorage = (version) => {
  const object = JSON.parse(window.localStorage.getItem(`${version}`)),
    refs = JSON.parse(window.localStorage.getItem(`${version}${VERSION_REFS}`));

  return unmarshal(object, refs);
};

export default new Vuex.Store({
  state: {
    room: new Room(new BruteForceStrategy()),
    versions: [],
    newVersion: false,
  },
  getters: {
    allDesks: (state) => state.room.desks,
    deskCount: (state) => state.room.desks.length,
    isEmpty: (state) => state.room.desks.length === 0,
    allStudents: (state) => state.room.students,
    studentCount: (state) => state.room.students.length,
    versions: (state) => state.versions,
    newVersion: (state) => state.newVersion,
    name: (state) => state.room.name,
  },
  actions: {
    addDesk: ({ commit }) => {
      commit('ADD_DESK');
    },
    moveDesk: ({ commit }, { desk, x, y }) => {
      commit('EDIT_DESK_POSITION', { desk, x, y });
    },
    rotateDesk: ({ commit }, { desk, angle }) => {
      commit('EDIT_DESK_ANGLE', { desk, angle });
    },
    removeDesk: ({ commit }, desk) => {
      commit('REMOVE_DESK', desk);

      //Also remove student if any
      if (desk.student) {
        commit('REMOVE_STUDENT', desk.student);
      }
    },
    arrange: ({ commit }) => {
      commit('ARRANGE');
    },
    addStudent: ({ commit }) => commit('ADD_STUDENT'),
    removeStudent: ({ commit }, student) => {
      commit('REMOVE_STUDENT', student);

      //Also remove desk if any
      if (student.desk) {
        commit('REMOVE_DESK', student.desk);
      }
    },
    normalize: (context) => {
      const diff = context.getters.deskCount - context.getters.studentCount;

      if (diff < 0) {
        context.getters.allStudents.slice(diff).forEach((student) => context.dispatch('removeStudent', student));
      }
      else if (diff > 0) {
        [...Array(diff)].forEach(() => context.dispatch('addStudent'));
      }
    },
    changeStudentName: ({ commit }, { student, name }) => {
      commit('CHANGE_STUDENT_NAME', { student, name });
    },
    addPreference: ({ commit }, { student, preference }) => {
      commit('ADD_PREFERENCE', { student, preference });
    },
    removePreference: ({ commit }, { student, preference }) => {
      commit('REMOVE_PREFERENCE', { student, preference });
    },
    arrange: ({ commit }) => {
      commit('ARRANGE');
    },
    newVersion: (context) => {
      context.commit('CLEAR_ROOM');
      return context.dispatch('toggleNewVersion', true).then(() => {
        return Promise.all([...Array(INITIAL_DESKS)].map(() => {
          context.dispatch('addDesk');
        }));
      }).then(() => {
        return context.dispatch('normalize');
      });
    },
    versions: ({ commit }) => {
      commit('CLEAR_VERSIONS');
      [...Array(window.localStorage.length)].map((_, index) => window.localStorage.key(index))
        .filter(version => version.startsWith(VERSION_PREFIX))
        .filter(version => !version.endsWith(VERSION_REFS))
        .forEach((version) => {
          let room;
          try {
            room = loadRoomFromStorage(version)
          }
          catch (e) {
            console.error(e);
          }
          commit('ADD_VERSION', room);
        });
    },
    loadVersion: ({ commit }, version) => {
      commit('LOAD_ROOM', version);
    },
    saveVersion: (context) => {
      const room = context.state.room;

      saveRoomToStorage(room);

      //Add verison if new
      if (!context.state.versions.includes(room)) {
        context.commit('ADD_VERSION', room);
      }
    },
    toggleNewVersion: ({ commit }, newVersion) => {
      commit('TOGGLE_NEW_VERSION', newVersion);
    },
    editName: ({ commit }, name) => {
      commit('EDIT_NAME', name);
    },
  },
  mutations: {
    ADD_DESK: (state) => {
      state.room.addDesk();
    },
    EDIT_DESK_POSITION: (state, { desk, x, y }) => {
      desk.position.x = x;
      desk.position.y = y;
    },
    EDIT_DESK_ANGLE: (state, { desk, angle }) => {
      desk.position.angle = angle;
    },
    REMOVE_DESK: (state, desk) => {
      state.room.removeDesk(desk);
    },
    ARRANGE: (state) => {
      state.room.arrange();
    },
    ADD_STUDENT: (state) => {
      const student = state.room.addStudent();
      student.name = `Student ${state.room.students.length}`
    },
    REMOVE_STUDENT: (state, student) => {
      state.room.removeStudent(student);
    },
    CHANGE_STUDENT_NAME: (state, { student, name }) => {
      student.name = name;
    },
    ADD_PREFERENCE: (state, { student, preference }) => {
      student.addPreference(preference);
    },
    REMOVE_PREFERENCE: (state, { student, preference }) => {
      student.removePreference(preference);
    },
    ARRANGE: (state) => {
      state.room.arrange();
    },
    CLEAR_ROOM: (state) => {
      state.room = new Room(new BruteForceStrategy());
    },
    LOAD_ROOM: (state, room) => {
      state.room = room;
    },
    CLEAR_VERSIONS: (state) => {
      state.versions = [];
    },
    ADD_VERSION: (state, version) => {
      state.versions.push(version);
    },
    TOGGLE_NEW_VERSION: (state) => {
      state.newVersion = !state.newVersion;
    },
    EDIT_NAME: (state, name) => {
      state.room.name = name;
    },
  }
});

*/
