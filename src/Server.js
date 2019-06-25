let net = require("net");
const dgram = require("dgram");
const EventEmitter = require("./lib/EventEmitter");
const { Packets, PacketParser } = require("./lib/Protocol");
const { ConnectionServer } = require("./lib/Connection");

class Server {
  constructor(password) {
    let self = this;

    this.password = password;
    this._eventEmitter = new EventEmitter();

    {
      let TCPserver = new (ConnectionServer(net.Server))();

      TCPserver.listen(1337, "127.0.0.1", function() {
        const address = this.address();
        console.log(`TCP server listening ${address.address}:${address.port}`);
      });

      TCPserver.on("connection", function(socket) {
        this.__authAttemptInterval__ = 3 * 1000;
        this.__lastAuthenticationAttempt__ = 0;
        this.__authenticationAttemptCount__ = 0;

        console.log("A new connection has been established.");

        // socket.on('data', (...data) => {
        //   console.log("Got data");
        //   // self._onRaw(...data, socket)
        // })

        socket.on("end", function() {
          console.log("Closing connection with the client");
        });

        socket.on("TEST", function() {
          console.log("SOCKET EVT");
        });

        // Don't forget to catch error, for your own sake.
        socket.on("error", function(err) {
          console.log(err);
        });
      });

      this._TCPserver = TCPserver;
      TCPserver.on("TEST", function() {
        console.log("SERVER EVT")
      })
    }
    // {
    //   let UDPserver = dgram.createSocket('udp4')

    //   UDPserver.on('error', err => {
    //     console.log(`server error:\n${err.stack}`)
    //     UDPserver.close()
    //   })

    //   UDPserver.on('message', (msg, rinfo) => {
    //     console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
    //   })

    //   UDPserver.on('listening', function () {
    //     const address = this.address()
    //     console.log(`UDP server listening ${address.address}:${address.port}`)
    //   })

    //   UDPserver.bind(41234, '0.0.0.0')
    //   this._UDPserver = UDPserver
    // }
  }

  _onRaw(rawData, socket) {
    function parseRawData(rawData) {
      console.log(rawData);
      let rawPacket;

      try {
        console.info(rawData.toString());
        rawPacket = JSON.parse(rawData.toString());
      } catch (e) {
        throw Error("Data could not be parsed");
      }

      return PacketParser(rawPacket);
    }

    try {
      let packet = parseRawData(rawData);
      this._onPacket(packet, socket);
    } catch (e) {
      console.log("Error", e);
    }
  }

  _onPacket(packet, socket) {
    if (packet.constructor === Packets.Hello) {
      if (socket.__userAuthenticated__ === true) {
        console.warn("Connection already authenticated...");
      }

      if (
        new Date() - socket.__lastAuthenticationAttempt__ <
        this.__authAttemptInterval__
      ) {
        return;
      }

      if (packet.data === this.password) {
        console.log("AUTH SUCCESS");
        socket.__userAuthenticated__ = true;
      } else {
        console.log("BAD AUTH");
        socket.__lastAuthenticationAttempt__ = new Date();

        if (++socket.__authenticationAttemptCount__ === 3) {
          console.log("BAD AUTH - LIMIT REACHED: KICK");
          socket.destroy();
        }
        return;
      }
    }

    if (socket.__userAuthenticated__ !== true) {
      console.log("NOT AUTHENTICATED");
    }

    this._eventEmitter.emit(packet.constructor, packet, socket);
  }

  on(evt, func) {
    this._eventEmitter.on(evt, func.bind(this));
  }
}

//

let server = new Server("Hello123");
server.on(Packets.Hello, function(packet, socket) {
  console.log(packet);
  // socket.destroy()
});
