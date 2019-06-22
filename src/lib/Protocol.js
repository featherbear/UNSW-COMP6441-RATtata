// Enums
const _PacketType = {
  Connection: 0,
  Control: 1,
  Data: 2
}

const _MessageType = {
  KeepAlive: 0,
  Hello: 1,
  List: 2,
  Poll: 3,
  DisplaySetup: 4,
  Screenshot: 5,
  ControlSetup: 6,
  Control: 7,
  KeylogSetup: 8,
  WebcamSetup: 9,
  Restart: 10,
  Shutdown: 11,
  Lock: 12,
  r_Display: 13,
  r_Hello: 14,
  r_List: 15,
  r_Screenshot: 16
}

// const _MessageTypeReverse = {}
// Object.keys(_MessageType).forEach(key => {
//   _MessageTypeReverse[_MessageType[key]] = key
// })

//

class __Protocol {
  constructor (data) {
    if (data) this.data = data
  }

  __defaults__ () {
    this.packetType = String
    this.messageType = Number
  }

  toJSON () {
    let data = {
      packetType: this.packetType,
      messageType: this.messageType
    }
    if (this.data) {
      data.data = this.data
    }

    return data
  }

  toString () {
    return JSON.stringify(this.toJSON())
  }
}
__Protocol.create = function (...args) {
  return new this(...args)
}

// Base

class _Connection extends __Protocol {
  constructor () {
    super(...arguments)
    this.packetType = _PacketType.Connection
  }
}

class _Control extends __Protocol {
  constructor () {
    super(...arguments)
    this.packetType = _PacketType.Control
  }
}

class _Data extends __Protocol {
  constructor () {
    super(...arguments)
    this.packetType = _PacketType.Data
  }
}

// packets

let Packets = {}

Packets.KeepAlive = class KeepAlive extends _Connection {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.KeepAlive
  }
}

Packets.Hello = class Hello extends _Connection {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.Hello
  }
}

Packets.List = class List extends _Connection {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.List
  }
}

Packets.Poll = class Poll extends _Connection {
  constructor () {
    super(...arguments)
    this.messabgeType = _MessageType.Poll
  }
}

Packets.DisplaySetup = class DisplaySetup extends _Control {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.DisplaySetup
  }
}

Packets.Screenshot = class Screenshot extends _Control {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.Screenshot
  }
}

Packets.ControlSetup = class ControlSetup extends _Control {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.ControlSetup
  }
}

Packets.Control = class Control extends _Control {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.Control
  }
}

Packets.KeylogSetup = class KeylogSetup extends _Control {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.KeylogSetup
  }
}

Packets.WebcamSetup = class WebcamSetup extends _Control {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.WebcamSetup
  }
}

Packets.Restart = class Restart extends _Control {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.Restart
  }
}

Packets.Shutdown = class Shutdown extends _Control {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.Shutdown
  }
}

Packets.Lock = class Lock extends _Control {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.Lock
  }
}

// response

Packets.r_Hello = class r_Hello extends _Data {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.r_Hello
  }
}
Packets.r_List = class r_List extends _Data {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.r_List
  }
}

Packets.r_Display = class r_Display extends _Data {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.r_Display
  }
}

Packets.r_Screenshot = class r_Screenshot extends _Data {
  constructor () {
    super(...arguments)
    this.messageType = _MessageType.r_Screenshot
  }
}

function _identifyPacket (rawPacket) {
  switch (rawPacket.packetType) {
    case _PacketType.Connection:
      switch (rawPacket.messageType) {
        case _MessageType.KeepAlive:
          return Packets.KeepAlive
        case _MessageType.Hello:
          return Packets.Hello
        case _MessageType.List:
          return Packets.List
        case _MessageType.Poll:
          return Packets.Poll
      }
      break
    case _PacketType.Control:
      switch (rawPacket.messageType) {
        case _MessageType.DisplaySetup:
          return Packets.DisplaySetup
        case _MessageType.Screenshot:
          return Packets.Screenshot
        case _MessageType.ControlSetup:
          return Packets.ControlSetup
        case _MessageType.Control:
          return Packets.Control
        case _MessageType.KeylogSetup:
          return Packets.KeylogSetup
        case _MessageType.WebcamSetup:
          return Packets.WebcamSetup
        case _MessageType.Restart:
          return Packets.Restart
        case _MessageType.Shutdown:
          return Packets.Shutdown
        case _MessageType.Lock:
          return Packets.Lock
      }
      break
    case _PacketType.Data:
      switch (rawPacket.messageType) {
        case _MessageType.r_Hello:
          return Packets.r_Hello
        case _MessageType.r_List:
          return Packets.r_List
        case _MessageType.r_Display:
          return Packets.r_Display
        case _MessageType.r_Screenshot:
          return Packets.r_Screenshot
      }
      break
  }

  throw Error('Invalid packet headers')
}

function Parser (rawPacket) {
  try {
    let PacketClass = _identifyPacket(rawPacket)
    return new PacketClass(rawPacket.data)
  } catch (e) {
    if (e) throw Error(`Bad packet: ${e}`)
    else throw Error('Bad packet')
  }
}

// export
module.exports = {
  Packets: Packets,
  PacketParser: Parser
}
