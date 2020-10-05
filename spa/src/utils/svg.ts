
function svgLayout (content: string) {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="24" heigth="24" viewBox="0 0 24 24">' + content + '</svg>'
}

export function svgIconUrl (svg: string) {
  return 'data:image/svg+xml;base64,' + btoa(svgLayout(svg))
}
