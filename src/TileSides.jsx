import React, { Component } from 'react';

class MonasteryTile extends Tile {

}

// 1 City Tiles

class OneCityTile extends Tile {

}

class TopCityBoundaryTile extends OneCityTile {

}

// 2 City Tiles

class TwoCityTile extends Tile {

}

class TopBottomCityTile extends TwoCityTile {

}

class TopRightCityTile extends TwoCityTile {

}

class ConnectedTwoCityTile extends TwoCityTile {

}

class ConnectedLeftRightCityTile extends ConnectedTwoCityTile {

}

class ShieldedConnectedLeftRightCityTile extends ConnectedTwoCityTile {

}

class ConnectedTopRightCityTile extends ConnectedTwoCityTile {

}

class ShieldedConnectedTopRightCityTile extends ConnectedTwoCityTile {

}

// Three City Tiles

class ThreeCityTile extends Tile {

}

class LeftTopRightCityTile extends ThreeCityTile {

}

class ShieldedLeftTopRightCityTile extends ThreeCityTile {

}

class FourCityBoundaryTile extends Tile {

}



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
