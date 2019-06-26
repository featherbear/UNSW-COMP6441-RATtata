const int24 = require("int24");

class PayloadUtils {
  /*
  Handles receiving and transmitting packets from a buffer stream
  */
  constructor(parent, connection, writerFn) {
    this._parent = parent;
    this._connection = connection;

    this._buffer = Buffer.alloc(0);

    this._isProcessingPacket = false;
    this._payloadSize = 0;

    this._writerFn = writerFn;
  }

  write(packet) {
    let payload = Buffer.from(packet.toString());

    if (payload.length > 4294967296) {
      throw Error("Payload too large");
    }

    // Write the payload length header
    let payloadSize = Buffer.allocUnsafe(3);

    // Number of bytes required to store the payload size
    if (payload.length >= 16777216 /* Math.pow(2,3*8) */) {
      console.log("Crafting extended payload");

      payloadSize.fill(0);

      let extendedPayloadSize = Buffer.allocUnsafe(4);
      extendedPayloadSize.writeUInt32LE(payload.length);

      payloadSize = Buffer.concat([payloadSize, extendedPayloadSize]);
    } else {
      console.log("Crafting standard payload");
      int24.writeUInt24LE(payloadSize, 0, payload.length);
    }
    console.log(payloadSize);

    this._writerFn(Buffer.concat([payloadSize, payload]));
  }

  read(data) {
    this._buffer = Buffer.concat([this._buffer, data]);

    while (this._buffer.length > 0) {
      if (!this._isProcessingPacket) {
        if (this._buffer.length < 3) break;

        let payloadLength = int24.readUInt24LE(data, 0);
        let clearOffset = 3;

        if (payloadLength == 0) {
          if (this._buffer.length - 3 < 4) break;

          payloadLength = data.readUInt32LE(3);
          clearOffset += 4;

          if (payloadLength == 0) {
            this._buffer = this._buffer.slice(clearOffset);
            continue;
          }
        }

        this._buffer = this._buffer.slice(clearOffset);

        this._payloadSize = payloadLength;
        this._isProcessingPacket = true;
      }

      if (this._isProcessingPacket) {
        if (this._buffer.length >= this._payloadSize) {
          let payload = this._buffer.slice(0, this._payloadSize);
          this._buffer = this._buffer.slice(this._payloadSize);
          this._payloadSize = 0;
          this._isProcessingPacket = false;

          this._connection.emit("payload", payload);
          continue;
        }
      }

      break;
    }
  }
}

// **For payloads up to 65535 bytes**
// ```
// |   2 bytes   | n bytes |
// | length (LE) | payload |
// ```

// **For payloads greater than 65535 bytes**
// ```
// |   2 bytes   |         1 byte         |   m bytes   | n bytes |
// |  0x00 0x00  | length of length bytes | length (LE) | payload |
// ```

function ConnectionClient(clientClass) {
  class ConnectionClient extends clientClass {
    connect(port, host, callback) {
      function callbackWrapper() {
        this.__write__ = this.write.bind(this);

        this._packetUtils_ = new PayloadUtils(this, this, this.__write__);
        // this._packetUtils_.read;

        this.write = (...args) => this._packetUtils_.write(...args);
        // this.on("data", this._packetUtils_.read);

        callback && callback.bind(this)();
      }

      return super.connect(port, host, callbackWrapper);
    }
  }

  return ConnectionClient;
}

function ConnectionServer(serverClass) {
  class ConnectionServer extends serverClass {
    constructor() {
      super(...arguments);

      this.on("connection", function(socket) {
        this._packetUtils_ = new PayloadUtils(this, socket, this.write);
        this.write = (...args) => this._packetUtils_.write(...args);
        socket.on("data", this._packetUtils_.read.bind(this._packetUtils_));
      });
    }
  }

  return ConnectionServer;
}

module.exports = {
  ConnectionClient: ConnectionClient,
  ConnectionServer: ConnectionServer
};
