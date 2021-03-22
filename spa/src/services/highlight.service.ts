import Vue from 'vue'

interface Highlight {
    key: string|null;
}

const highlight = Vue.observable({ key: null } as Highlight)
export default highlight
