import Vue from 'vue'
import axios from 'axios'

import '@mdi/font/css/materialdesignicons.css'

// import 'bulma/css/bulma.css'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import 'simplebar'
import 'simplebar/dist/simplebar.css'

import App from './App'

Vue.use(Buefy)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
