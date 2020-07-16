let nextId = 0;

export const PROP_REF = '__ref__',
  PROP_CLASS = '__class__',
  PROP_OBJECT = '__object__',
  PROP_ID = 'id',
  OBJECT = 'object';

export default class Base {
  constructor() {
    this.id = nextId++;
  }

  /**
   * Converts object(s) into a format capable of persistence
   *
   * @param Object refs
   * @returns Object
   */
  marshal(refs) {
    const object = {
      [PROP_CLASS]: this.constructor.name,
    };
    //Immediately add current object for short-circuit
    refs[this.id] = object;

    //Re-usable closure for looking up exisitng object or instead marshalling
    const lookupOrMarshal = (value) => {
      //Provide reference to object
      let ref = refs[value.id];
      if (!ref) {
        ref = value.marshal(refs);
      }
      return {
        [PROP_REF]: ref.id,
      };
    };

    //Go through each property of object
    for (let [key, value] of Object.entries(this)) {
      switch (typeof (value)) {
        case OBJECT:
          //Null is an object
          if (value === null) {
            object[key] = null;
          }
          else if (Array.isArray(value)) {
            object[key] = value.map((kv) => {
              return lookupOrMarshal(kv);
            });
          }
          else {
            object[key] = lookupOrMarshal(value);
          }
          break;

        default:
          object[key] = value;
      }
    }

    return object;
  }
}
