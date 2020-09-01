import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react'
import useDrag from '../use-drag';

const TestComponent = (callback: any) => {
  const trigger = useDrag(callback);
  return (<div onMouseDown={trigger}>Test</div>);
};

describe('useDrag', () => {
  it('should setup mouse down', () => {
    const spy = jest.spyOn(document.body, 'addEventListener');
    const results = render(<TestComponent callback={jest.fn()}/>);

    fireEvent.mouseDown(results.getByText('Test'));

    wait(() => expect(spy).toHaveBeenCalledTimes(4));
  });

  it('should callback on mouse move', () => {
    const callback = jest.fn();
    const results = render(<TestComponent callback={callback}/>);

    fireEvent.mouseDown(results.getByText('Test'));
    fireEvent.mouseMove(document.body);

    wait(() => expect(callback).toHaveBeenCalled());
  });

  it('should callback on mouse up', () => {
    const callback = jest.fn();
    const results = render(<TestComponent callback={callback}/>);

    fireEvent.mouseDown(results.getByText('Test'));
    fireEvent.mouseUp(document.body);

    wait(() => {
      expect(callback).toHaveBeenCalled();
      expect(callback.mock.calls[0][1]).toBeTruthy();
    });
  });
});
