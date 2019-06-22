const _ConnectionCommons = {
  write: function (write, packet) {
    let payload = packet.toString()

    // Write the payload length header
    let payloadSize = Buffer.alloc(2)
    payloadSize.writeUIntLE(payload.length)

    console.log(payloadSize)
    write(payloadSize + payload)
  }
}

function ConnectionClient (clientClass) {
  class ConnectionClient extends clientClass {
    connect (port, host, callback) {
      function callbackWrapper () {
        this.__write__ = this.write.bind(this)
        this.write = (...args) => _ConnectionCommons.write(this.__write__, ...args)

        if (callback) {
          callback.bind(this)()
        }
      }

      return super.connect(port, host, callbackWrapper)
    }
  }

  return ConnectionClient
}

class ConnectionServer {
  constructor (serverClass, ...args) {
    class Server extends serverClass {

    }

    return new Server(...args)
  }
}

module.exports = {
  ConnectionClient: ConnectionClient,
  ConnectionServer: ConnectionServer
}
