// autoload all modules in current folder

const requireModule = require.context('.', false, /\.ts$/)
const modules: any = {}

requireModule.keys().forEach((fileName) => {
  if (fileName === './index.ts') return
  const moduleName = fileName.replace(/(\.\/|\.ts)/g, '')
  modules[moduleName] = {
    namespaced: true,
    ...requireModule(fileName).default
  }
})
export default modules
