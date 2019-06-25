class PacketUtils {
  constructor(parent, connection, writerFn) {
    this._parent = parent;
    this._connection = connection;

    this._buffer = Buffer.alloc(0);

    // TODO: Add buffer temps

    this._writerFn = writerFn;

    // this.readerFn = readerFn;
  }

  write(packet) {
    console.log("Write", packet);

    let payload = packet.toString();

    // Write the payload length header
    let payloadSize = Buffer.alloc(2);
    payloadSize.writeUInt16LE(payload.length);

    console.log(payloadSize);
    this._writerFn(payloadSize + payload);
  }

  read(data) {
    console.log("Read", data);

    // console.log(this.buffer);

    this._connection.emit("TEST", 123456789);

    this._parent.emit("TEST", 987654321);

    return;
    // data = Buffer.from(data);

    // readerEvt
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

        this._packetUtils_ = new PacketUtils(this, this, this.__write__);
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
  console.log("ConnectionServer factory");
  class ConnectionServer extends serverClass {
    constructor() {
      super(...arguments);
      console.log("SERVER INIT");

      this.on("connection", function(socket) {
        this._packetUtils_ = new PacketUtils(this, socket, this.write);
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
