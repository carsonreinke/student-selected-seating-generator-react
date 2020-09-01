import React, { useState, DragEvent as ReactDragEvent, TouchEvent as ReactTouchEvent, MouseEvent as ReactMouseEvent, useEffect, useRef } from 'react';
import { CoreDesk } from '../models/desks';
import { Dimension } from '../models/general';
import styles from './Desk.module.css';
import deskImage from '../assets/images/desk.svg';
import dragImage from '../assets/images/drag.svg';
import deleteImage from '../assets/images/delete.svg';
import rotateImage from '../assets/images/rotate.svg';
import useDrag from '../utils/use-drag';
import ResizeObserver from 'resize-observer-polyfill';

const RADIANS_TO_DEGREES = 180.0 / Math.PI;

interface Coordinates {
  x: number;
  y: number;
}

interface DragMeta extends Coordinates {
  client: Coordinates
  parentRect?: DOMRect;
  elementRect: DOMRect;
}

interface RotationMeta {
  angle: number;
  rotation: number;
  start: number;
  center: Coordinates;
}

/**
 * Return the coordinates based on the event
 */
const eventCoordinates = (
  event: ReactMouseEvent | ReactDragEvent | ReactTouchEvent | MouseEvent | TouchEvent,
  changedTouches: boolean = false
): Coordinates => {
  // Hack to check what type of event
  if (typeof (event as TouchEvent).touches !== 'undefined') {
    const _event = event as TouchEvent;
    const touchList: TouchList = changedTouches ? _event.changedTouches : _event.touches;
    return { x: touchList[0].clientX, y: touchList[0].clientY };
  } else if (typeof (event as MouseEvent).clientX !== 'undefined') {
    const _event = event as MouseEvent;
    return { x: _event.clientX, y: _event.clientY };
  } else {
    throw new Error(`Invalid argument: ${event}`);
  }
};

interface DeskProps {
  editable?: boolean;
  name?: string;
  desk: CoreDesk;
  move: (id: string, x: number, y: number) => void;
  rotate: (id: string, angle: number) => void;
  remove: (id: string) => void;
  editDimension?: (id: string, rect: Dimension) => void;
};

