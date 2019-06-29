// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './config/router'
import '@/config/router_beforeEach'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import { hasPermission } from '@/units/hasPermission'

import _ from 'lodash'
import ElementUI from 'element-ui'
import Carousel from 'element-ui/packages/carousel'
import CarouselItem from 'element-ui/packages/carousel-item'
import api, { get, post } from '@/units/api'        // 不知道为啥没用

// 绑定
Vue.prototype._         = _
// Vue.prototype.$HOST = 'http://115.29.140.80:8080/'
Vue.prototype.$HOST     = 'http://localhost:8082/'
Vue.prototype.$rootPath = './#/'
Vue.prototype.hasPerm   = hasPermission
Vue.prototype.post      = post
Vue.prototype.get       = get
Vue.prototype.api       = api

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Carousel)
Vue.use(CarouselItem)

// router.beforeEach((to, from, next) => {
//  if (to.query.token && to.query.JobType) {
//    localStorage.setItem('Token', to.query.token)
//    next(to.path)
//  } else {
//    next()
//  }
// })

// todo fork element的源码

/* eslint-disable no-new */
new Vue({
  el        : '#app',
  store,
  router,
  template  : '<App/>',
  components: { App }
})
