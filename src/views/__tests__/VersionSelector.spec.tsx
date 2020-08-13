import React from 'react';
import VersionSelector from '../VersionSelector';
import { mockStore } from '../../../tests/mockStore';
import { Room, buildRoom } from '../../models/room';
import { RootState } from '../../app/rootSlice';
import { render, fireEvent, wait } from '@testing-library/react';
import { Provider } from 'react-redux';
import { newVersion, loadVersion } from '../../app/roomSlice';
import { AppThunk } from '../../app/store';
import { PayloadAction } from '@reduxjs/toolkit';

jest.mock('../../app/roomSlice');

describe('render', () => {
  let room: Room;

  beforeEach(() => {
    room = buildRoom();
  });

  it('should render empty', () => {
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><VersionSelector menu="" redirect={jest.fn()} /></Provider>);

    expect(result.getByText('Welcome')).toBeInTheDocument();
  });

  it('should render versions', () => {
    const versions = [
      buildRoom(),
      buildRoom(),
      buildRoom()
    ];
    versions[0].createdAt = new Date(0).toISOString();
    versions[0].createdAt = new Date(1).toISOString();
    versions[0].createdAt = new Date(2).toISOString();

    const store = mockStore<RootState>({ app: { expanded: false, versions }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><VersionSelector menu="" redirect={jest.fn()} /></Provider>);

    const elements = result.getAllByText(/room\s+created\s+on/i);
    expect(elements[0]).toBeInTheDocument();
    expect(elements).toHaveLength(3);
  });
});

describe('new', () => {
  it('should call thunk and redirect when clicked', async () => {
    newVersion.mockImplementation((): AppThunk => async (dispatch) => { });

    const onRedirect = jest.fn();
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: buildRoom(), newVersion: true } });
    const result = render(<Provider store={store}><VersionSelector menu="" redirect={onRedirect} /></Provider>);

    fireEvent.click(result.getByText('New'));

    await wait(() => expect(newVersion).toHaveBeenCalled());
    await wait(() => expect(onRedirect).toHaveBeenCalled());
  });
});

describe('version', () => {
  it('should call action and redirect when clicked', async () => {
    const room = buildRoom();
    const onRedirect = jest.fn();
    loadVersion.mockImplementation((payload: Room): PayloadAction<Room, string> => {
      return { payload, type: loadVersion.type };
    });

    const store = mockStore<RootState>({ app: { expanded: false, versions: [room] }, room: { current: buildRoom(), newVersion: true } });
    const result = render(<Provider store={store}><VersionSelector menu="" redirect={onRedirect} /></Provider>);

    fireEvent.click(result.getByText(/room\s+created\s+on/i));

    await wait(() => expect(loadVersion).toHaveBeenCalledWith(room));
    await wait(() => expect(onRedirect).toHaveBeenCalled());
  });
});
