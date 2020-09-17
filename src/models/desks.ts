import { Data, CoreBase, SingleRelationship } from './general';
import { Room } from './room';
import { CoreStudent } from './students';

export interface CoreDesk extends CoreBase {
  x: number;
  y: number;
  angle: number;
}

export interface Desks extends Data<CoreDesk> {
  student: SingleRelationship
}

/**
 * Calculate distance between desks
 *
 * @param CoreDesk o1
 * @param CoreDesk o2
 * @returns number
 */
export const distance = (o1: CoreDesk, o2: CoreDesk): number => {
  return Math.sqrt(
    Math.pow(o2.x - o1.x, 2) + Math.pow(o2.y - o1.y, 2)
  );
}

/**
 * Assign student (or resets) to desk
 *
 * @param Room room
 * @param Desk desk
 * @param Student student
 */
export const assignStudent = (room: Room, desk: CoreDesk, student: CoreStudent | null): void => {
  room.desks.student[desk.id] = student ? student.id : null;
};
