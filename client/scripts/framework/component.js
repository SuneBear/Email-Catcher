import Event from './event'
import {h, loop} from './dom'

class Component {
  constructor(props) {
    this.props = Object.assign({}, this.defaultProps, props)
    this.states = Object.assign({}, this.defaultStates)
    this.el = {}
    this.initialize()
  }

  defaultProps: {}

  defaultStates: {}

  initialize() {
    this.render()
  }

  setState(name, value) {
    const payload = {
      key: name,
      value: value
    }
    this.states[stateName] = value
  }

  tree(data) {

  }

  render() {
    this.el = loop(this.states, this.tree)

  }
}

Event.mixToClass(Component)

export default Component
