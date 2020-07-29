import { Data, CoreBase } from "../models/general";

/**
 * Find parent containing child relationship
 *
 * @param {Object} relation
 * @param {string} childId
 * @return {string}
 */
export function findInRelationship(relation: {[index: string]: string[]}, childId: string): string | null {
  for (const parentId of Object.getOwnPropertyNames(relation)) {
    if(relation[parentId].includes(childId)) {
      return parentId;
    }
  }

  return null;
}

/**
 * Length of a object with a data element
 *
 * @param {Object} object
 * @return {number}
 */
export function length<T extends CoreBase>(object: Data<T>): number {
  return Object.getOwnPropertyNames(object.data).length;
}

/**
 *
 * @param object
 */
export function toArray<T extends CoreBase>(object: Data<T>): T[] {
  return Object.values(object.data);
}
