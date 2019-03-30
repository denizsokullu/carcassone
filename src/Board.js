import React, { Component } from 'react';
import PanZoomContainer from '@ajainarayanan/react-pan-zoom';
import TileCollection from './TileCollection';
import * as Tile from './Tile';

const tileTypes = [
  Tile.MonasteryTile,
  Tile.MonasteryRoadBottomTile,
  Tile.CityTopTile,
  Tile.CityTopBottomTile,
  Tile.CityLeftBottomTile,
  Tile.ConnectedCityLeftRightTile,
  Tile.ConnectedGuardCityLeftRightTile,
  Tile.ConnectedGuardCityLeftTopTile,
  Tile.ConnectedCityLeftTopRightTile,
  Tile.ConnectedCityRightBottomTile,
  Tile.ConnectedGuardCityLeftTopRightBottomTile,
];

const startingTile = Tile.ConnectedGuardCityLeftTopRightBottomTile;

export default class CarcassoneBoard extends Component {
  constructor(props) {
    super(props);

    this.createTile = this.createTile.bind(this);
    this.tiles = new TileCollection();
    this.possibles = new TileCollection();
    this.possibles.addTile(new Tile.PossibleTile({ x: 0 , y: 0, onTileClick: this.createTile }));

    this.orientation = 0
    this.state = {
      tiles: this.tiles,
      possibles: this.possibles,
      orientation: this.orientation,
    }

    this.createdFirstTile = false;

    this.createTile = this.createTile.bind(this);

    this.nextTile = startingTile;
  }

  updateNextTile (props) {
    this.nextTile = tileTypes[Math.floor(Math.random()*tileTypes.length)];
  }

  areTilesEqual(tile1, tile2) {
    return tile1.x === tile2.x && tile1.y === tile2.y
  }

  findNeighbors(neighbors) {
    const { left, top, right, bottom } = neighbors
    return {
      left: this.tiles.getTile(left.x, left.y),
      top: this.tiles.getTile(top.x, top.y),
      right: this.tiles.getTile(right.x, right.y),
      bottom: this.tiles.getTile(bottom.x, bottom.y),
    }
  }

  canBeAdded (tile) {
    const { x, y } = tile;
    const notOccupied = !this.possibles.includes(x, y) && !this.tiles.includes(x, y);
    return notOccupied
  }

  updateOrientation () {
    this.orientation = (this.orientation + 1) % 4;
    this.searchForPossibleTiles();
    this.cleanPossibles();
    this.setState({ orientation: this.orientation, possibles: this.possibles });
  }

  cleanPossibles () {
    let { possibles } = this;

    possibles.forEach((possible, i) => {
      const { x, y } = possible;
      const neighbors = this.findNeighbors(possible.getNeighbors());
      const fitsWithNeighbors = this.nextTile.checkPlacing({...neighbors, orientation: this.orientation });

      const isOccupied = this.tiles.includes(x, y);

      if (!fitsWithNeighbors || isOccupied) this.possibles.removeTile(possible);
    })

    this.possibles = possibles;
  }

  searchForPossibleTiles () {
    this.tiles.log()
    this.tiles.forEach(tile => {

      const neighbors = tile.getNeighbors();
      const positions = Object.values(neighbors).map(v => ({x: v.x, y: v.y}));

      const newPossibles = positions.map((pos => new Tile.PossibleTile({...pos, onTileClick: this.createTile }))).filter(this.canBeAdded.bind(this));

      newPossibles.map(t => this.possibles.addTile(t))
    });
    return this.possibles;
  }

  createTile ({ x, y }) {
    if(this.possibles.includes(x, y)) {
      const newTile = new this.nextTile({x, y, orientation: this.orientation})

      this.tiles.addTile(newTile);

      this.updateNextTile();
      this.orientation = 0;

      this.searchForPossibleTiles();
      this.cleanPossibles();
      this.setState({ tiles: this.tiles, possibles: this.possibles,orientation: this.orientation });
    }
  }

  renderPlacedTiles () {
    return this.state.tiles.map((tile, index) => (
      <Tile.BaseTileComponent x={tile.x} y={tile.y} orientation={tile.orientation} key={index}>
        { tile.component() }
      </Tile.BaseTileComponent>
    ))
  }

  renderPossibleTiles () {
    return this.state.possibles.map((tile, index) => (
      <Tile.BaseTileComponent x={tile.x} y={tile.y} orientation={tile.orientation} possible key={index} onClick={tile.onClick}/>
    ))
  }

  handleKeyPress (event) {
    if(event.key === 'r' || event.key === 'R') {
      this.updateOrientation();
    }
  }

  componentDidMount () {
    document.getElementById('container').focus();
  }

  render() {
    const NextTile = new this.nextTile({orientation: this.state.orientation});
    return (
      <div className='container' id='container' onKeyPress={this.handleKeyPress.bind(this)} tabIndex='0'>
        <PanZoomContainer>
          <div className='tile-grid'>
            { this.renderPlacedTiles() }
            { this.renderPossibleTiles() }
          </div>
        </PanZoomContainer>
        <div className='next-tile'>
          <Tile.BaseTileComponent orientation={NextTile.orientation}>
            { NextTile.component() }
          </Tile.BaseTileComponent>
        </div>
      </div>
    );
  }
}