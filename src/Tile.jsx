import React, { Component } from 'react';

const TILE_SIZE = 100;
const TILE_START_X = 0;
const TILE_START_Y = 0;

export default class Tile extends Component {
  style () {
    return {
      width: TILE_SIZE,
      height: TILE_SIZE,
      left: (TILE_START_X + this.props.x) * TILE_SIZE,
      top: (TILE_START_Y + this.props.y) * TILE_SIZE
    }
  }

  render() {
    return (
      <div className='tile' style={this.style()}>
        {/* <div className='side side-1'>1</div>
        <div className='side side-2'>2</div>
        <div className='side side-3'>3</div>
        <div className='side side-4'>4</div> */}
      </div>
    );
  }
}
