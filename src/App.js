import React, { Component } from 'react';
import PanZoomContainer from '@ajainarayanan/react-pan-zoom';
import { MonasteryTile, MonasteryRoadBottomTile, PossibleTile } from './Tile';
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

const tileTypes = [MonasteryTile, MonasteryRoadBottomTile];


class App extends Component {
  constructor (props) {
    super(props);
    this.createTile = this.createTile.bind(this);
    this.tiles = [];
    this.possibles = [new PossibleTile({ x: 0 , y: 0, onTileClick: this.createTile })];
    this.state = {
      tiles: this.tiles,
      possibles: this.possibles
    }
    this.createdFirstTile = false;

    this.createTile = this.createTile.bind(this);

    this.nextTile = MonasteryRoadBottomTile;
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

  updateNextTile (props) {
    this.nextTile = tileTypes[Math.floor(Math.random()*tileTypes.length)];
  }

  areTilesEqual(tile1, tile2) {
    return tile1.x === tile2.x && tile1.y === tile2.y
  }

  findNeighbors(neighbors) {
    const actualNeighbors = {
      left: null,
      top: null,
      right: null,
      bottom: null,
    };
    const { left, top, right, bottom } = neighbors
    this.tiles.forEach(tile => {
      if(this.areTilesEqual(tile, left)) actualNeighbors.left = tile;
      else if (this.areTilesEqual(tile, top)) actualNeighbors.top = tile;
      else if (this.areTilesEqual(tile, right)) actualNeighbors.right = tile;
      else if (this.areTilesEqual(tile, bottom)) actualNeighbors.bottom = tile;
    });
    return actualNeighbors
  }

  canBeAdded (tile) {
    const { x, y } = tile;
    const notOccupied = this.possiblesHas(x, y) === -1 && this.tilesHas(x, y) === -1;
    return notOccupied
  }

  cleanPossibles () {
    const { possibles } = this;
    const possiblesToRemove = []
    possibles.forEach((possible, i) => {
      const neighbors = this.findNeighbors(possible.getNeighbors());
      const fitsWithNeighbors = this.nextTile.checkPlacing(neighbors);
      const isOccupied = this.tilesHas(possible.x, possible.y) >= 0;
      console.log(JSON.stringify(possible), i);
      if (!fitsWithNeighbors || isOccupied) possiblesToRemove.push(possible);
    })

    possiblesToRemove.forEach(possible => {
      const index = possibles.indexOf(possible);
      console.log(index);
      possibles.splice(index, 1)
    });
    this.possibles = possibles;
  }

  createTile ({ x, y, orientation = 0}) {
    if( this.state.possibles.filter(tile => tile.x === x && tile.y === y).length === 1 ) {
      this.tiles = this.state.tiles.slice();
      const newTile = new this.nextTile({x, y, orientation})
      this.tiles.push(newTile);

      this.updateNextTile();

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
    return this.state.possibles.map((tile, key) => tile.component())
  }

  render() {
    const NextTile = new this.nextTile({});
    return (
      <div className='container'>
        <PanZoomContainer>
          <div className='tile-grid'>
            { this.renderPlacedTiles() }
            { this.renderPossibleTiles() }
          </div>
        </PanZoomContainer>
        <div className='next-tile'>
          { NextTile.component() }
        </div>
      </div>
    );
  }
}

export default App;
