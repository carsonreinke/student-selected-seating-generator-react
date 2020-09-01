export interface CoreBase {
  id: string;
}

export interface Data<T extends CoreBase> {
  data: {
    [index: string]: T
  }
}

export interface Relationship {
  [index: string]: string[];
}

export interface Dimension {
  width: number;
  height: number;
}