const Desk = ({
  editable = false,
  desk,
  name = 'Student',
  move,
  rotate,
  remove,
  editDimension
}: DeskProps) => {
  const container = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<DragMeta | null>(null),
    [rotating, setRotating] = useState<RotationMeta | null>(null);

  // Custom hook for dragging
  const dragTrigger = useDrag((event, final) => {
    if (!dragging) {
      return;
    }

    const clientCoordinates = eventCoordinates(event, true);
    const _dragging = Object.assign({}, dragging);

    // Calculate new position relative to old position
    let x = clientCoordinates.x - dragging.client.x + dragging.x,
      y = clientCoordinates.y - dragging.client.y + dragging.y;

    //Ensure position not too far left/top
    if (x < 0) {
      x = 0;
    }
    if (y < 0) {
      y = 0;
    }

    //Ensure position not too far bottom/right
    if (dragging.parentRect) {
      if (x > dragging.parentRect.width - dragging.elementRect.width) {
        x = dragging.parentRect.width - dragging.elementRect.width;
      }
      if (y > dragging.parentRect.height - dragging.elementRect.height) {
        y = dragging.parentRect.height - dragging.elementRect.height;
      }
    }

    // Apply latest position
    _dragging.x = x;
    _dragging.y = y;
    _dragging.client = clientCoordinates;

    if (final) {
      setDragging(null);
      move(desk.id, x, y);
    }
    else {
      setDragging(_dragging);
    }
  });

  // Custom hook for rotating
  const rotateTrigger = useDrag((event, final) => {
    if (!rotating) {
      return;
    }

    const clientCoordinates = eventCoordinates(event, true);
    const _rotating = Object.assign({}, rotating);

    // Apply latest rotation
    const x = clientCoordinates.x - _rotating.center.x;
    const y = clientCoordinates.y - _rotating.center.y;
    const d = RADIANS_TO_DEGREES * Math.atan2(y, x);
    _rotating.rotation = d - _rotating.start;

    if (final) {
      setRotating(null);
      // Update external state only after finalizing
      rotate(
        desk.id,
        _rotating.angle + _rotating.rotation
      );
    }
    else {
      setRotating(_rotating);
    }
  });

  // Event handlers
  const onDragStart = (event: ReactMouseEvent | ReactTouchEvent) => {
    const element = event.target as HTMLElement;

    // Check to ensure we are dragging on the desk
    if (!element.classList.contains(styles.desk)) {
      return;
    }

    setDragging({
      x: element.offsetLeft,
      y: element.offsetTop,
      client: eventCoordinates(event),
      parentRect: element.parentElement?.getBoundingClientRect(),
      elementRect: element.getBoundingClientRect()
    })

    // Trigger dragging monitoring
    dragTrigger();
  };
  const onRemove = (event: ReactMouseEvent) => {
    remove(desk.id);
  };
  const onRotateStart = (event: ReactMouseEvent | ReactTouchEvent) => {
    // Concept copied from https://bl.ocks.org/joyrexus/7207044
    const element = event.target as HTMLElement;

    // Check first to see if dragging on the rotate handle
    if (element.classList.contains(styles.rotateHandle)) {
      return;
    }

    const rect = element.parentElement?.parentElement?.getBoundingClientRect();

    // Check for missing element, if so just exit
    if (!rect) {
      return;
    }

    const clientCoordinates = eventCoordinates(event);
    const clientX = clientCoordinates.x,
      clientY = clientCoordinates.y;

    event.preventDefault();
    event.stopPropagation();

    // Setup object of data used for rotating
    const rotating = {
      angle: desk.angle,
      rotation: 0.0,
      start: 0.0,
      center: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      }
    };
    const x = clientX - rotating.center.x,
      y = clientY - rotating.center.y;
    rotating.start = RADIANS_TO_DEGREES * Math.atan2(y, x);

    setRotating(rotating);

    // Trigger dragging monitoring
    rotateTrigger();
  };

  // Provide dimensions to callback
  useEffect(() => {
    if(!editDimension) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        editDimension(desk.id, entry.contentRect);
      }
    });
    observer.observe(container.current as HTMLElement);

    return () => observer.disconnect();
  }, [editDimension, desk.id]);

  // Create styles and classes for based on state
  const style = {
    left: (dragging ? dragging.x : desk.x) + 'px',
    top: (dragging ? dragging.y : desk.y) + 'px',
    transform: 'rotate(' + (rotating ? (rotating.angle + rotating.rotation) : desk.angle) + 'deg)'
  };

  let mainClasses = styles.desk;
  if (editable) {
    mainClasses += ' ' + styles.editable;
  }
  if (dragging !== null) {
    mainClasses += ' ' + styles.active;
  }
  let rotateHandleClasses = styles.rotateHandle;
  if (rotating !== null) {
    rotateHandleClasses += ' ' + styles.rotateHandle;
  }

  return (
    <div
      ref={container}
      className={mainClasses}
      style={style}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}>
      <div className={styles.icon}>
        <img alt="" src={deskImage} />
      </div>
      <div className={styles.container}>
        <div className={styles.dragHandle}>
          {editable &&
            <img alt="Drag Me" src={dragImage} />
          }
        </div>
        <div className={styles.deleteHandle}>
          {editable &&
            <img
              alt="Delete"
              src={deleteImage}
              onClick={onRemove} />
          }
        </div>
        <div className={styles.name}>{name}</div>

        <div className={rotateHandleClasses}>
          {editable &&
            <img
              alt="Rotate Me"
              src={rotateImage}
              onMouseDown={onRotateStart}
              onTouchStart={onRotateStart} />
          }
        </div>
        <div className={styles.clear}></div>
      </div >
    </div >
  );
};
export default Desk;
