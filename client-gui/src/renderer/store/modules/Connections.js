const state = {
  servers: {
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
  },
  connectionList: [123456, 234567, 345678]
}

const mutations = {
  addServer (state, { serverID }) {
    if (state.connectionList.indexOf(serverID) === -1) {
      state.connectionList = [...state.connectionList, serverID]
    }
  },

  removeServer (state, { serverID }) {
    state.connectionList = state.connectionList.filter(e => e !== serverID)
  },

  updateName (state, { serverID, name }) {
    if (state.servers[serverID]) state.servers[serverID].name = name
  },

  updateData (state, { serverID, ...data }) {
    console.log('DATA UPDATE')
    if (state.servers[serverID]) {
      console.log('APPLY')
      state.servers[serverID].data = {
        ...state.servers[serverID].data,
        ...data
      }

      // Object.assign(
      //   state.servers[serverID].data,
      //   data
      // )

      console.log(state.servers[serverID].data)
    }
  },

  initServer (state, { serverID, address }) {
    if (!state.servers[serverID]) {
      state.servers[serverID] = {
        id: serverID,
        name: '...',
        data: {}
      }
    }

    state.servers[serverID].address = address
  }
}

const actions = {
  addServer ({ commit }, dataObject) {
    commit('initServer', dataObject)
    commit('addServer', dataObject)
  },

  updateName ({ commit }, dataObject) {
    commit('updateName', dataObject)
  },

  updateData ({ commit }, dataObject) {
    commit('updateData', dataObject)
  },

  removeServer ({ commit }, dataObject) {
    commit('removeServer', dataObject)
  }
}

export default {
  state,
  mutations,
  actions
}
