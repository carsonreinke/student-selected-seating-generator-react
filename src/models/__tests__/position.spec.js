import Position from '../position';

test('constructor', () => {
    const obj = new Position();
    expect(obj).not.toBeNull();
});

test('distance same', () => {
    const p1 = new Position(),
        p2 = new Position();

    expect(p1.distance(p2)).toEqual(0);
});

test('distance same y', () => {
    const p1 = new Position(),
        p2 = new Position();

    p2.x = 2;
    p2.y = 2;

    expect(Math.round(p1.distance(p2))).toEqual(3);
});

test('distance absolute', () => {
    const p1 = new Position(),
        p2 = new Position();

    p2.x = 100;
    p2.y = 0;

    expect(p2.distance(p1)).toEqual(100);
});
