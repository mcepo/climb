import Vue from 'vue'

const drawers = {
  state: Vue.observable(
    {
      left: true,
      right: false
    }
  ),
  setLeft (state: boolean) {
    this.state.left = state
  },
  setRight (state: boolean) {
    this.state.right = state
  }
}
export default drawers
