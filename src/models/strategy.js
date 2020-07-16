import Base from './base';

export default class Strategy extends Base {
  constructor() {
    super();
  }

  /**
   * Arrange a room
   *
   * @param Room room
   */
  arrange(room) {
  }

  /**
   * Calculate distance between students
   *
   * @param Room room
   * @param Student s1
   * @param Student s2
   * @returns number
   */
  distance(room, s1, s2) {
    const d1 = room.findStudentDesk(s1),
      d2 = room.findStudentDesk(s2);

    if (!d1 || !d2) {
      return 0.0;
    }

    return d1.distance(d2);
  }
}
