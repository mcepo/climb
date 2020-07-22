import { Layer } from 'leaflet'
import gradeService from '../services/grade.service'

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
    this.set(layer, item.name + '<br/>' + gradeService.forge(item.grades) + '<br/>' + item.length + 'm')
  },
  pitch ({ layer, item }) {
    this.set(layer, gradeService.forge(item.grades) + ' ' + item.length + 'm')
  },
  trail ({ layer, item }) {
    this.set(layer, item.name)
  }

}

export default tooltipService
