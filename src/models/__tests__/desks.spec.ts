import { distance } from '../desks';
import createDataId from '../../utils/data-id';

describe('distance', () => {
  test('when same location', () => {
    const o1 = { id: createDataId(), x: 0, y: 0, angle: 0 };
    const o2 = { id: createDataId(), x: 0, y: 0, angle: 0 };
    expect(distance(o1, o2)).toEqual(0)
  });

  test('when distance between', () => {
    const o1 = { id: createDataId(), x: 0, y: 0, angle: 0 };
    const o2 = { id: createDataId(), x: 1, y: 1, angle: 0 };
    expect(distance(o1, o2)).toBeCloseTo(1.4, 1);
    expect(distance(o2, o1)).toBeCloseTo(1.4, 1);
  });
});
