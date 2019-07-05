const net = require("net");
const dgram = require("dgram");
const { EventEmitter } = require("events");
const { Packets, PacketParser } = require("./lib/Protocol");
const { ConnectionClient } = require("./lib/Connection");

class Client {
  constructor() {
    console.log("Client init");
    this._eventEmitter = new EventEmitter();
    this._TCPclient = new (ConnectionClient(net.Socket))();
    this._UDPclient = new (ConnectionClient(dgram.Socket))("udp4");

    this.__isAuthenticated__ = null;

    let self = this;
    this._TCPclient.on("payload", function(...data) {
      self._onPayload(...data, this);
    });
  }

  _onPayload(payload) {
    function parseRawData(payload) {
      let rawPacket;

      try {
        rawPacket = JSON.parse(payload.toString());
      } catch (e) {
        throw Error("Packet could not be parsed");
      }

      return PacketParser(rawPacket);
    }

    try {
      let packet = parseRawData(payload);
      this._onPacket(packet);
    } catch (e) {
      // If the parse fails, just drop the payload
    }
  }

  _onPacket(packet) {
    console.log(">RECV>", packet);

    let a = Buffer.from("YEEEEEET");

    if (packet.constructor === Packets.r_Hello) {
      let data = packet.data;
      if (data) {
        if (data.status === true) {
          console.log("Authenticated with server!");
          this.__isAuthenticated__ = true;

          {
            var client = dgram.createSocket("udp4");
            if (this.__keepAliveLoop__) clearInterval(this.__keepAliveLoop__);

            this.__keepAliveLoop__ = setInterval(() => {
              this._TCPclient.write(Packets.KeepAlive.create());
            }, 3000);
          }
        } else {
          console.log(`Authentication fail - ${data.attempts} attempts left!`);
        }
      }
    } else {
      if (this.__isAuthenticated__) {
        this._eventEmitter.emit(packet.constructor, packet);
      }
    }
  }

  connect(port, host, password) {
    this.__isAuthenticated__ = false;
    this._TCPclient.connect(port, host, () => this.login(password));
  }

  login(password) {
    if (this.__isAuthenticated__) return;
    this._TCPclient.write(Packets.Hello.create(password));
  }

  on(evt, func) {
    this._eventEmitter.on(evt, func.bind(this));
  }
}

var client = new Client();
client.connect(41233, "127.0.0.1", "Hello123");
