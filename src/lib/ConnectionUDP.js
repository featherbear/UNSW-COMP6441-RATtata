const dgram = require('dgram')
const PayloadUtils = require('./PayloadUtils')
let UDPsocket = dgram.Socket

class ConnectionUDPClient extends UDPsocket {
  constructor () {
    super('udp4', ...arguments)
  }

  write (data, host, port) {
    if (!this._payloadUtils_) {
      this._payloadUtils_ = new PayloadUtils(
        this,
        this,
        (data, host, port) => {
          this.send(data, 0, data.length, port, host)
        }
      )
    }

    this.write = (...args) => this._payloadUtils_.write(...args)
    this.write(data, host, port)
  }
}

class ConnectionUDPServer extends UDPsocket {
  constructor () {
    super('udp4', ...arguments)

    this.on('message', function (...args) { this.emit('data', ...arguments) })

    this.on('data', (msg, rinfo) => {
      console.log(rinfo)
      // socket._payloadUtils_.read.bind(socket._payloadUtils_)

      console.log(`server got: ${msg.length} bytes from ${rinfo.address}:${rinfo.port}`)
    })
  }
}

module.exports = {
  Client: ConnectionUDPClient,
  Server: ConnectionUDPServer
}
