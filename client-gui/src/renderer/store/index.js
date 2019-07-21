import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState()
    // Removed `createSharedMutations()` - https://github.com/SimulatedGREG/electron-vue/issues/733
  ],
  strict: process.env.NODE_ENV !== 'production'
})
