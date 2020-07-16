import Base from "./base";
import Desk from "./desk";
import Student from "./student";

export default class Room extends Base {
  constructor(arrangementStrategy) {
    super();
    this.desks = [];
    this.students = [];
    this.arrangementStrategy = arrangementStrategy;
    this.name = 'Room';
    this.createdAt = new Date().toISOString();
  }

  /**
   * @returns Desk
   */
  addDesk() {
    const desk = new Desk();
    this.desks.push(desk);
    return desk;
  }

  /**
   *
   * @param Desk desk
   */
  removeDesk(desk) {
    this.desks = this.desks.filter(value => value.id !== desk.id);
  }

  /**
   * @returns Student
   */
  addStudent() {
    const student = new Student();
    this.students.push(student);
    return student;
  }

  /**
   *
   * @param Student student
   */
  removeStudent(student) {
    this.students = this.students.filter(value => value.id !== student.id);
  }

  /**
   * @todo
   */
  arrange() {
    this.arrangementStrategy.arrange(this);
  }

  /**
   * Find a student's desk
   *
   * @param Student student
   * @returns Desk
   */
  findStudentDesk(student) {
    return this.desks.find(desk => desk.student === student);
  }

  /**
   * Created date
   *
   * @returns Date
   */
  createdAtDate() {
    return new Date(this.createdAt);
  }
}
