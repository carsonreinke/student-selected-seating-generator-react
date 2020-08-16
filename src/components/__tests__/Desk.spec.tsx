import React from 'react';
import Desk from '../Desk';
import { render, fireEvent, wait } from '@testing-library/react';
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

describe('remove', () => {
  it('should call remove when clicked', () => {
    const desk = addDesk(buildRoom());
    const remove = jest.fn();
    const result = render(<Desk editable={true} desk={desk} move={jest.fn()} remove={remove} rotate={jest.fn()} />);

    fireEvent.click(result.getByAltText('Delete'));

    expect(remove).toHaveBeenCalled();
  });
});

describe('move', () => {
  it('should call move once done dragging', () => {
    const desk = addDesk(buildRoom());
    const move = jest.fn();
    const result = render(<Desk editable={true} desk={desk} move={move} remove={jest.fn()} rotate={jest.fn()} />);

    fireEvent.touchStart(result.getByAltText('Drag Me'), { touches: [{ clientX: 1, clientY: 1 }] });
    fireEvent.touchEnd(result.getByAltText('Drag Me'), { changedTouches: [{ clientX: 1, clientY: 1 }] });

    wait(() => expect(move).toHaveBeenCalledWith(desk.id, 1, 1));
  });
});

describe('rotate', () => {
  it('should call rotate once done rotating', () => {
    const desk = addDesk(buildRoom());
    const rotate = jest.fn();
    const result = render(<Desk editable={true} desk={desk} move={jest.fn()} remove={jest.fn()} rotate={rotate} />);

    fireEvent.mouseDown(result.getByAltText('Rotate Me'), {clientX: 0, clientY: 0});
    fireEvent.mouseMove(result.getByAltText('Rotate Me'), {clientX: 1, clientY: 1});
    fireEvent.mouseUp(result.getByAltText('Rotate Me'), {clientX: 2, clientY: 2});

    wait(() => expect(rotate).toHaveBeenCalledWith(desk.id, 1, 1));
    wait(() => expect(rotate).toHaveBeenCalledWith(desk.id, 2, 2));
  });
});
