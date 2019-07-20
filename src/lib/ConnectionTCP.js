const net = require('net')
const PayloadUtils = require('./PayloadUtils')

const TCPsocket = net.Socket
const TCPserver = net.Server

class ConnectionTCPClient extends TCPsocket {
  connect (port, host, callback) {
    function callbackWrapper () {
      this._payloadUtils_ = new PayloadUtils(this, this, this.write.bind(this))

      this.write = (...args) => this._payloadUtils_.write(...args)
      this.on('data', this._payloadUtils_.read.bind(this._payloadUtils_))

      callback && callback.bind(this)()
    }

    return super.connect(port, host, callbackWrapper)
  }
}

class ConnectionTCPServer extends TCPserver {
  constructor () {
    super(...arguments)

    this.on('connection', function (socket) {
      socket._payloadUtils_ = new PayloadUtils(
        this,
        socket,
        socket.write.bind(socket)
      )
      socket.write = (...args) => socket._payloadUtils_.write(...args)

      socket.on('data', socket._payloadUtils_.read.bind(socket._payloadUtils_))
    })
  }
}

module.exports = {
  Client: ConnectionTCPClient,
  Server: ConnectionTCPServer
}
