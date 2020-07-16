import Strategy from './strategy';
//import Combinatorics from 'js-combinatorics';

export default class BruteForceStrategy extends Strategy {
  constructor() {
    super();
  }

  /**
   *
   * @param Room room
   * @param Student student
   * @returns number
   */
  averageDistance(room, student) {
    if (student.preferences.length === 0) {
      return 0.0;
    }
    const total = student.preferences.reduce((accumulator, prefStudent) => accumulator + this.distance(room, student, prefStudent), 0.0);
    return total / student.preferences.length;
  }

  /**
   *
   * @param Room room
   */
  totalAverageDistance(room) {
    return room.students.reduce((accumulator, current) => accumulator + this.averageDistance(room, current), 0.0);
  }

  /**
   *
   * @param {*} room
   * @param {*} orderIndex
   */
  assignDesks(room, orderIndex) {
    orderIndex.forEach((studentIndex, deskIndex) => {
      room.desks[deskIndex].student = room.students[studentIndex];
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
  arrange(room) {
    /**
     * Indexes used to try arrangements.
     *
     * [
     *  Desk => Student
     * ]
     */
    let orderIndex = [...room.students.keys()];

    //Initial assignment
    this.assignDesks(room, orderIndex);

    //Go through each student
    room.students.forEach((_, currentStudentIndex) => {
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
