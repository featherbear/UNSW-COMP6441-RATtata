const net = require("net");
const { EventEmitter } = require("events");
const { Packets, PacketParser } = require("./lib/Protocol");
const { ConnectionClient } = require("./lib/Connection");

class Client {
  constructor () {
    console.log('Client init')
    this._eventEmitter = new EventEmitter()
    this._client = new (ConnectionClient(net.Socket))()

    //     client.on('data', function (data) {

    //     })

    //     client.on('close', function () {
    //       console.log('Connection closed')
    //     })

    //     this._client = client
    //   }
  }

  connect (port, host) {
    this._client.connect(port, host, function () {
      this.write(Packets.Hello.create('Hellos123'))
      // this.destroy()
    })
  }
}

var client = new Client()
client.connect(1337, '127.0.0.1')
