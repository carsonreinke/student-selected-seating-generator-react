import { findInRelationship, length, toArray } from '../collection';

describe('findInRelationship', () => {
  it('should find when available', () => {
    const relation = {'1': ['2', '3', '4']};
    expect(findInRelationship(relation, '2')).toEqual('1');
    expect(findInRelationship(relation, '3')).toEqual('1');
    expect(findInRelationship(relation, '4')).toEqual('1');
  });

  it('should be null when missing', () => {
    expect(findInRelationship({'1': ['2', '4']}, '3')).toBeNull();
    expect(findInRelationship({'1': []}, '3')).toBeNull();
  });
});

describe('length', () => {
  it('should be length of data', () => {
    expect(length({data: {}})).toEqual(0);
    expect(length({data: {
      '1': {'id': '1'}
    }})).toEqual(1);
    expect(length({data: {
      '1': {'id': '1'},
      '2': {'id': '2'}
    }})).toEqual(2);
  });
});

describe('toArray', () => {
  it('should array of data', () => {
    expect(toArray({data: {
      '1': {'id': '1'},
      '2': {'id': '2'}
    }})).toEqual([
      {'id': '1'},
      {'id': '2'}
    ]);
  });
});
