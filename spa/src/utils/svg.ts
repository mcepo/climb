
function svgLayout (content: string) {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 4 20 20">' + content + '</svg>'
}

export function svgIconUrl (svg: string) {
  return 'data:image/svg+xml;base64,' + btoa(svgLayout(svg))
}
