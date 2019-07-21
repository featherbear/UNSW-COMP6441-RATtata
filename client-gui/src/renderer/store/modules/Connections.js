const state = {
  connections: {
    123456: {
      id: '123456',
      name: 'Paperweight',
      address: '127.0.0.1',
      os: 'mac',
      data: {}
    },
    234567: {
      id: '234567',
      name: 'Blue Screen',
      address: '127.0.0.1',
      os: 'windows',
      data: {}
      //   platform: 'win32',
      //   distro: 'winXTREME',
      //   kernel: 'note sure',
      //   hostname: 'localHOST',
      //   logofile: 'logx',

      //   hasDisplay: true,
      //   lanIPs: ['127.0.0.1', '192.168.123.1'],
      //   memoryPercentage: 1,
      //   memoryUsed: 1,
      //   memoryTotal: 100,
      //   memorySuffix: 'TB',
      //   cpu_load: 30
      // }
    },
    345678: {
      id: '345678',
      name: 'rm -rf /',
      address: '127.0.0.1',
      os: 'linux',
      data: {
        platform: String,
        distro: String,
        kernel: String,
        hostname: String,
        logofile: String,

        hasDisplay: Boolean,
        lanIPs: Array[String],
        memoryPercentage: Number,
        memoryUsed: Number,
        memoryTotal: Number,
        memorySuffix: String,
        cpu_load: Number
      }
    }
  }
}

const mutations = {

}

const actions = {

}

export default {
  state,
  mutations,
  actions
}
