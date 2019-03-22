import React, { Component } from 'react';
import PanZoomContainer from '@ajainarayanan/react-pan-zoom';
import { MonasteryTile, PossibleTile } from './Tile';
import './App.scss';

// TODO

// Tile Types
// Tile Type Rules

// Tile Generator

// Round Logic
// Round has a tile
// Round is owned by a player

// Tile orientation(Press r)
// Move the map with touchpad rather than dragging

// Tile art?

// Grass Logic


class App extends Component {
  constructor (props) {
    super(props);
    this.createTile = this.createTile.bind(this);
    this.state = {
      tiles: [],
      possibles: [new PossibleTile({ x: 0 , y: 0, onTileClick: this.createTile })]
    }
    this.createdFirstTile = false;
    this.tiles = [];
    this.possibles = [];
    this.createTile = this.createTile.bind(this);
  }

  possiblesHas(x, y) {
    for (var i = 0; i < this.possibles.length; i++) {
      if ( this.possibles[i].x === x && this.possibles[i].y === y) {
        return i
      }
    }
    return -1;
  }

  tilesHas(x, y) {
    for (var i = 0; i < this.tiles.length; i++) {
      if ( this.tiles[i].x === x && this.tiles[i].y === y) {
        return i
      }
    }
    return -1;
  }

  canBeAdded (tile) {
    const { x, y } = tile;
    return this.possiblesHas(x, y) === -1 && this.tilesHas(x, y) === -1;
  }

  cleanPossibles () {
    const { possibles } = this;
    possibles.forEach((possible, i) => {
      if (this.tilesHas(possible.x, possible.y) >= 0) possibles.splice(i, 1);
    })
    this.possibles = possibles;
  }

  createTile ({ x, y, orientation = 0}) {
    if( this.state.possibles.filter(tile => tile.x === x && tile.y === y).length === 1 ) {
      this.tiles = this.state.tiles.slice();
      this.tiles.push(new MonasteryTile({x, y, orientation}));

      const newPossibles = [
        new PossibleTile({ x: x+1 , y, onTileClick: this.createTile }),
        new PossibleTile({ x: x-1 , y, onTileClick: this.createTile }),
        new PossibleTile({ x, y: y+1, onTileClick: this.createTile }),
        new PossibleTile({ x, y: y-1, onTileClick: this.createTile }),
      ].filter(this.canBeAdded.bind(this));

      const possibles = this.state.possibles.slice();
      this.possibles = possibles.concat(newPossibles);
      this.cleanPossibles();
      this.setState({ tiles: this.tiles, possibles: this.possibles });
    }
  }

  renderPlacedTiles () {
    return this.state.tiles.map((tile, key) => tile.component())
  }

  renderPossibleTiles () {
    console.log(this.state.possibles)
    return this.state.possibles.map((tile, key) => tile.component())
  }

  render() {
    console.log(this.renderPlacedTiles());
    console.log(this.renderPossibleTiles());
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
