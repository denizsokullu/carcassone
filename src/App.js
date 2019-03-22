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

const tileTypes = [
  // MonasteryTile,
  MonasteryRoadBottomTile];


class App extends Component {
  constructor (props) {
    super(props);
    this.createTile = this.createTile.bind(this);
    this.tiles = [];
    this.possibles = [new PossibleTile({ x: 0 , y: 0, onTileClick: this.createTile })];
    this.orientation = 0
    this.state = {
      tiles: this.tiles,
      possibles: this.possibles,
      orientation: this.orientation,
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

  updateOrientation () {
    this.orientation = (this.state.orientation + 1) % 4;
    this.searchForPossibleTiles();
    this.cleanPossibles();
    this.setState({ orientation: this.orientation, possibles: this.possibles });
  }

  cleanPossibles () {
    const { possibles } = this;
    const possiblesToRemove = []

    possibles.forEach((possible, i) => {
      const neighbors = this.findNeighbors(possible.getNeighbors());
      const fitsWithNeighbors = this.nextTile.checkPlacing({...neighbors, orientation: this.orientation});
      const isOccupied = this.tilesHas(possible.x, possible.y) >= 0;
      if (!fitsWithNeighbors || isOccupied) possiblesToRemove.push(possible);
    })

    possiblesToRemove.forEach(possible => {
      const index = possibles.indexOf(possible);
      possibles.splice(index, 1)
    });

    this.possibles = possibles;
  }

  searchForPossibleTiles () {
    this.tiles.forEach(tile => {
      const neighbors = tile.getNeighbors();
      const positions = Object.values(neighbors).map(v => ({x: v.x, y: v.y}));
      const newPossibles = positions.map((pos => new PossibleTile({...pos, onTileClick: this.createTile }))).filter(this.canBeAdded.bind(this));
      this.possibles = this.possibles.concat(newPossibles);
    })
    return this.possibles;
  }

  createTile ({ x, y }) {
    if( this.state.possibles.filter(tile => tile.x === x && tile.y === y).length === 1 ) {
      this.tiles = this.state.tiles.slice();
      const newTile = new this.nextTile({x, y, orientation: this.state.orientation})
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
    const NextTile = new this.nextTile({orientation: this.state.orientation});
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
          <button onClick={this.updateOrientation.bind(this)}> Update Orientation </button>
        </div>
      </div>
    );
  }
}

export default App;
