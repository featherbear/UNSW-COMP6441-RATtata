function osToIcon (osString) {
  switch (osString) {
    case 'mac':
      return 'apple'
    case 'windows':
      return 'windows'
    case 'linux':
      return 'linux'
    default:
      return 'monitor'
  }
}

module.exports = {
  osToIcon
}
