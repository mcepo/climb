export function set (sufix = '') {
  document.title = process.env.VUE_APP_TITLE + ' - ' + (sufix || 'community maintained climbers guide')
}
