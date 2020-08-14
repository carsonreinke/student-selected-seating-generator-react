import React from 'react';
import Desk from '../Desk';
import { render, fireEvent } from '@testing-library/react';
import { buildRoom, addDesk } from '../../models/room';

describe('render', () => {
  it('should render editable', () => {
    const result = render(<Desk editable={true} desk={addDesk(buildRoom())} move={jest.fn()} remove={jest.fn()} rotate={jest.fn()} />);

    expect(result.getByAltText('Delete')).toBeVisible();
    expect(result.getByAltText('Drag Me')).toBeVisible();
    expect(result.getByAltText('Rotate Me')).toBeVisible();
  });

  it('should render uneditable', () => {
    const result = render(<Desk editable={false} desk={addDesk(buildRoom())} move={jest.fn()} remove={jest.fn()} rotate={jest.fn()} />);

    expect(result.queryByAltText('Delete')).toBeNull();
    expect(result.queryByAltText('Drag Me')).toBeNull();
    expect(result.queryByAltText('Rotate Me')).toBeNull();
  });

  it('should render name', () => {
    const result = render(<Desk name="Testing" desk={addDesk(buildRoom())} move={jest.fn()} remove={jest.fn()} rotate={jest.fn()} />);

    expect(result.getByText('Testing')).toBeVisible();
  });

  it('should render position and angle', () => {
    const desk = addDesk(buildRoom());
    desk.angle = 45;
    desk.x = 1;
    desk.y = 2;
    const result = render(<Desk desk={desk} move={jest.fn()} remove={jest.fn()} rotate={jest.fn()} />);

    expect(result.container.childNodes[0]).toHaveStyle('left: 1px; top: 2px; transform: rotate(45deg);');
  })
});
