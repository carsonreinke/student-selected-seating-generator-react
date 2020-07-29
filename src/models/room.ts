import { Desks, CoreDesk } from './desks';
import { Students, CoreStudent } from './students';
import { CoreBase } from './general';
import createDataId from '../utils/data-id';
import { length, findInRelationship } from '../utils/collection';

export interface Room extends CoreBase {
  name: string;
  createdAt: string;
  desks: Desks;
  students: Students;
}

export const buildRoom = (): Room => {
  return {
    id: createDataId(),
    name: 'Room',
    createdAt: new Date().toISOString(),
    desks: {
      data: {},
      students: {}
    },
    students: {
      data: {},
      preferences: {}
    }
  };
};

export const addDesk = (room: Room): CoreDesk => {
  const id = createDataId();
  const desk: CoreDesk = {
    id,
    x: 0,
    y: 0,
    angle: 0
  };
  room.desks.data[id] = desk;
  room.desks.students[id] = [];

  return desk;
};

export const addStudent = (room: Room): CoreStudent => {
  const id = createDataId();
  const student: CoreStudent = {
    id,
    name: `Student ${length(room.students) + 1}`
  };
  room.students.data[id] = student;
  room.students.preferences[id] = [];

  return student;
};

export const removeDesk = (room: Room, deskId: string): void => {
  const studentId = room.desks.students[deskId][0];

  delete room.desks.data[deskId];
  delete room.desks.students[deskId];

  if (studentId) {
    delete room.students.data[studentId];
    delete room.students.preferences[studentId];
  }
}

export const removeStudent = (room: Room, studentId: string): void => {
  delete room.students.data[studentId];
  delete room.students.preferences[studentId];

  const deskId = findInRelationship(room.desks.students, studentId);
  if (deskId) {
    delete room.desks.data[deskId];
    delete room.desks.students[deskId];
  }
}
