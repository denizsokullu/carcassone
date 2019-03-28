import React, { Component } from 'react';
import cityTopImage from './tiles/city/CityTop.png';
import cityTopBottomImage from './tiles/city/CityTopBottom.png';
import cityLeftBottomImage from './tiles/city/CityLeftBottom.png';
import connectedCityLeftRightImage from './tiles/city/ConnectedCityLeftRight.png';
import connectedGuardCityLeftRightImage from './tiles/city/ConnectedGuardCityLeftRight.png';
import connectedGuardCityLeftTopImage from './tiles/city/ConnectedGuardCityLeftTop.png';
import connectedGuardCityLeftTopRightBottomImage from './tiles/city/ConnectedGuardCityLeftTopRightBottom.png';
import connectedCityLeftTopRightImage from './tiles/city/ConnectedCityLeftTopRight.png';
import connectedCityRightBottomImage from './tiles/city/ConnectedCityRightBottom.png'
import monasteryImage from './tiles/monastery/Monastery.png';
import monasteryRoadBottomImage from './tiles/monastery/MonasteryRoadBottom.png';

const TILE_SIZE = 100;
const TILE_START_X = 0;
const TILE_START_Y = 0;

const GRASS = Symbol('grass');
const ROAD = Symbol('road');
const CITY = Symbol('city');

export class PossibleTile {
  constructor({ x , y , onTileClick, orientation }) {
    this.x = x;
    this.y = y;
    this.orientation = orientation || 0;
    this.onTileClickParentHandler = onTileClick || (() => {});
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
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
    return null
  }
}

class PlacedTile extends PossibleTile {
  constructor(props) {
    super(props);
    let sides = {
      left: this.constructor.left,
      top: this.constructor.top,
      right: this.constructor.right,
      bottom: this.constructor.bottom
    }

    sides = this.constructor.rotate(sides, this.orientation);

    this.left = sides.left;
    this.top = sides.top;
    this.right = sides.right;
    this.bottom = sides.bottom;
  }

  static rotate (sides, orientation) {
    const { left, top, right, bottom } = sides;
    if (orientation === 0) return sides;
    else if (orientation === 1) {
      return {
        left: bottom,
        top: left,
        right: top,
        bottom: right
      }
    }
    else if (orientation === 2) {
      return {
        left: right,
        top: bottom,
        right: left,
        bottom: top
      }
    }
    else if (orientation === 3) {
      return {
        left: top,
        top: right,
        right: bottom,
        bottom: left
      }
    }
    return sides
  }

  static checkPlacing ({ left, top, right, bottom, orientation}) {
    let sides = {
      left: this.left,
      top: this.top,
      right: this.right,
      bottom: this.bottom
    }
    sides = this.rotate(sides, orientation);

    console.log(sides);

    // Use the orientation here
    const leftGood = left ? left.right === sides.left : true
    const topGood = top ? top.bottom === sides.top : true
    const rightGood = right ? right.left === sides.right : true
    const bottomGood = bottom ? bottom.top === sides.bottom : true

    return leftGood && topGood && rightGood && bottomGood;
  }

  component (key) {
    return(
      <img alt='tile' src={this.constructor.image}/>
    )
  }
}
export class BaseTileComponent extends Component {
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

class GuardPlacedTile extends PlacedTile {
  static guard = true;
}

export class CityTopTile extends PlacedTile {
  static left = GRASS;
  static top = CITY;
  static right = GRASS;
  static bottom = GRASS;
  static image = cityTopImage;
}

export class CityTopBottomTile extends PlacedTile {
  static left = GRASS;
  static top = CITY;
  static right = GRASS;
  static bottom = CITY;
  static image = cityTopBottomImage;
}

export class CityLeftBottomTile extends PlacedTile {
  static left = CITY;
  static top = GRASS;
  static right = GRASS;
  static bottom = CITY;
  static image = cityLeftBottomImage;
}

export class ConnectedCityLeftRightTile extends PlacedTile {
  static left = CITY;
  static top = GRASS;
  static right = CITY;
  static bottom = GRASS;
  static image = connectedCityLeftRightImage;
}

export class ConnectedGuardCityLeftRightTile extends GuardPlacedTile {
  static left = CITY;
  static top = GRASS;
  static right = CITY;
  static bottom = GRASS;
  static image = connectedGuardCityLeftRightImage;
}

export class ConnectedGuardCityLeftTopTile extends GuardPlacedTile {
  static left = CITY;
  static top = CITY;
  static right = GRASS;
  static bottom = GRASS;
  static image = connectedGuardCityLeftTopImage;
}

export class ConnectedGuardCityLeftTopRightBottomTile extends GuardPlacedTile {
  static left = CITY;
  static top = CITY;
  static right = CITY;
  static bottom = CITY;
  static image = connectedGuardCityLeftTopRightBottomImage;
}
export class ConnectedCityLeftTopRightTile extends PlacedTile {
  static left = CITY;
  static top = CITY;
  static right = CITY;
  static bottom = GRASS;
  static image = connectedCityLeftTopRightImage;
}

export class ConnectedCityRightBottomTile extends PlacedTile {
  static left = GRASS;
  static top = GRASS;
  static right = CITY;
  static bottom = CITY;
  static image = connectedCityRightBottomImage;
}

export class MonasteryTile extends PlacedTile {
  static left = GRASS;
  static top = GRASS;
  static right = GRASS;
  static bottom = GRASS;
  static image = monasteryImage;
}

export class MonasteryRoadBottomTile extends PlacedTile {
  static left = GRASS;
  static top = GRASS;
  static right = GRASS;
  static bottom = ROAD;
  static image = monasteryRoadBottomImage;
}
