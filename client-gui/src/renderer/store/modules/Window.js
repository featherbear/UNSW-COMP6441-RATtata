const state = {
  currentPage: 'about'
}

const mutations = {
  changePage (state, page) {
    state.currentPage = page
  }
}

const actions = {
  changePage ({ commit }, page) {
    commit('changePage', page)
  }
}

export default {
  state,
  mutations,
  actions
}
