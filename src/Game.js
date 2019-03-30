import { OrderedSet } from 'immutable';

export class Game {
  constructor ({ players }) {
    this.players = OrderedSet(players || []);
    this.playerIterator = this.players[Symbol.iterator];
    this.currentPlayer = null;
    this.turnCount = 0;
    this.started = false;
    this.ended = false;
  }

  gameStates = {
    notStarted: Symbol('notStarted'),
    started: Symbol('started'),
    ended: Symbol('ended')
  }

  getGameState () {
    if (!this.started) return this.gameStates.notStarted
    else if (this.started && !this.ended) return this.gameStates.started;
    else return this.gameStates.ended;
  }

  startGame () {
    this.started = true;
    this.getNextPlayer();
  }

  getNextPlayer () {
    this.currentPlayer = this.playerIterator.next();
  }

  getAllPlayers () {
    return this.players.toJS()
  }

  nextTurn () {
    this.getNextPlayer();
    this.incrementTurn();
  }

  incrementTurn () {
    this.turnCount += 1;
  }

  getCurrentPlayer () {
    return this.currentPlayer
  }

  // check ending rules
}

export class RuleBook {

}