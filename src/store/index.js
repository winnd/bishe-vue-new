import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import routerManage from './modules/routerManage'
import relicTypes from './modules/relicTypes'
import permission from './modules/permission'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    routerManage,
    relicTypes,
    permission
  },
  getters
})

export default store
