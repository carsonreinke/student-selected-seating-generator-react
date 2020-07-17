import Base from '../base';
import * as Models from '../';

class Mock extends Base { }
Models.addClass(Mock);

class Related extends Base {
  constructor() {
    super();
    this.related = null;
    this.property = null;
  }
}
Models.addClass(Related);

describe('unmarshal', () => {
  test('simple', () => {
    const ref = {
      '__class__': 'Mock',
      'id': -1,
    };
    const object = Models.unmarshal(ref, { '-1': ref });
    expect(object).toBeInstanceOf(Mock);
    expect(object.id).not.toEqual(-1);
  });

  test('null', () => {
    const ref = {
      '__class__': 'Related',
      'id': -1,
      'property': null,
    };
    const object = Models.unmarshal(ref, { '-1': ref });
    expect(object).toBeInstanceOf(Related);
    expect(object.property).toBeNull();
  });

  test('property', () => {
    const ref = {
      '__class__': 'Related',
      'id': -1,
      'property': 'testing',
    };
    const object = Models.unmarshal(ref, { '-1': ref });

    expect(object).toBeInstanceOf(Related);
    expect(object.property).toEqual('testing');
  });

  test('circular', () => {
    const refs = {
      '-1': {
        '__class__': 'Related',
        'id': -1,
        'related': { '__ref__': -2 },
        'property': null,
      },
      '-2': {
        '__class__': 'Related',
        'id': -2,
        'related': { '__ref__': -1 },
        'property': null,
      },
    }
    const object = Models.unmarshal(refs[-1], refs);
    expect(object).toBeInstanceOf(Related);
    expect(object.related).toBeInstanceOf(Related);
    expect(object.related.related).toEqual(object);
    expect(object.id).not.toEqual(object.related.id);
  });

  test('multiple circular', () => {
    const refs = {
      '-1': {
        '__class__': 'Related',
        'id': -1,
        'related': [{ '__ref__': -2 }],
        'property': null,
      },
      '-2': {
        '__class__': 'Related',
        'id': -2,
        'related': [{ '__ref__': -1 }],
        'property': null,
      },
    }
    const object = Models.unmarshal(refs[-1], refs);
    expect(object).toBeInstanceOf(Related);
    expect(object.related[0]).toBeInstanceOf(Related);
    expect(object.related[0].related[0]).toEqual(object);
    expect(object.id).not.toEqual(object.related[0].id);
  });
});

describe('full circle', () => {
  const obj1 = new Related(),
    obj2 = new Related();
  obj1.related = obj2;
  obj1.property = 'testing1';
  obj2.related = obj1;
  obj2.property = 'testing2';
  const refs = {};

  const persisted = JSON.parse(JSON.stringify(obj1.marshal(refs)));
  const persistedRefs = JSON.parse(JSON.stringify(refs));
  const persistedObj = Models.unmarshal(persisted, persistedRefs);

  expect(persistedObj).toBeInstanceOf(Related);
  expect(persistedObj.related).toBeInstanceOf(Related);
  expect(persistedObj.property).toEqual(obj1.property);
  expect(persistedObj.related.property).toEqual(obj2.property);
  expect(persistedObj.related.related).toEqual(persistedObj);
});
