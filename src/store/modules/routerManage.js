import router, { dynamicRouterMap, staticRouterMap } from '@/config/router'
import store from '@/store'
import { post } from '@/units/api'
import { setLoginStatus, resetLoginStatus } from '@/units/auth'

const routerManage = {
  state    : {
    id        : 0,
    name      : '',
    account   : '',
    avatar    : 'https://www.gravatar.com/avatar/6560ed55e62396e40b34aac1e5041028',
    role      : '',
    menus     : [],
    addRouters: [],
    routers   : []
  },
  mutations: {
    SET_USER: (state, userInfo) => {
      state.id                = userInfo.id
      state.name              = userInfo.name
      state.account           = userInfo.account
      state.role              = userInfo.role
      state.allPermissionList = userInfo.permission
    },
    RESTE_USER (state) {
      state.id                = 0
      state.name              = ''
      state.account           = ''
      state.role              = 0
      state.allPermissionList = []
    },
    SET_ROUTERS (state, routers) {
      state.addRouters = routers
      state.routers    = staticRouterMap.concat(routers)
    }
  },
  actions  : {
    Login ({ commit, state }, loginForm) {
      return new Promise(
        (resolve, reject) => {
          post('login', loginForm)
            .then(data => {
              setLoginStatus()
              resolve(data)
            })
            .catch(err => {
              reject(err)
            })
        })
    },
    GetInfo ({ commit }) {
      return new Promise(
        (resolve, reject) => {
          post('getPermission')
            .then(data => {
              commit('SET_USER', data.data)
              commit('SET_PERMISSION', data.data.allPermissionList)     // 存权限列表
              setLoginStatus()
              let userInfo = data.data
              
              store.dispatch('GenerateRoutes', userInfo).then(() => {
                router.addRoutes(store.getters.addRouters)
              })
              resolve(data)
            })
            .catch(error => {
              reject(error)
            })
        })
    },
    GenerateRoutes ({ commit }, userInfo) {
      return new Promise((resolve) => {
        const { role, allPermissionList } = userInfo
        let accessedRouters                             // 筛选出来有权限访问的路由
        if (role === '管理员') {
          accessedRouters = dynamicRouterMap                                        // 接入所有动态路由
        } else {
          accessedRouters = getDynamicRouter(dynamicRouterMap, allPermissionList)  // 根据角色筛选动态路由
        }
        commit('SET_ROUTERS', accessedRouters)                                      // 拼装为完整的路由
        resolve()
      })
    },
    FedLogOut ({ commit }) {
      return new Promise((resolve) => {
        commit('RESTE_USER')
        resetLoginStatus()
        resolve()
      })
    }
  }
}

const getDynamicRouter = (dynamicRouterMap, menuPermissionList) => {
  return dynamicRouterMap.filter(dynamicItem => {
    if (dynamicItem.children && dynamicItem.children.length) {      // 有子路由的话
      dynamicItem.children = getDynamicRouter(dynamicItem.children, menuPermissionList)
      return (dynamicItem.children && dynamicItem.children.length)
    } else {      // 没有子路由
      return menuPermissionList.find(menuPermissionItem => {
        return menuPermissionItem.id === dynamicItem.code
      })
    }
  })
}

export default routerManage
