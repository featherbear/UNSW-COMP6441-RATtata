const { EventEmitter } = require('events')
const { Packets, PacketParser } = require('./lib/Protocol')
const Connection = require('./lib/Connection')
const UUID = require('node-machine-id').machineIdSync()

class Client extends EventEmitter {
  constructor () {
    super()
    this._TCPclient = new Connection.TCP.Client()
    this._UDPclient = new Connection.UDP.Client()

    this.__isAuthenticated__ = null

    const self = this
    this._TCPclient.on('payload', function (...data) {
      self._onPayload(...data, this)
    })

    this._UDPclient.on('payload', function (...data) {
      self._onPayload(...data, this)
    })

    this.on(Packets.Poll, function (packet) {
      this.emit('poll', packet.data || {})
    })
  }

  isConnected () {
    return this.__isAuthenticated__
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
      const packet = parseRawData(payload)
      this._onPacket(packet)
    } catch (e) {
      // If the parse fails, just drop the payload
    }
  }

  _onPacket (packet) {
    // console.log('>RECV>', packet)

    if (packet.constructor === Packets.r_Hello) {
      const data = packet.data
      if (data) {
        if (data.status === true) {
          console.log('Authenticated with server!')
          this.__isAuthenticated__ = true

          this._UDPclient.write(
            Packets.Hello.create(UUID),
            this.__host,
            data.udp_port
          )

          if (this.__keepAliveLoop__) clearInterval(this.__keepAliveLoop__)

          // Register keepalive
          this.__keepAliveLoop__ = setInterval(() => {
            this._UDPclient.write(
              Packets.KeepAlive.create(),
              this.__host,
              data.udp_port
            )
          }, 3000)

          if (this.__onAuth) {
            this.__onAuth()
            this.__onAuth = null
          }
        } else if (data.status === false) {
          console.log(`Authentication fail - ${data.attempts} attempts left!`)
          this.emit('badAuth', data.attempts)
        } else if (data.status === null) {
          if (data.id) {
            this.emit('serverID', data.id)
          }
        }
      }
    } else {
      if (this.__isAuthenticated__) {
        this.emit(packet.constructor, packet)
      }
    }
  }

  connect (port, host, password, connectCallback) {
    this.__host = host
    this.__TCPport = port

    if (connectCallback) this.__onAuth = connectCallback
    this.__isAuthenticated__ = false
    this._TCPclient.connect(
      port,
      host,
      () => password ? this.login(password) : null
    )
  }

  login (password) {
    if (this.__isAuthenticated__) return
    this._TCPclient.write(Packets.Hello.create({ id: UUID, key: password }))
  }

  close () {
    this._TCPclient.destroy()
    this._UDPclient.close()
  }
}

module.exports = Client
