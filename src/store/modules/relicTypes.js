import { get } from '@/units/api'

const relicTypes = {
  state    : {
    relicTypes: []
  },
  mutations: {
    SET_RELIC_TYPES (state, relicTypes) {
      state.relicTypes = relicTypes
    }
  },
  actions  : {
    GetRelicType ({ commit }) {
      return new Promise((resolve) => {
        get('relicType/select/allRelicType')
          .then(data => {
            commit('SET_RELIC_TYPES', data.data)
            resolve()
          })
      })
    }
  }
}

export default relicTypes
