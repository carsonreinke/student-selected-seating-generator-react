import { Room, findStudentDesk } from './room';
import { CoreStudent } from './students';
import { distance } from './desks';

export default class Strategy {
  /**
   * Arrange a room
   *
   * @param Room room
   */
  arrange(room: Room) {
  }

  /**
   * Calculate distance between students
   *
   * @param Room room
   * @param CoreStudent s1
   * @param CoreStudent s2
   * @returns number
   */
  distance(room: Room, s1: CoreStudent, s2: CoreStudent) {
    const d1 = findStudentDesk(room,  s1),
      d2 = findStudentDesk(room, s2);

    if (!d1 || !d2) {
      return 0.0;
    }

    return distance(d1, d2);
  }
}
