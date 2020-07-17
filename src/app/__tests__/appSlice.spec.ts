import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import app, { toggle, versions, clearVersions, addVersion } from '../appSlice';
import { AnyAction } from '@reduxjs/toolkit';
import Room from '../../models/room';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

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
    app(undefined, {type: ''})
  ).toEqual({expanded: false, newVersion: false, versions:[]});
});

it('should be able to toggle on', () => {
  const state = app({expanded: false, newVersion: false, versions: []}, toggle);
  expect(state).toEqual({expanded: true, newVersion: false, versions:[]});
});

it('should be able to toggle off', () => {
  const state = app({expanded: true, newVersion: false, versions: []}, toggle);
  expect(state).toEqual({expanded: false, newVersion: false, versions:[]});
});

it('should load versions with empty storage', async () => {
  const store = mockStore({expanded: false, newVersion: false, versions:[]});

  await store.dispatch(versions(storage));

  expect(store.getActions()).toEqual([{type: clearVersions.type, payload: undefined}])
});

it('should load version from storage', async () => {
  storage.length = 2;
  storage.key.mockImplementation((index: number) => {
    switch(index) {
      case 0:
        return 'sssg-2020-07-17T16:13:03.700Z';
      case 1:
        return 'sssg-2020-07-17T16:13:03.700Z-refs';
    }
  });
  storage.getItem.mockImplementation((key: string) => {
    switch(key) {
      case 'sssg-2020-07-17T16:13:03.700Z':
        return '{"__class__":"Room","id":183,"desks":[{"__ref__":184}],"students":[{"__ref__":196}],"arrangementStrategy":{"__ref__":182},"name":"Room","createdAt":"2020-07-17T16:13:03.700Z"}';
      case 'sssg-2020-07-17T16:13:03.700Z-refs':
        return '{"182":{"__class__":"Room","id":182},"183":{"__class__":"Room","id":183,"desks":[{"__ref__":184}],"students":[{"__ref__":196}],"arrangementStrategy":{"__ref__":182},"name":"Room","createdAt":"2020-07-17T16:13:03.700Z"},"184":{"__class__":"Room","id":184,"student":{"__ref__":196},"position":{"__ref__":185}},"185":{"__class__":"Room","id":185,"x":73.75,"y":26,"angle":0},"196":{"__class__":"Room","id":196,"name":"Student 1","preferences":[]}}';
    }
  });
  const store = mockStore({expanded: false, newVersion: false, versions:[]});

  await store.dispatch(versions(storage));

  const actions = store.getActions();

  expect(actions).toHaveLength(2);
  expect(actions[1]?.type).toEqual(addVersion.type);
  expect(actions[1]?.payload).toBeInstanceOf(Room);
});
