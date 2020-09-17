export interface CoreBase {
  id: string;
}

export interface Data<T extends CoreBase> {
  data: {
    [index: string]: T
  }
}

export interface MultipleRelationship {
  [index: string]: string[];
}

export interface SingleRelationship {
  [index: string]: string | null;
}

export interface Dimension {
  width: number;
  height: number;
}
