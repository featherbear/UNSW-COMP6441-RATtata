// Write my own typer because the rest aren't what I need :c

class Typer {
  constructor (element, opts) {
    this._element = element

    this._buffer = ''
    this._isTyping = false

    let { clear } = opts
    if (clear === true) element.innerText = ''
  }

  _typeLoop (delay) {
    let c = this._buffer.slice(0, 1)
    this._buffer = this._buffer.slice(1)

    if (c) {
      this._element.innerText += c
      setTimeout(() => this._typeLoop(delay), delay)
    } else {
      this._isTyping = false
    }
  }

  type (data, delay) {
    this._buffer += data.toString().replace(/[^\x1F-\x7F\n]/g, '')

    if (delay === undefined) delay = 70

    if (!this._isTyping) {
      this._isTyping = true
      this._typeLoop(delay)
    }

    return this
  }
}

export { Typer }
