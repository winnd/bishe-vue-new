import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '../store'
import { hadLogin } from '../units/auth'
import router from './router.js'

const whiteList = ['/login', '/404', '/']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (hadLogin()) {       // 如果已经登录
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else if (!store.getters.role) {         // 没有获取角色权限
      store.dispatch('GetInfo')
           .then(() => {
             store.dispatch('GetRelicType')
                  .then(() => {next({ ...to })})
                  .catch(e => console.error('router_beforeEach', e))
           })
    } else {
      next()
    }
  } else if (whiteList.indexOf(to.path) !== -1) {     // 白名单
    next()
  } else {
    next('/login')
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done()
})
