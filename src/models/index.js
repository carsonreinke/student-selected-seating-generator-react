import Base, { PROP_OBJECT, PROP_ID, PROP_CLASS, OBJECT } from './base';
import Strategy from './strategy';
import BruteForceStrategy from './brute-force-strategy';
import RandomStrategy from './random-strategy';
import Position from './position';
import Desk from './desk';
import Student from './student';
import Room from './room';

const classes = [Base, Strategy, BruteForceStrategy, RandomStrategy, Position, Desk, Student, Room];

export function addClass(klass) {
  classes.push(klass);
};

/**
 *
 * @param Object object
 * @param Object refs
 */
const unmarshal = (object, refs) => {
  const klass = classes.find(kls => kls.name == object.__class__);
  if (!klass) {
    throw new Error(`Cannot find class "${object.__class__}"`);
  }
  const dest = new klass;

  //Add the unmarshalled object to the refs
  refs[object.id][PROP_OBJECT] = dest;

  //Re-usable closure for looking up exisitng object or instead unmarshalling
  const lookupOrUnmarshal = (value) => {
    let ref = refs[value.__ref__];
    let obj = ref[PROP_OBJECT]; //See if already unmarshalled
    if (!obj) {
      //Unmarshall the object
      obj = unmarshal(ref, refs);
    }
    return obj;
  };

  for (let [key, value] of Object.entries(object)) {
    //Ignore marshalling related properties
    if (key === PROP_ID || key === PROP_OBJECT || key === PROP_CLASS) {
      continue;
    }

    switch (typeof (value)) {
      case OBJECT:
        if (value === null) {
          dest[key] = null;
        }
        else if (Array.isArray(value)) {
          dest[key] = value.map((kv) => {
            return lookupOrUnmarshal(kv);
          });
        }
        else {
          dest[key] = lookupOrUnmarshal(value);
        }
        break;

      default:
        dest[key] = value;
    }
  }

  return dest;
}

export { classes };
export { unmarshal };
