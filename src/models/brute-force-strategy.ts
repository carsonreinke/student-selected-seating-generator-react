import Strategy from './strategy';
import { CoreStudent } from './students';
import { Room } from './room';
import { toArray } from '../utils/collection';
import { assignStudent } from './desks';
//import Combinatorics from 'js-combinatorics';

export default class BruteForceStrategy extends Strategy {
  /**
   *
   * @param Room room
   * @param Student student
   * @returns number
   */
  averageDistance(room: Room, student: CoreStudent) {
    const preferences = room.students.preferences[student.id];
    if (preferences.length === 0) {
      return 0.0;
    }
    const total = preferences.reduce((accumulator, prefStudent) => accumulator + this.distance(room, student, room.students.data[prefStudent]), 0.0);
    return total / preferences.length;
  }

  /**
   *
   * @param Room room
   */
  totalAverageDistance(room: Room) {
    return toArray(room.students).reduce((accumulator, current) => accumulator + this.averageDistance(room, current), 0.0);
  }

  /**
   *
   * @param Room room
   * @param number[] orderIndex
   */
  assignDesks(room: Room, orderIndex: number[]) {
    orderIndex.forEach((studentIndex, deskIndex) => {
      const desk = toArray(room.desks)[deskIndex];
      const student = toArray(room.students)[studentIndex];
      assignStudent(room, desk, student);
    });
  }

  /**
   * Initially start with all students in order added.  Arrange by going
   * through each student and placing in new desk and checking the total
   * average for each student to see if it decreases.
   *
   * @param Room room
   * @todo Needs to be optimized
   */
  arrange(room: Room) {
    /**
     * Indexes used to try arrangements.
     *
     * [
     *  Desk => Student
     * ]
     */
    let orderIndex = [...Array(Object.keys(room.students.data).length)].map((_, index) => index);

    //Initial assignment
    this.assignDesks(room, orderIndex);

    //Go through each student
    toArray(room.students).forEach((_, currentStudentIndex) => {
      //Find current desk for student
      const currentDeskIndex = orderIndex.indexOf(currentStudentIndex);

      //Find the lowest total average order
      orderIndex = orderIndex.reduce((previousTryIndex, studentIndex, deskIndex, original) => {
        //Calculate previous total
        this.assignDesks(room, previousTryIndex);
        let previousTotal = this.totalAverageDistance(room);

        //Swap student indexes with desks and calculate total
        const tryIndex = Array.from(original);
        tryIndex[deskIndex] = original[currentDeskIndex];
        tryIndex[currentDeskIndex] = studentIndex;
        this.assignDesks(room, tryIndex);
        let newTotal = this.totalAverageDistance(room);

        //Use new arrangement only if total is less
        return newTotal < previousTotal ? tryIndex : previousTryIndex;
      }, orderIndex);

      //Assign new arrangement
      this.assignDesks(room, orderIndex);
    });
  }
}
