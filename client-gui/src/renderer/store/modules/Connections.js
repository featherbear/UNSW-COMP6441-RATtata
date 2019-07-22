const state = {
  servers: {
    'demo-123456': {
      id: 'demo-123456',
      name: 'Paperweight',
      address: '127.0.0.1',
      os: 'mac',
      data: {
        platform: 'darwin',
        hostname: 'Paperweight',
        logofile: 'mac',
        uptime: 11200,
        hasDisplay: false,
        lanIPs: ['10.185.193.58'],
        memoryPercentage: '66',
        memoryUsed: '41.1',
        memoryTotal: '62.7',
        memorySuffix: 'GB',
        cpu_load: '3'
      }
    },
    'demo-234567': {
      id: 'demo-234567',
      name: 'Blue Screen',
      address: '127.0.0.1',
      os: 'windows',
      data: {
        platform: 'win32',
        distro: 'Microsoft Windows 10 Pro',
        kernel: '10.0.17134',
        hostname: 'BlueScreen',
        logofile: 'windows',
        uptime: 29146,
        hasDisplay: true,
        lanIPs: ['192.168.2.3', '192.168.128.51'],
        memoryPercentage: '29',
        memoryUsed: '1.1',
        memoryTotal: '3.8',
        memorySuffix: 'GB',
        cpu_load: '14'
      }
    },
    'demo-345678': {
      id: 'demo-345678',
      name: 'rm -rf /',
      address: '127.0.0.1',
      os: 'linux',
      data: {
        platform: 'linux',
        hostname: 'linuxbox',
        logofile: 'linux',
        uptime: 7384601,
        hasDisplay: true,
        lanIPs: ['10.248.123.122'],
        memoryPercentage: '20',
        memoryUsed: '4',
        memoryTotal: '19.8',
        memorySuffix: 'GB',
        cpu_load: '14'
      }
    }
  },
  connectionList: ['demo-123456', 'demo-234567', 'demo-345678']
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
    if (state.servers[serverID]) {
      state.servers[serverID].data = {
        ...state.servers[serverID].data,
        ...data
      }
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
  },

  tickUptime (state, { serverID }) {
    state.servers[serverID].data.uptime++
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
  },

  tickUptime ({ commit }, dataObject) {
    commit('tickUptime', dataObject)
  }
}

export default {
  state,
  mutations,
  actions
}
