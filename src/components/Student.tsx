import React, { ChangeEvent } from 'react';
import MultiSelect from 'react-multi-select-component';
import styles from './Student.module.css';
import { CoreStudent, Students } from '../models/students';
import { toArray } from '../utils/collection';

type PreferenceChange = (id: string, preference: string) => void;

interface StudentProps {
  student: CoreStudent;
  students: Students;
  editName: (id: string, name: string) => void;
  addPreference: PreferenceChange;
  removePreference: PreferenceChange;
}

export interface Option {
  label: string;
  value: string;
}

// Export this so it can be tested easily
export const preferenceChange = (
  student: CoreStudent,
  students: Students,
  selected: Option[],
  addPreference: PreferenceChange,
  removePreference: PreferenceChange
) => {
  const existingPreferences = students.preferences[student.id],
    changedPreferences = selected.map(select => select.value);
  const newPreferences = changedPreferences.filter(id => !existingPreferences.includes(id)),
    removedPreferences = existingPreferences.filter(id => !changedPreferences.includes(id));

  removedPreferences.forEach(id => removePreference(student.id, id));
  newPreferences.forEach(id => addPreference(student.id, id));
};

const Student = ({
  student,
  students,
  editName,
  addPreference,
  removePreference
}: StudentProps) => {
  const studentOptions: Option[] = toArray(students).filter(s => s.id !== student.id).map(s => {
    return {
      label: s.name,
      value: s.id
    };
  });
  const preferenceOptions = studentOptions.filter(option => students.preferences[student.id].includes(option.value));

  const onNameChange = (event: ChangeEvent) => {
    const name = (event.target as HTMLInputElement).value;
    editName(student.id, name);
  };
  const onPreferenceChange = (selected: Option[]) => {
    preferenceChange(student, students, selected, addPreference, removePreference);
  };

  return (
    <div className={styles.student}>
      <div className={styles.name}>
        <input type="text" value={student.name} onChange={onNameChange} placeholder="Student name" />
      </div>
      <MultiSelect
        labelledBy=""
        options={studentOptions}
        value={preferenceOptions}
        overrideStrings={{ selectSomeItems: 'Student preferences' }}
        disableSearch={true}
        hasSelectAll={false}
        isLoading={false}
        onChange={onPreferenceChange}
        className={styles.multiselect}
      />
    </div >
  );
};

export default Student;
