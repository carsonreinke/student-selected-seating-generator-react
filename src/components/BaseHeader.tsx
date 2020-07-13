import React from 'react';
import styles from './BaseHeader.module.css'

export default function BaseHeader() {
  return (
    <header className={styles.header}>
      <h1>Student Selected Seating Generator</h1>
    </header>
  )
}