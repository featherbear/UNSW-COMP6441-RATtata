// Universal transport layer protocol built on stream buffers


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
      payloadSize.fill(0);

      let extendedPayloadSize = Buffer.allocUnsafe(4);
      extendedPayloadSize.writeUInt32LE(payload.length);

      payloadSize = Buffer.concat([payloadSize, extendedPayloadSize]);
    } else {
      int24.writeUInt24LE(payloadSize, 0, payload.length);
    }

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

function ConnectionClient(clientClass) {
  class ConnectionClient extends clientClass {
    connect(port, host, callback) {
      function callbackWrapper() {
        this._payloadUtils_ = new PayloadUtils(
          this,
          this,
          this.write.bind(this)
        );

        this.write = (...args) => this._payloadUtils_.write(...args);
        this.on("data", this._payloadUtils_.read.bind(this._payloadUtils_));

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
        socket._payloadUtils_ = new PayloadUtils(
          this,
          socket,
          socket.write.bind(socket)
        );
        socket.write = (...args) => {
          socket._payloadUtils_.write(...args);
        };
        socket.on(
          "data",
          socket._payloadUtils_.read.bind(socket._payloadUtils_)
        );
      });
    }
  }

  return ConnectionServer;
}

module.exports = {
  ConnectionClient: ConnectionClient,
  ConnectionServer: ConnectionServer
};
