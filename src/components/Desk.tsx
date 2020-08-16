import React, { useState, DragEvent as ReactDragEvent, TouchEvent as ReactTouchEvent, MouseEvent as ReactMouseEvent } from 'react';
import { CoreDesk, Desks } from '../models/desks';
import styles from './Desk.module.css';
import deskImage from '../assets/images/desk.svg';
import dragImage from '../assets/images/drag.svg';
import deleteImage from '../assets/images/delete.svg';
import rotateImage from '../assets/images/rotate.svg';

const RADIANS_TO_DEGREES = 180.0 / Math.PI;

interface Coordinates {
  x: number;
  y: number;
}

interface RotationMeta {
  angle: number;
  rotation: number;
  start: number;
  events: {
    move: (event: MouseEvent | TouchEvent) => void;
    up: (event: MouseEvent | TouchEvent) => void;
  };
  center: {
    x: number;
    y: number;
  };
}

/**
 * Return the coordinates
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
    const _event = event as DragEvent;
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
};

const Desk = ({
  editable = false,
  desk,
  name = 'Student',
  move,
  rotate,
  remove
}: DeskProps) => {
  const [dragging, setDragging] = useState<Coordinates | null>(null),
    [rotating, setRotating] = useState<RotationMeta | null>(null);

  // Event handlers
  const onDragStart = (event: ReactDragEvent | ReactTouchEvent) => {
    setDragging(eventCoordinates(event));
  };
  const onDragEnd = (event: ReactDragEvent | ReactTouchEvent) => {
    const element = event.target as HTMLElement;

    //Check if we have a starting position or not, if not, just exit
    if (!dragging) {
      return;
    }

    const clientCoordinates = eventCoordinates(event, true);
    const clientX = clientCoordinates.x,
      clientY = clientCoordinates.y;

    //Calculate new position
    let x = clientX - dragging.x + element.offsetLeft,
      y = clientY - dragging.y + element.offsetTop;

    //Ensure position not too far left/top
    if (x < 0) {
      x = 0;
    }
    if (y < 0) {
      y = 0;
    }

    //Ensure position not too far bottom/right
    const parentElement = element.parentElement;
    if (parentElement) {
      const parentRect = parentElement.getBoundingClientRect(),
        elementRect = element.getBoundingClientRect();

      if (x > parentRect.width - elementRect.width) {
        x = parentRect.width - elementRect.width;
      }
      if (y > parentRect.height - elementRect.height) {
        y = parentRect.height - elementRect.height;
      }
    }

    move(desk.id, x, y);

    //Reset object
    setDragging(null);
  };
  const onRemove = (event: ReactMouseEvent) => {
    remove(desk.id);
  };
  const onRotateEnd = (event: MouseEvent | TouchEvent) => {
    if (rotating) {
      //Finish rotating
      rotate(
        desk.id,
        rotating.angle + rotating.rotation
      );

      //Remove listeners
      document.body.removeEventListener(
        'mousemove',
        rotating.events.move
      );
      document.body.removeEventListener('mouseup', rotating.events.up);
      document.body.removeEventListener(
        'touchmove',
        rotating.events.move
      );
      document.body.removeEventListener('touchend', rotating.events.up);

      // Reset object
      setRotating(null);
    }
  };
  const onRotate = (event: MouseEvent | TouchEvent) => {
    let d, x, y;

    const clientCoordinates = eventCoordinates(event, true);
    const clientX = clientCoordinates.x,
      clientY = clientCoordinates.y;

    event.preventDefault();
    event.stopPropagation();

    if (rotating) {
      //Apply latest rotation
      (x = clientX - rotating.center.x),
        (y = clientY - rotating.center.y),
        (d = RADIANS_TO_DEGREES * Math.atan2(y, x));
      rotating.rotation = d - rotating.start;
      rotate(
        desk.id,
        rotating.angle + rotating.rotation
      );
    }
  };
  const onRotateStart = (event: ReactMouseEvent | ReactTouchEvent) => {
    // Concept copied from https://bl.ocks.org/joyrexus/7207044
    const element = event.target as HTMLElement;
    const rect = element?.parentElement?.parentElement?.getBoundingClientRect();

    // Check for missing element, if so just exit
    if(!rect) {
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
      events: {
        move: onRotate,
        up: onRotateEnd
      },
      center: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      }
    };
    setRotating(rotating);

    const x = clientX - rotating.center.x,
      y = clientY - rotating.center.y;
    rotating.start = RADIANS_TO_DEGREES * Math.atan2(y, x);

    //Add listeners to entire document
    document.body.addEventListener('mousemove', rotating.events.move);
    document.body.addEventListener('mouseup', rotating.events.up);
    document.body.addEventListener('touchmove', rotating.events.move);
    document.body.addEventListener('touchend', rotating.events.up);
  };

  // Create styles and classes for based on state
  const style = {
    left: desk.x + 'px',
    top: desk.y + 'px',
    transform: 'rotate(' + desk.angle + 'deg)'
  };
  let mainClasses = styles.desk;
  if (dragging !== null) {
    mainClasses += ' ' + styles.active;
  }
  let rotateHandleClasses = styles.rotateHandle;
  if (rotating !== null) {
    rotateHandleClasses += ' ' + styles.rotateHandle;
  }

  return (
    <div
      className={mainClasses}
      draggable={editable}
      style={style}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onTouchStart={onDragStart}
      onTouchEnd={onDragEnd}>
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
