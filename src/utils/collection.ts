import { Data, CoreBase } from '../models/general';

/**
 * Find parent containing child relationship
 *
 * @param {Object} relation
 * @param {string} childId
 * @return {string}
 */
export const findInRelationship = (relation: { [index: string]: string | string[] | null }, childId: string): string | null => {
  let related;

  for (const parentId of Object.getOwnPropertyNames(relation)) {
    related = relation[parentId];
    if ((Array.isArray(related) && related.includes(childId)) || related === childId) {
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
export const length = <T extends CoreBase>(object: Data<T>): number => {
  return Object.getOwnPropertyNames(object.data).length;
}

/**
 *
 * @param object
 */
export const toArray = <T extends CoreBase>(object: Data<T>): T[] => {
  return Object.values(object.data);
}
