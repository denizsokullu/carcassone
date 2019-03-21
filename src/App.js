import React, { Component } from 'react';
import PanZoomContainer from '@ajainarayanan/react-pan-zoom';
import Tile from './Tile';
import PossibleTile from './PossibleTile';
import './App.scss';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      tiles: [],
      possibles: [[0,0]]
    }
    this.createdFirstTile = false;
    this.tiles = [];
    this.possibles = [];
  }

  possiblesHas(x, y) {
    for (var i = 0; i < this.possibles.length; i++) {
      if ( this.possibles[i][0] === x && this.possibles[i][1] === y) {
        return i
      }
    }
    return -1;
  }

  tilesHas(x, y) {
    for (var i = 0; i < this.tiles.length; i++) {
      if ( this.tiles[i][0] === x && this.tiles[i][1] === y) {
        return i
      }
    }
    return -1;
  }

  canBeAdded (pos) {
    const [ x, y] = pos;
    return this.possiblesHas(x, y) === -1 && this.tilesHas(x, y) === -1;
  }

  cleanPossibles () {
    const { possibles } = this;
    possibles.forEach((possible, i) => {
      if (this.tilesHas(possible[0], possible[1]) >= 0) possibles.splice(i, 1);
    })
    this.possibles = possibles;
  }

  createTile ({ x, y}) {
    if( this.state.possibles.filter(pos => pos[0] === x && pos[1] === y).length === 1 ) {
      this.tiles = this.state.tiles.slice();
      this.tiles.push([x,y]);
      const newPossibles = [[x+1, y], [x-1, y], [x, y-1], [x, y+1]].filter(this.canBeAdded.bind(this));
      const possibles = this.state.possibles.slice();
      this.possibles = possibles.concat(newPossibles);
      this.cleanPossibles();
      this.setState({ tiles: this.tiles, possibles: this.possibles });
    }
  }

  renderPlacedTiles () {
    return this.state.tiles.map((tile, key) => <Tile x={tile[0]} y={tile[1]} key={key}/>)
  }

  renderPossibleTiles () {
    return this.state.possibles.map((tile, key) => <PossibleTile x={tile[0]} y={tile[1]} onTileClick={this.createTile.bind(this)} key={key}/>)
  }

  render() {
    return (
      <PanZoomContainer>
        <div className='tile-grid'>
          { this.renderPlacedTiles() }
          { this.renderPossibleTiles() }
        </div>
      </PanZoomContainer>
    );
  }
}

export default App;
