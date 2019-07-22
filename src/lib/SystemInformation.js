const si = require('systeminformation')

async function getMetaInformation () {
  const osInfo = await si.osInfo()
  const osData = {
    platform: osInfo.platform,
    distro: osInfo.distro,
    kernel: osInfo.kernel,
    hostname: osInfo.hostname,
    logofile: osInfo.logofile
  }
  //   logofile || platform

  const uptime = si.time().uptime

  return { ...osData, uptime }

  /*
   {
    const data = []

    // Seconds
    data.push(uptime % 60)

    // Minutes
    uptime /= 60
    data.push(parseInt(uptime) % 60)

    // Hours
    uptime /= 60
    data.push(parseInt(uptime) % 24)

    // Days
    uptime /= 24
    data.push(parseInt(uptime % (365.25 / 12)))

    // Months
    uptime /= 365.25 / 12
    data.push(parseInt(uptime) % 12)

    // Years
    uptime /= 12
    data.push(parseInt(uptime))

    console.log('Uptime:', data.reverse())

    // years, months, days, hours, seconds
  }
  */
  // Client-side can parse, as well as tick 1 second
}
async function getDynamicInformation () {
  // const users = await si.users()
  // console.log(users)

  const hasDisplay = (await si.graphics()).displays.length !== 0

  const networkInterfaces = await si.networkInterfaces()
  const lanIPs = networkInterfaces
    .map(d => d.ip4)
    .filter(d => d && d !== '127.0.0.1')
  //   console.log(networkInterfaces.map(d => d.ip6).filter(d => d && d !== '::1'))
  // console.log('LAN IPs:', lanIPs)

  const memory = await si.mem()
  const memoryPercentage = (memory.used / memory.total) * 100
  // console.log('Memory Usage:', memoryPercentage + '%')

  const memoryUnitMap = ['B', 'KB', 'MB', 'GB', 'TB']
  const memoryUnitIndex = parseInt(memory.total.toString().length / 3)
  const memoryUnitMultiplier = Math.pow(1024, memoryUnitIndex)
  // console.log(
  //   `${(memory.used / memoryUnitMultiplier).toFixed(1)} / ${(
  //     memory.total / memoryUnitMultiplier
  //   ).toFixed(1)} ${memoryUnitMap[memoryUnitIndex]}`
  // )

  const load = await si.currentLoad()
  // console.log('Current Load:', load.currentload.toFixed(0) + '%')

  return {
    hasDisplay,
    lanIPs,
    memoryPercentage: memoryPercentage.toFixed(0),
    memoryUsed: (memory.used / memoryUnitMultiplier).toFixed(1),
    memoryTotal: (memory.total / memoryUnitMultiplier).toFixed(1),
    memorySuffix:
      memoryUnitMap[Math.min(memoryUnitIndex, memoryUnitMap.length - 1)],
    cpu_load: load.currentload.toFixed(0)
  }
}

module.exports = {
  getMetaInformation,
  getDynamicInformation
}
