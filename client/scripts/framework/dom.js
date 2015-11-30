import {h, create, diff, patch} from 'virtual-dom'
import svg from 'virtual-dom/virtual-hyperscript/svg'
import mainLoop from 'main-loop'

const loop = function(initState, renderTree) {
  return mainLoop(initState, renderTree, {
    create: create,
    diff: diff,
    patch: patch
  })
}

export default {
  h,
  svg,
  loop
}
