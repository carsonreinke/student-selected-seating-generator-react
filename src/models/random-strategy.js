import Strategy from './strategy';

export default class RandomStrategy extends Strategy {
  constructor() {
    super();
  }

  /**
   *
   * @param Room room
   */
  arrange(room) {
    const students = [...room.students];
    students.sort(() => Math.random());
    room.desks.forEach((desk, index) => {
      desk.student = students[index];
    });
  }
}
