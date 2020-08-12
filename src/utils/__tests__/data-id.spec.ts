import createDataId from '../data-id';

describe('createDataId', () => {
  it('should create a string identifier', () => {
    const id = createDataId();

    expect(id).not.toBeNull();
    expect(typeof id).toEqual('string');
  });

  it('should be unique' /*kind of*/, () => {
    const ids = [...Array(100)].map(() => createDataId());

    expect(
      ids.find((id, index) => ids.indexOf(id) !== index)
    ).toBeUndefined();
  });
});
