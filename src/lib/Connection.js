const ConnectionTCP = require('./ConnectionTCP')
const ConnectionUDP = require('./ConnectionUDP')

module.exports = {
  TCP: ConnectionTCP,
  UDP: ConnectionUDP
}
