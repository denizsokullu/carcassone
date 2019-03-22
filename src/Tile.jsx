import React, { Component } from 'react';
import monasteryImage from './tiles/monastery/Monastery.png';

const TILE_SIZE = 100;
const TILE_START_X = 0;
const TILE_START_Y = 0;

export class PossibleTile {
  constructor({ x , y , onTileClick }) {
    this.x = x;
    this.y = y;
    this.onTileClickParentHandler = onTileClick || (() => {});
  }

  onTileClick() {
    this.onTileClickParentHandler({ x: this.x, y: this.y });
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
}


export class MonasteryTile extends PlacedTile {
  component () {
    return(
      <BaseTileComponent x={this.x} y={this.y}>
        <img alt='monastery tile' src={monasteryImage}/>
      </BaseTileComponent>
    )
  }
}

class BaseTileComponent extends Component {
  style () {
    return {
      width: TILE_SIZE,
      height: TILE_SIZE,
      left: (TILE_START_X + this.props.x) * TILE_SIZE,
      top: (TILE_START_Y + this.props.y) * TILE_SIZE
    }
  }

  onTileClick () {
    console.log('this.happened')
    if(this.props.onClick) {
      console.log('this.happened')
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
