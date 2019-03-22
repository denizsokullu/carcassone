import React, { Component } from 'react';
import monasteryImage from './tiles/monastery/Monastery.png';
import monasteryRoadBottomImage from './tiles/monastery/MonasteryRoadBottom.png';

const TILE_SIZE = 100;
const TILE_START_X = 0;
const TILE_START_Y = 0;

const GRASS = Symbol('grass');
const ROAD = Symbol('road');

export class PossibleTile {
  constructor({ x , y , onTileClick }) {
    this.x = x;
    this.y = y;
    this.onTileClickParentHandler = onTileClick || (() => {});
  }

  onTileClick() {
    this.onTileClickParentHandler({ x: this.x, y: this.y });
  }

  getNeighbors () {
    const { x, y } = this;
    return {
      left: { x: x-1, y},
      top: { x, y: y-1 },
      right: { x: x +1, y},
      bottom: { x, y: y+1 },
    }
  }

  component () {
    return <BaseTileComponent x={this.x} y={this.y} possible onClick={this.onTileClick.bind(this)}/>
  }
}

class PlacedTile extends PossibleTile {
  constructor(props) {
    super(props);
    this.orientation = props.orientation || 0;
  }

  static checkPlacing ({ left, top, right, bottom }) {
    // Use the orientation here
    console.log(top, bottom)
    const leftGood = left ? left.constructor.right === this.left : true
    const topGood = top ? top.constructor.bottom === this.top : true
    const rightGood = right ? right.constructor.left === this.right : true
    const bottomGood = bottom ? bottom.constructor.top === this.bottom : true
    console.log(leftGood && topGood && rightGood && bottomGood)
    return leftGood && topGood && rightGood && bottomGood;
  }
}


export class MonasteryTile extends PlacedTile {

  static left = GRASS;
  static top = GRASS;
  static right = GRASS;
  static bottom = GRASS;

  component () {
    return(
      <BaseTileComponent x={this.x} y={this.y}>
        <img alt='monastery tile' src={monasteryImage}/>
      </BaseTileComponent>
    )
  }
}

export class MonasteryRoadBottomTile extends PlacedTile {

  static left = GRASS;
  static top = GRASS;
  static right = GRASS;
  static bottom = ROAD;

  component () {
    return(
      <BaseTileComponent x={this.x} y={this.y}>
        <img alt='monastery tile' src={monasteryRoadBottomImage}/>
      </BaseTileComponent>
    )
  }
}

class BaseTileComponent extends Component {
  style () {
    if (this.props.x !== undefined && this.props.y !== undefined) {
      return {
        width: TILE_SIZE,
        height: TILE_SIZE,
        left: (TILE_START_X + this.props.x) * TILE_SIZE,
        top: (TILE_START_Y + this.props.y) * TILE_SIZE
      }
    }
    return {
      width: TILE_SIZE,
      height: TILE_SIZE,
    }
  }

  onTileClick () {
    if(this.props.onClick) {
      this.props.onClick()
    }
  }

  render() {
    return (
      <div className={`tile ${this.props.possible ? 'possible' : ''}`} style={this.style()} onClick={this.onTileClick.bind(this)}>
        { this.props.children }
      </div>
    );
  }
}
