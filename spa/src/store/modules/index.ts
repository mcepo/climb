// autoload all modules in current folder

import { Module } from 'vuex'
import { DrawersState } from './drawers'
import { RootState } from '..'

const requireModule = require.context('.', false, /\.ts$/)
const modules: Record<string, Module<DrawersState, RootState>> = {}

requireModule.keys().forEach((fileName) => {
  if (fileName === './index.ts') return
  const moduleName = fileName.replace(/(\.\/|\.ts)/g, '')
  modules[moduleName] = {
    namespaced: true,
    ...requireModule(fileName).default
  }
})
export default modules
