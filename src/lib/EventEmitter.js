// Handles events

class EventEmitter {
  constructor () {
    this._events = {}
  }

  on (evtName, func) {
    console.log(this)
    if (!evtName || !func) throw Error('...on(evtName, func)')
    if (!this._events[evtName]) this._events[evtName] = []
    this._events[evtName].push(func)
  }

  emit (evtName, ...data) {
    if (!evtName) throw Error('...emit(evtName)')
    if (!this._events[evtName]) {
      return
    }
    for (let listener of this._events[evtName]) {
      listener.call(this, ...data)
    }
  }
}

module.exports = EventEmitter
