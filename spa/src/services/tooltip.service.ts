import { Layer } from 'leaflet'
import gradeService from '../services/grade.service'

function lengthString (length) {
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
    this.set(layer, item.name + '<br/>' + gradeService.forge(item.grades) + ' ' + lengthString(item.length))
  },
  pitch ({ layer, item }) {
    this.set(layer, gradeService.forge(item.grades) + ' ' + lengthString(item.length))
  },
  trail ({ layer }) {
    this.set(layer, 'Trail')
  }

}

export default tooltipService
