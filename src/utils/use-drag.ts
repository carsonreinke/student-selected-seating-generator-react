import { useRef, useEffect, useState } from 'react';

type MouseOrTouchEvent = MouseEvent | TouchEvent;
type InternalCallback = (event: MouseOrTouchEvent) => void;
type ExternalCallback = (event: MouseOrTouchEvent, final: boolean) => void;
type ExternalTrigger = () => void;

interface Callbacks {
  move: InternalCallback;
  finish: InternalCallback;
};

// Dragging effect using trigger and event callbacks
//
// Based on https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const useDrag: (
  externalCallback: ExternalCallback
) => ExternalTrigger = (callback) => {
  // Track if currently dragging or not
  const [dragging, setDragging] = useState<boolean>(false);
  // Reference to call backs bound to state
  const callbacks = useRef<Callbacks>();

  const startTrigger = () => {
    setDragging(true);
  }
  const moveCallback: InternalCallback = (event) => {
    callback(event, false);
  };
  const finishCallback: InternalCallback = (event) => {
    setDragging(false);
    callback(event, true)
  };

  // Initialize ref var with new state bound callbacks
  useEffect(() => {
    callbacks.current = {
      move: moveCallback,
      finish: finishCallback
    };
  });

  useEffect(() => {
    // If not dragging, don't setup any events
    if (!dragging) {
      return () => { };
    }

    const moveEvent = (event: MouseOrTouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const func = callbacks.current?.move;
      if (func) { func(event); }
    };
    const finishEvent = (event: MouseOrTouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const func = callbacks.current?.finish;
      if (func) { func(event); }
    };

    document.body.addEventListener('mousemove', moveEvent);
    document.body.addEventListener('mouseup', finishEvent);
    document.body.addEventListener('touchmove', moveEvent);
    document.body.addEventListener('touchend', finishEvent);

    return () => {
      document.body.removeEventListener('mousemove', moveEvent);
      document.body.removeEventListener('mouseup', finishEvent);
      document.body.removeEventListener('touchmove', moveEvent);
      document.body.removeEventListener('touchend', finishEvent);
    };
  }, [dragging] /*Dependent on state of dragging*/);

  return startTrigger;
}

export default useDrag;
