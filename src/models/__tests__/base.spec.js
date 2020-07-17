import Base from '../base';

class Mock extends Base { }

class Related extends Base {
  constructor() {
    super();
    this.related = null;
    this.property = null;
  }
}

test('id', () => {
  expect(new Mock().id.toString()).toMatch(/\d+/);
});

test('id unique', () => {
  expect(new Mock().id).not.toEqual(new Mock().id);
});

describe('marshall', () => {
  test('simple', () => {
    const refs = {};
    const object = new Mock().marshal(refs);

    expect(refs[object.id]).toEqual(object);
  });

  test('null', () => {
    expect(new Related().marshal({}).property).toBeNull();
  });

  test('property', () => {
    const obj = new Related();
    obj.property = 'testing';

    expect(obj.marshal({}).property).toEqual(obj.property);
  });

  test('circular', () => {
    const obj1 = new Related(),
      obj2 = new Related();
    obj1.related = obj2;
    obj2.related = obj1;
    const refs = {};

    const object = obj1.marshal(refs);
    expect(object).toEqual({
      '__class__': 'Related',
      'id': obj1.id,
      'related': { '__ref__': obj2.id },
      'property': null,
    });
    expect(refs[obj1.id]).toEqual({
      '__class__': 'Related',
      'id': obj1.id,
      'related': { '__ref__': obj2.id },
      'property': null,
    });
    expect(refs[obj2.id]).toEqual({
      '__class__': 'Related',
      'id': obj2.id,
      'related': { '__ref__': obj1.id },
      'property': null,
    });
  });

  test('multiple circular', () => {
    const obj1 = new Related(),
      obj2 = new Related();
    obj1.related = [obj2];
    obj2.related = [obj1];
    const refs = {};

    const object = obj1.marshal(refs);

    expect(object).toEqual({
      '__class__': 'Related',
      'id': obj1.id,
      'related': [
        { '__ref__': obj2.id },
      ],
      'property': null,
    });
    expect(refs[obj1.id]).toEqual({
      '__class__': 'Related',
      'id': obj1.id,
      'related': [
        { '__ref__': obj2.id },
      ],
      'property': null,
    });
    expect(refs[obj2.id]).toEqual({
      '__class__': 'Related',
      'id': obj2.id,
      'related': [
        { '__ref__': obj1.id },
      ],
      'property': null,
    });
  });

  test('json of marshal', () => {
    const obj1 = new Related(),
      obj2 = new Related();
    obj1.related = [obj2];
    obj2.related = [obj1];
    const refs = {};


    expect(() => { JSON.stringify(obj1.marshal(refs)) }).not.toThrow();
    expect(() => { JSON.stringify(refs) }).not.toThrow();
  });
});
