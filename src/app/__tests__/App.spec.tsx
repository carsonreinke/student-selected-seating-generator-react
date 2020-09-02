import React from 'react';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mockStore } from '../../../tests/mockStore';
import App from '../App';
import { RootState } from '../rootSlice';
import { buildRoom } from '../../models/room';
import { toggle } from '../appSlice';
import { addDesk } from '../../models/room';

const commonTests = (path: string, text: string) => {
  describe(`route ${path}`, () => {
    let result: RenderResult,
      store: ReturnType<typeof mockStore>;

    beforeEach(() => {
      const room = buildRoom();
      addDesk(room);
      store = mockStore<RootState>({ app: { expanded: false, versions: [] }, room: { current: room, newVersion: true } });
      result = render(<Provider store={store}><MemoryRouter initialEntries={[path]}><App /></MemoryRouter></Provider>);
    })

    it('should display content', () => {
      expect(result.getByText(text)).toBeInTheDocument();
    });

    it('should have a menu collapsed', () => {
      expect(result.getByTitle('Expand')).toBeInTheDocument();
    });

    it('should allow menu to expand', () => {
      fireEvent.click(result.getByTitle('Expand'));

      const actions = store.getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]?.type).toEqual(toggle.type);
    });
  });
}

commonTests('/', 'Welcome');
commonTests('/desks', 'Provide the arrangement of desks for the room.');
commonTests('/students', 'Provide the name of each student and their preferences.');
commonTests('/report', 'Report TODO'); //TODO
