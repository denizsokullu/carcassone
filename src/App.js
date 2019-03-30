import React, { Component } from 'react';
import { Game } from './Game';
import Player from './Player';
import Board from './Board';
import './App.scss';

// TODO

// Tile Generator
// Round Logic
// Round has a tile
// Round is owned by a player
// Grass Logic
// Scoring Logic in general argh


const connection = new WebSocket('ws://localhost:8080');
window.connection = connection;
connection.onopen = () => {
  connection.send('hey yo')
}
connection.onmessage = e => {
  // console.log(JSON.parse(e.data));
}

class CarcassoneGame extends Component {
  constructor (props) {
    super(props);


    this.game = new Game({
      players:[
        new Player({ name: 'deniz'}),
        new Player({ name: 'Wil'})
      ]
    })
  }

  renderScoreboard () {
    const players = this.game.getAllPlayers()
    return (
      <div className='scoreboard'>
        <h4>Scoreboard</h4>
        <ul>
          { players.map((player, index) => <li key={index}>{player.name}: {player.score}</li>)}
        </ul>
      </div>
    )
  }

  render () {
    return (
      <React.Fragment>
        <Board/>
        <div className='hud'>
          { this.renderScoreboard() }
        </div>
      </React.Fragment>
    )
  }
}

export default CarcassoneGame;
