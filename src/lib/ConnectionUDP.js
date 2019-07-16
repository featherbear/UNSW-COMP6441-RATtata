const dgram = require('dgram')
const PayloadUtils = require('./PayloadUtils')
let UDPsocket = dgram.Socket

class ConnectionUDPClient extends UDPsocket {
  constructor () {
    super('udp4', ...arguments)

    this._payloadUtils_ = new PayloadUtils(
      this,
      this,
      (data, host, port) => {
        this.send(data, 0, data.length, port, host)
      }
    )
  }

  write (data, host, port) {
    this._payloadUtils_.write(data, host, port)
  }
}

const { EventEmitter } = require('events')

class ConnectionUDPServer extends UDPsocket {
  constructor () {
    super('udp4', ...arguments)

    // for sending, not receiving
    this._payloadUtils_ = new PayloadUtils(
      this,
      this,
      (data, host, port) => {
        this.send(data, 0, data.length, port, host)
      }
    )

    this.clients = {}

    this.on('message', (msg, rinfo) => {
      let address = `${rinfo.address}:${rinfo.port}`

      if (!this.clients[address]) {
        this.clients[address] = new EventEmitter()

        this.clients[address]._rinfo = rinfo
        this.clients[address]._payloadUtils_ = new PayloadUtils(
          this.clients[address],
          this.clients[address],
          (data) => {
            this.send(data, 0, data.length, rinfo.port, rinfo.address)
          }
        )

        this.clients[address].on('payload', (...data) => {
          this.emit('data', {
            address: rinfo.address,
            port: rinfo.port
          }, ...data)
        })
      }

      this.clients[address]._payloadUtils_.read(msg)
    })
  }

  write (data, host, port) {
    this._payloadUtils_.write(data, host, port)
  }
}

module.exports = {
  Client: ConnectionUDPClient,
  Server: ConnectionUDPServer
}
