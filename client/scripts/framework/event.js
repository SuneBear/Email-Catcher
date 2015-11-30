import {util} from './utils/main'

/**
 * https://github.com/cnchanning/Event
 */

class Event {
  static mixToClass(Target) {
    const protoEvent = Event.prototype
    const protoTarget = Target.prototype
    util.extend(protoTarget, protoEvent)
  }
}

Object.defineProperties(Event.prototype, {
  on: {
    writable: true,
    enumerable: true,
    value: function(type, listener) {
      if (!listener) return this
      if (this._events === undefined) this._events = {}
      this._events[type] = this._events[type] || []
      this._events[type].push(listener)
      return this
    }
  },

  once: {
    writable: true,
    enumerable: true,
    value: function(type, listener) {
      let bridge = () => {
        let args = Array.prototype.slice.call(arguments, 1)
        this.off(type, listener)
        listener.call(this, args)
      }
      this.on(type, bridge)
      return this
    }
  },

  off: {
    writable: true,
    enumerable: true,
    value: function(type, listener) {
      if (this._events === undefined) return this
      if (arguments.length === 0) {
        this._events = {}
      } else if (arguments.length === 1) {
        this._events[type] = []
      } else {
        let list = this._events[type]
        if (list) {
          let length = list.length
          for (let i = 0; i < length; i++) {
            if (listener === list[i]) {
              list.splice(i, 1)
            }
          }
        }
      }
      return this
    }
  },

  offAll: {
    writable: true,
    enumerable: true,
    value: function() {
      this.off()
      return this
    }
  },

  trigger: {
    writable: true,
    enumerable: true,
    value: function(type) {
      if (this._events === undefined) return this
      let args = Array.prototype.slice.call(arguments, 1)
      let list = this._events[type]
      if (list) {
        for (let i = 0, len = list.length; i < len; i++) {
          list[i].call(this, args)
        }
      }
      return this
    }
  }
})

export default Event
