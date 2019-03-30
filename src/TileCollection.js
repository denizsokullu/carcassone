import { Map } from 'immutable';

export default class TileCollection {
  constructor(initialValues = {}) {
    this.tiles = Map(initialValues);
  }

  addTile (tile) {
    const { x, y} = tile;
    const hash = this.hash(x,y);
    this.tiles = this.tiles.set(hash, tile);
  }

  getTile (x, y) {
    return this.tiles.get(this.hash(x, y))
  }

  removeTile ({x, y}) {
    this.tiles = this.tiles.delete(this.hash(x, y))
  }

  hash (x,y) {
    return `${x}::${y}`;
  }

  toJS () {
    return this.tiles.toJS()
  }

  includes (x, y) {
    return Boolean(this.getTile(x, y));
  }

  forEach (callback) {
    this.tiles.valueSeq().forEach(callback)
  }

  map (callback) {
    return this.tiles.valueSeq().map((v,i) => callback(v, i))
  }

  log () {
    console.log(this.toJS())
  }
}