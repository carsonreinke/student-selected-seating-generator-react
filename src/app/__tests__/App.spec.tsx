import React from 'react';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mockStore } from '../../../tests/mockStore';
import App from '../App';
import { RootState } from '../rootSlice';
import { buildRoom } from '../../models/room';
import { toggle } from '../appSlice';

const commonTests = (path: string, text: string) => {
  describe(`route ${path}`, () => {
    let result: RenderResult,
      store: ReturnType<typeof mockStore>;

    beforeEach(() => {
      store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: buildRoom(), newVersion: true } });
      result = render(<Provider store={store}><MemoryRouter initialEntries={[path]}><App /></MemoryRouter></Provider>);
    })

    test('content', () => {
      expect(result.getByText(text)).toBeInTheDocument();
    });

    test('menu collapsed', () => {
      expect(result.getByTitle('Expand')).toBeInTheDocument();
    });

    test('menu will expand', () => {
      fireEvent.click(result.getByTitle('Expand'));

      const actions = store.getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]?.type).toEqual(toggle.type);
    });
  });
}

commonTests('/', 'Welcome');
commonTests('/desks', 'Provide the arrangement of desks for the room.');
commonTests('/students', 'Students TODO'); //TODO
commonTests('/report', 'Report TODO'); //TODO
