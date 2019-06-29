const permissionStore = {
  state    : {
    allPermissionList: []
  },
  mutations: {
    SET_PERMISSION (state, permissionList) {
      state.allPermissionList = permissionList
    }
  }
}

export default permissionStore
