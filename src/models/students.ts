import { Data, CoreBase, Relationship } from './general';

export interface CoreStudent extends CoreBase {
  name: string;
}

export interface Students extends Data<CoreStudent> {
  preferences: Relationship
}
