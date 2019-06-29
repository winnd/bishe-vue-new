const getters = {
  role       : state => state.routerManage.role,
  userId     : state => state.routerManage.userId,
  menus      : state => state.routerManage.menus,
  permissions: state => state.permission.allPermissionList,
  addRouters : state => state.routerManage.addRouters,
  relicTypes  : state => state.relicTypes.relicTypes
}

export default getters
