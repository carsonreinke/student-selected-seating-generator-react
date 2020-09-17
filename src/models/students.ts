import { Data, CoreBase, MultipleRelationship } from './general';
import { Room } from './room';

export interface CoreStudent extends CoreBase {
  name: string;
}

export interface Students extends Data<CoreStudent> {
  preferences: MultipleRelationship
}

/**
 * Add a student preference
 *
 * @param Room room
 * @param CoreStudent student
 * @param CoreStudent preference
 */
export const addStudentPreference = (room: Room, student: CoreStudent, preference: CoreStudent): void => {
  const preferences = room.students.preferences[student.id];
  if (!preferences.includes(preference.id)) {
    preferences.push(preference.id);
  }
}

/**
 * Remove a student preference
 *
 * @param Room room
 * @param CoreStudent student
 * @param CoreStudent preference
 */
export const removeStudentPreference = (room: Room, student: CoreStudent, preference: CoreStudent): void => {
  const preferences = room.students.preferences[student.id];
  room.students.preferences[student.id] = preferences.filter(p => p !== preference.id);
}
