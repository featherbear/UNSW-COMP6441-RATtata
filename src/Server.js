let net = require("net");
const dgram = require("dgram");
const { EventEmitter } = require("events");
const { Packets, PacketParser } = require("./lib/Protocol");
const { ConnectionServer } = require("./lib/Connection");

class Server {
  constructor(password) {
    let self = this;

    this._UDPport = 41234;
    this._TCPport = 41233;

    this.password = password;
    this._eventEmitter = new EventEmitter();
    this.__authAttemptInterval__ = 1 * 1000;
    this.__maxAuthAttempts__ = 4;

    {
      let TCPserver = new (ConnectionServer(net.Server))();

      TCPserver.listen(this._TCPport, "127.0.0.1", function() {
        const address = this.address();
        console.log(`TCP server listening ${address.address}:${address.port}`);
      });

      TCPserver.on("connection", function(socket) {
        socket.__lastAuthenticationAttempt__ = 0;
        socket.__authenticationAttemptCount__ = 0;

        console.log("A new connection has been established.");

        socket.on("payload", (...data) => {
          self._onPayload(...data, socket);
        });

        socket.on("end", function() {
          console.log("Closing connection with the client");
        });

        // Don't forget to catch error, for your own sake.
        socket.on("error", function(err) {
          console.log(err);
        });
      });

      this._TCPserver = TCPserver;
      TCPserver.on("TEST", function() {
        console.log("SERVER EVT");
      });
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

  _onPayload(payload, socket) {
    function parseRawData(payload) {
      console.log(payload);
      let rawPacket;

      try {
        console.info(payload.toString());
        rawPacket = JSON.parse(payload.toString());
      } catch (e) {
        throw Error("Packet could not be parsed");
      }

      return PacketParser(rawPacket);
    }

    try {
      let packet = parseRawData(payload);
      this._onPacket(packet, socket);
    } catch (e) {
      // If the parse fails, just drop the payload
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
        socket.write(
          Packets.r_Hello.create({
            status: true,
            udp_port: this._UDPport
          })
        );
        socket.__userAuthenticated__ = true;
      } else {
        socket.write(
          Packets.r_Hello.create({
            status: false,
            attempts:
              this.__maxAuthAttempts__ - ++socket.__authenticationAttemptCount__
          })
        );
        socket.__lastAuthenticationAttempt__ = new Date();

        if (
          socket.__authenticationAttemptCount__ === this.__maxAuthAttempts__
        ) {
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
