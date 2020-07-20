import app, { toggle, versions, clearVersions, addVersion, saveVersion } from '../appSlice';
import Room from '../../models/room';
import { mockStore } from '../../../tests/mockStore';

let storage: any;
beforeEach(() => {
  storage = {
    length: 0,
    clear: jest.fn(),
    getItem: jest.fn(),
    key: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn()
  };
});

it('should handle initial state', () => {
  expect(
    app(undefined, { type: '' })
  ).toEqual({ expanded: false, newVersion: false, versions: [] });
});

it('should be able to toggle on', () => {
  const state = app({ expanded: false, newVersion: false, versions: [] }, toggle);
  expect(state).toEqual({ expanded: true, newVersion: false, versions: [] });
});

it('should be able to toggle off', () => {
  const state = app({ expanded: true, newVersion: false, versions: [] }, toggle);
  expect(state).toEqual({ expanded: false, newVersion: false, versions: [] });
});

it('should load versions with empty storage', async () => {
  const store = mockStore({ expanded: false, newVersion: false, versions: [] });

  await store.dispatch(versions(storage));

  expect(store.getActions()).toEqual([{ type: clearVersions.type, payload: undefined }])
});

it('should load version from storage', async () => {
  storage.length = 2;
  storage.key.mockImplementation((index: number) => {
    switch (index) {
      case 0:
        return 'sssg-2020-07-17T16:13:03.700Z';
      case 1:
        return 'sssg-2020-07-17T16:13:03.700Z-refs';
    }
  });
  storage.getItem.mockImplementation((key: string) => {
    switch (key) {
      case 'sssg-2020-07-17T16:13:03.700Z':
        return '{"__class__":"Room","id":23,"desks":[{"__ref__":24}],"students":[{"__ref__":36}],"arrangementStrategy":{"__ref__":22},"name":"Room","createdAt":"2020-07-19T15:46:20.565Z"}';
      case 'sssg-2020-07-17T16:13:03.700Z-refs':
        return '{"22":{"__class__":"BruteForceStrategy","id":22},"23":{"__class__":"Room","id":23,"desks":[{"__ref__":24}],"students":[{"__ref__":36}],"arrangementStrategy":{"__ref__":22},"name":"Room","createdAt":"2020-07-19T15:46:20.565Z"},"24":{"__class__":"Desk","id":24,"student":{"__ref__":36},"position":{"__ref__":25}},"25":{"__class__":"Position","id":25,"x":122.33333333333334,"y":45,"angle":0},"36":{"__class__":"Student","id":36,"name":"Student 1","preferences":[]}}';
    }
  });
  const store = mockStore({ expanded: false, newVersion: false, versions: [] });
  await store.dispatch(versions(storage));

  const actions = store.getActions();
  expect(actions).toHaveLength(2);
  expect(actions[1]?.type).toEqual(addVersion.type);
  expect(actions[1]?.payload).toBeInstanceOf(Room);
});

it('should save room to storage', async () => {
  const room = new Room();

  const store = mockStore({ expanded: false, newVersion: false, versions: [] });
  await store.dispatch(saveVersion(storage, room));

  const actions = store.getActions();
  expect(actions).toHaveLength(1);
  expect(actions[0]?.type).toEqual(addVersion.type);
  expect(actions[0]?.payload).toBeInstanceOf(Room);

  expect(storage.setItem).toBeCalledTimes(2);
});

it('should save room and not duplicate in versions', async () => {
  const room = new Room();

  const store = mockStore({ expanded: false, newVersion: false, versions: [room] });
  await store.dispatch(saveVersion(storage, room));

  expect(store.getActions()).toHaveLength(0);
});
