import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react'
import useDrag from '../use-drag';

const TestComponent = ({ callback }: { callback: (event: MouseEvent | TouchEvent, final: boolean) => void }) => {
  const trigger = useDrag(callback);
  return (<div onMouseDown={trigger}>Test</div>);
};

describe('useDrag', () => {
  it('should setup mouse down', async () => {
    const spy = jest.spyOn(document.body, 'addEventListener');
    const results = render(<TestComponent callback={jest.fn()} />);

    fireEvent.mouseDown(results.getByText('Test'));

    await wait(() => expect(spy).toHaveBeenCalledTimes(4));
  });

  it('should callback on mouse move', async () => {
    const callback = jest.fn();

    callback();

    const results = render(<TestComponent callback={callback} />);

    fireEvent.mouseDown(results.getByText('Test'));
    fireEvent.mouseMove(document.body);

    await wait(() => expect(callback).toHaveBeenCalled());
  });

  it('should callback on mouse up', async () => {
    const callback = jest.fn();
    const results = render(<TestComponent callback={callback} />);

    fireEvent.mouseDown(results.getByText('Test'));
    fireEvent.mouseUp(document.body);

    await wait(() => {
      expect(callback).toHaveBeenCalled();
      expect(callback.mock.calls[0][1]).toBeTruthy();
    });
  });
});
