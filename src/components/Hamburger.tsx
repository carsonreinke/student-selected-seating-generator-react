import React, { MouseEvent } from 'react';
import styles from './Hamburger.module.css';

interface BurgerProps {
  expanded: boolean,
  toggle: () => void
}

const Hamburger = ({
  expanded,
  toggle
}: BurgerProps) => {
  const onToggle = (event: MouseEvent) => {
    event.preventDefault();
    toggle();
  }

  let classes = styles.hamburger;
  if (expanded) {
    classes += ' ' + styles.expanded;
  }

  return (
    <div className={classes} onClick={onToggle} title={expanded ? 'Collapse' : 'Expand'} role="button" aria-pressed={expanded}>
      <span></span>
    </div>
  );
};
export default Hamburger;
