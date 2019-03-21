import React, { Component } from 'react';

const TILE_SIZE = 100;
const TILE_START_X = 0;
const TILE_START_Y = 0;

export default class PossibleTile extends Component {
  style () {
    return {
      width: TILE_SIZE,
      height: TILE_SIZE,
      left: (TILE_START_X + this.props.x) * TILE_SIZE,
      top: (TILE_START_Y + this.props.y) * TILE_SIZE
    }
  }

  render() {
    const { x, y } = this.props;
    return (
      <div className='tile possible' style={this.style()} onClick={() => this.props.onTileClick({ x, y })}>
      </div>
    );
  }
}
