import React from 'react';
import Desk from '../Desk';
import { render, fireEvent, wait } from '@testing-library/react';
import { buildRoom, addDesk } from '../../models/room';
import ResizeObserver from 'resize-observer-polyfill';

jest.mock('resize-observer-polyfill', () => {
  return jest.fn().mockImplementation((callback) => {
    return {
      observe: jest.fn(),
      disconnect: jest.fn()
    };
  });
});

beforeEach(() => {
  ResizeObserver.mockClear();
});

describe('render', () => {
  it('should render editable', () => {
    const result = render(<Desk editable={true} desk={addDesk(buildRoom())} move={jest.fn()} remove={jest.fn()} rotate={jest.fn()} editDimension={jest.fn()} />);

    expect(result.getByAltText('Delete')).toBeVisible();
    expect(result.getByAltText('Drag Me')).toBeVisible();
    expect(result.getByAltText('Rotate Me')).toBeVisible();
  });

  it('should render uneditable', () => {
    const result = render(<Desk editable={false} desk={addDesk(buildRoom())} move={jest.fn()} remove={jest.fn()} rotate={jest.fn()} editDimension={jest.fn()} />);

    expect(result.queryByAltText('Delete')).toBeNull();
    expect(result.queryByAltText('Drag Me')).toBeNull();
    expect(result.queryByAltText('Rotate Me')).toBeNull();
  });

  it('should render name', () => {
    const result = render(<Desk name="Testing" desk={addDesk(buildRoom())} move={jest.fn()} remove={jest.fn()} rotate={jest.fn()} editDimension={jest.fn()} />);

    expect(result.getByText('Testing')).toBeVisible();
  });

  it('should render position and angle', () => {
    const desk = addDesk(buildRoom());
    desk.angle = 45;
    desk.x = 1;
    desk.y = 2;
    const result = render(<Desk desk={desk} move={jest.fn()} remove={jest.fn()} rotate={jest.fn()} editDimension={jest.fn()} />);

    expect(result.container.childNodes[0]).toHaveStyle('left: 1px; top: 2px; transform: rotate(45deg);');
  })
});

describe('remove', () => {
  it('should call remove when clicked', () => {
    const desk = addDesk(buildRoom());
    const remove = jest.fn();
    const result = render(<Desk editable={true} desk={desk} move={jest.fn()} remove={remove} rotate={jest.fn()} editDimension={jest.fn()} />);

    fireEvent.click(result.getByAltText('Delete'));

    expect(remove).toHaveBeenCalled();
  });
});

describe('move', () => {
  it('should call move once done dragging', async () => {
    const name = "Testing"
    const desk = addDesk(buildRoom());
    const move = jest.fn();
    const result = render(<Desk editable={true} name={name} desk={desk} move={move} remove={jest.fn()} rotate={jest.fn()} editDimension={jest.fn()} />);

    fireEvent.touchStart(result.getByTitle(name), { touches: [{ clientX: 1, clientY: 1 }] });
    fireEvent.touchEnd(result.getByTitle(name), { changedTouches: [{ clientX: 2, clientY: 2 }] });

    await wait(() => expect(move).toHaveBeenCalledWith(desk.id, 0, 0));
  });
});

describe('rotate', () => {
  it('should call rotate once done rotating', async () => {
    const desk = addDesk(buildRoom());
    const rotate = jest.fn();
    const result = render(<Desk editable={true} desk={desk} move={jest.fn()} remove={jest.fn()} rotate={rotate} editDimension={jest.fn()} />);

    fireEvent.mouseDown(result.getByAltText('Rotate Me'), {clientX: 0, clientY: 0});
    fireEvent.mouseMove(result.getByAltText('Rotate Me'), {clientX: 1, clientY: 1});
    fireEvent.mouseUp(result.getByAltText('Rotate Me'), {clientX: 2, clientY: 2});

    await wait(() => expect(rotate).toHaveBeenCalledWith(desk.id, 45));
  });
});

describe('editDimension', () => {
  it('should call edit dimension when resized', async () => {
    const editDimension = jest.fn();
    const results = render(<Desk editable={true} desk={addDesk(buildRoom())} move={jest.fn()} remove={jest.fn()} rotate={jest.fn()} editDimension={editDimension} />);

    expect(ResizeObserver).toHaveBeenCalled();
    const callback = ResizeObserver.mock.calls[0][0];

    // Manually trigger callback instead of event
    callback([{
      target: results.container.firstChild,
      contentRect: {
        width: 1, height: 1
      }
    }]);

    await wait(() => expect(editDimension).toHaveBeenCalled());
  });
});
