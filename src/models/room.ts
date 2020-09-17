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

/**
 * Creates a new room
 *
 * @returns Room
 */
export const buildRoom = (): Room => {
  return {
    id: createDataId(),
    name: 'Room',
    createdAt: new Date().toISOString(),
    desks: {
      data: {},
      student: {}
    },
    students: {
      data: {},
      preferences: {}
    }
  };
};

/**
 * Adds desk to room
 *
 * @param Room room
 * @returns CoreDesk
 */
export const addDesk = (room: Room): CoreDesk => {
  const id = createDataId();
  const desk: CoreDesk = {
    id,
    x: 0,
    y: 0,
    angle: 0
  };
  room.desks.data[id] = desk;
  room.desks.student[id] = null;

  return desk;
};

/**
 * Adds student to room
 *
 * @param Room room
 * @returns CoreStudent
 */
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

/**
 * Removes a desk from a room
 *
 * @param Room room
 * @param CoreDesk desk
 */
export const removeDesk = (room: Room, desk: CoreDesk): void => {
  const studentId = room.desks.student[desk.id];

  delete room.desks.data[desk.id];
  delete room.desks.student[desk.id];

  if (studentId) {
    delete room.students.data[studentId];
    delete room.students.preferences[studentId];
  }
}

/**
 * Removes a student from a room
 *
 * @param Room room
 * @param CoreStudent student
 */
export const removeStudent = (room: Room, student: CoreStudent): void => {
  delete room.students.data[student.id];
  delete room.students.preferences[student.id];

  const deskId = findInRelationship(room.desks.student, student.id);
  if (deskId) {
    delete room.desks.data[deskId];
    delete room.desks.student[deskId];
  }
}

/**
 * Finds a desk that a student is assigned to
 *
 * @param Room room
 * @param CoreStudent student
 * @returns CoreDesk|null
 */
export const findStudentDesk = (room: Room, student: CoreStudent): CoreDesk | null => {
  const deskId = findInRelationship(room.desks.student, student.id);
  if (deskId) {
    return room.desks.data[deskId];
  }
  return null;
}
