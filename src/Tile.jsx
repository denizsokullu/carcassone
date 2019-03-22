import React, { Component } from 'react';
import monasteryImage from './tiles/monastery/Monastery.png';
import monasteryRoadBottomImage from './tiles/monastery/MonasteryRoadBottom.png';

const TILE_SIZE = 100;
const TILE_START_X = 0;
const TILE_START_Y = 0;

const GRASS = Symbol('grass');
const ROAD = Symbol('road');

export class PossibleTile {
  constructor({ x , y , onTileClick, orientation }) {
    this.x = x;
    this.y = y;
    this.orientation = orientation || 0;
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
    return <BaseTileComponent x={this.x} y={this.y} orientation={this.orientation} possible onClick={this.onTileClick.bind(this)}/>
  }
}

class PlacedTile extends PossibleTile {
  static updateOrientation (orientation) {
    if(orientation === 0) return;
    else { this.rotate() }
  }

  static rotate () {
    const oldValues = {
      left: this.left,
      top: this.top,
      right: this.right,
      bottom: this.bottom
    };
    this.left = oldValues.bottom;
    this.top = oldValues.left;
    this.right = oldValues.top;
    this.bottom = oldValues.right;
  }

  static checkPlacing ({ left, top, right, bottom, orientation}) {
    this.updateOrientation(orientation);
    console.log(this.left, this.top, this.right, this.bottom)
    // Use the orientation here
    const leftGood = left ? left.constructor.right === this.left : true
    const topGood = top ? top.constructor.bottom === this.top : true
    const rightGood = right ? right.constructor.left === this.right : true
    const bottomGood = bottom ? bottom.constructor.top === this.bottom : true
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
      <BaseTileComponent x={this.x} y={this.y} orientation={this.orientation}>
        <img alt='monastery tile' src={monasteryRoadBottomImage}/>
      </BaseTileComponent>
    )
  }
}

class BaseTileComponent extends Component {
  style () {
    let style = {
      width: TILE_SIZE,
      height: TILE_SIZE,
      transform: `rotate(${this.props.orientation * 90}deg)`
    }

    if (this.props.x !== undefined && this.props.y !== undefined) {
      style = { ...style,
                left: (TILE_START_X + this.props.x) * TILE_SIZE,
                top: (TILE_START_Y + this.props.y) * TILE_SIZE
              }
    }

    return style
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
