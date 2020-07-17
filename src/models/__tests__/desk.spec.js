import Desk from '../desk';
import Student from '../student';

test('constructor', () => {
    const obj = new Desk();
    expect(obj).not.toBeNull();
});

test('unique id', () => {
    expect(new Desk().id).not.toEqual(new Desk().id);
});

test('student', () => {
    const student = new Student();
    const obj = new Desk();
    obj.student = student;

    expect(obj.student).toEqual(obj.student);
});

test('move', () => {
    const obj = new Desk();
    obj.move(123, 456);

    expect(obj.position.x).toEqual(123);
    expect(obj.position.y).toEqual(456);
});

test('distance', () => {
    const d1 = new Desk(),
        d2 = new Desk();

    expect(d1.distance(d2)).toEqual(0);
});
