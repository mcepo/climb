import { Layer } from 'leaflet'
import gradeService from '../services/grade.service'

function lengthString (length: number) {
  return length ? length + 'm' : ''
}

const tooltipService = {
  set (layer: Layer, content: string) {
    layer.bindTooltip(content, {
      permanent: true,
      sticky: true,
      className: 'tooltip',
      interactive: true
    }
    )
  },
  route ({ layer, item }) {
    this.set(layer, gradeService.forge(item.grades) + ', ' + lengthString(item.length))
  },
  pitch ({ layer, item }) {
    this.set(layer, gradeService.forge(item.grades) + ', ' + lengthString(item.length))
  }

}

export default tooltipService
