export default class Player {
  constructor({ name }) {
    this.name = name;
    this.score = 0;
  }

  addScore (score) {
    this.score += score;
  }

  getScore () {
    return this.score
  }

  getName () {
    return this.name
  }
}