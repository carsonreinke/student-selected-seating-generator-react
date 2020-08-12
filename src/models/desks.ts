import { Data, CoreBase, Relationship } from './general';

export interface CoreDesk extends CoreBase {
  x: number;
  y: number;
  angle: number;
}

export interface Desks extends Data<CoreDesk> {
  students: Relationship
}

export function distance(o1: CoreDesk, o2: CoreDesk) {
  return Math.sqrt(
    Math.pow(o2.x - o1.x, 2) + Math.pow(o2.y - o1.y, 2)
  );
}
