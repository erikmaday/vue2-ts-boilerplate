// import allModules from './modules'
// import store from './'

// export function dispatchActionForAllModules(
//   actionName: string,
//   modules: { [index: string]: any } = allModules,
//   modulePrefix = '',
//   dispatchGlobal = false
// ): void {
//   // For every module...
//   console.log(store)
//   for (const [moduleName] of Object.entries(modules)) {
//     console.log(moduleName)
//     const moduleDefinition = modules[moduleName]

//     // If the action is defined on the module...
//     if (moduleDefinition.actions && moduleDefinition.actions[actionName]) {
//       // Dispatch the action if the module is namespaced. Otherwise,
//       // set a flag to dispatch the action globally at the end.
//       if (moduleDefinition.namespaced) {
//         store.dispatch(`${modulePrefix}${moduleName}/${actionName}`)
//       } else {
//         dispatchGlobal = true
//       }
//     }

//     // If there are any nested sub-modules...
//     if (moduleDefinition.modules) {
//       // Also dispatch the action for these sub-modules.
//       dispatchActionForAllModules(
//         actionName,
//         moduleDefinition.modules,
//         `${modulePrefix + moduleName}/`,
//         dispatchGlobal
//       )
//     }
//   }

//   // If this is the root and at least one non-namespaced module
//   // was found with the action...
//   if (!modulePrefix && dispatchGlobal) {
//     // Dispatch the action globally.
//     store.dispatch(actionName)
//   }
//   console.log(store)
// }
