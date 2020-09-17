import app, { toggle, loadVersions, clearVersions, addVersion, saveVersion } from '../appSlice';
import { buildRoom } from '../../models/room';
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

it('should use initial state', () => {
  expect(
    app(undefined, { type: '' })
  ).toEqual({ expanded: false, versions: [] });
});

describe('initial state', () => {
  it('should able to toggle on', () => {
    const state = app({ expanded: false, versions: [] }, toggle);
    expect(state).toEqual({ expanded: true, versions: [] });
  });

  it('should able to toggle off', () => {
    const state = app({ expanded: true, versions: [] }, toggle);
    expect(state).toEqual({ expanded: false, versions: [] });
  });
});

describe('versions', () => {
  it('should load from empty storage', async () => {
    const store = mockStore({
      app: { expanded: false, versions: [] },
      room: { current: buildRoom(), newVersion: true }
    });

    await store.dispatch(loadVersions(storage));

    expect(store.getActions()).toEqual([{ type: clearVersions.type, payload: undefined }])
  });

  it('should pull from storage', async () => {
    storage.length = 2;
    storage.key.mockImplementation((index: number) => {
      switch (index) {
        case 0:
          return 'sssg-2020-07-17T16:13:03.700Z';
      }
    });
    storage.getItem.mockImplementation((key: string) => {
      switch (key) {
        case 'sssg-2020-07-17T16:13:03.700Z':
          return JSON.stringify(buildRoom());
      }
    });
    const store = mockStore({
      app: { expanded: false, versions: [] },
      room: { current: buildRoom(), newVersion: true }
    });
    await store.dispatch(loadVersions(storage));

    const actions = store.getActions();
    expect(actions).toHaveLength(2);
    expect(actions[1]?.type).toEqual(addVersion.type);
    expect(actions[1]?.payload).toHaveProperty('id');
  });
});

describe('saveVersion', () => {
  it('should save to storage', async () => {
    const room = buildRoom();

    const store = mockStore({
      app: { expanded: false, versions: [] },
      room: { current: buildRoom(), newVersion: true }
    });
    await store.dispatch(saveVersion(storage, room));

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]?.type).toEqual(addVersion.type);
    expect(actions[0]?.payload).toHaveProperty('id');

    expect(storage.setItem).toBeCalledTimes(1);
  });

  it('should not duplicate in versions', async () => {
    const room = buildRoom();

    const store = mockStore({
      app: { expanded: false, versions: [room] },
      room: { current: buildRoom(), newVersion: true }
    });
    await store.dispatch(saveVersion(storage, room));

    expect(store.getActions()).toHaveLength(0);
  });
});
