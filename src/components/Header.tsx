import React, { FunctionComponent } from 'react';
import styles from './Header.module.css'

const Header: FunctionComponent = () => {
  return (
    <header className={styles.header}>
      <h1>Student Selected Seating Generator</h1>
    </header>
  );
};
export default Header;
