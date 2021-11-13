import { Coords, TileLayer } from 'leaflet'
import imageService from '@/services/image.service'

export default class PersistantTileLayer extends TileLayer {
  createTile (coords: Coords, done) {
    const tile = super.createTile(coords, done) as HTMLImageElement

    imageService.fetchImage('tile-' + coords.x + '-' + coords.y + '-' + coords.z, tile.src, 'png')
      .then((image) => {
        tile.src = image
      })

    // make sure leaflet doesn't request tiles
    tile.src = ''

    return tile
  }
}
