import Student from '../student';

test('constructor', () => {
  const obj = new Student();
  expect(obj).not.toBeNull();
});

test('unique id', () => {
  expect(new Student().id).not.toEqual(new Student().id);
});

test('name', () => {
  const name = 'Someone';
  const obj = new Student();
  obj.name = name;

  expect(obj.name).toEqual(name);
});

test('addPreference', () => {
  const s1 = new Student(),
    s2 = new Student();

  s1.addPreference(s2);
  expect(s1.preferences).toContain(s2);
});

test('removePreference', () => {
  const s1 = new Student(),
    s2 = new Student();

  s1.addPreference(s2);
  s1.removePreference(s2);
  expect(s1.preferences).not.toContain(s2);
});
