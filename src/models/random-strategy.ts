import Strategy from './strategy';
import { Room } from './room';
import { toArray } from '../utils/collection';
import { CoreStudent } from './students';

export default class RandomStrategy extends Strategy {
  /**
   *
   * @param CoreStudent[] array
   * @returns CoreStudent[]
   * @see https://stackoverflow.com/a/2450976/601607
   */
  shuffle(array: CoreStudent[]): CoreStudent[] {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /**
   *
   * @param Room room
   */
  arrange(room: Room) {
    const students = this.shuffle(toArray(room.students));
    toArray(room.desks).forEach((desk, index) => {
      room.desks.students[desk.id] = [students[index].id];
    });
  }
}
