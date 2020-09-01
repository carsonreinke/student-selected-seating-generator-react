import React from 'react';
import DeskEditor from '../DeskEditor';
import { mockStore } from '../../../tests/mockStore';
import { Room, buildRoom } from '../../models/room';
import { RootState } from '../../app/rootSlice';
import { render, fireEvent, wait } from '@testing-library/react';
import { Provider } from 'react-redux';
import { newVersion, loadVersion } from '../../app/roomSlice';
import { AppThunk } from '../../app/store';
import { PayloadAction } from '@reduxjs/toolkit';

jest.mock('../../app/roomSlice');

let room: Room;

beforeEach(() => {
  room = buildRoom();
});

describe('render', () => {
  it('should render empty room', () => {
    const store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
    const result = render(<Provider store={store}><DeskEditor menu="" redirect={jest.fn()} /></Provider>);

    expect(result.getByText('Provide the arrangement of desks for the room.')).toBeInTheDocument();
  });
});
