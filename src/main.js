// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './config/router'
import {default as api} from '@/units/api'
import '@/config/router_permission'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'

// 自定义功能组件
// import api from './config/api'
import tool from './units/tool'
import _ from 'lodash'
import Carousel from 'element-ui/packages/carousel'
import CarouselItem from 'element-ui/packages/carousel-item'

// 绑定
Vue.prototype.api = api
Vue.prototype.$tool = tool
// Object.defineProperty(Vue.prototype, '_', {value: _})
Vue.prototype._ = _
// Vue.prototype.$HOST = 'http://115.29.140.80:8080/'
Vue.prototype.$HOST = 'localhost:8080/'
Vue.prototype.$rootPath = './#/'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Carousel)
Vue.use(CarouselItem)

router.beforeEach((to, from, next) => {
  if (to.query.token && to.query.JobType) {
    localStorage.setItem('Token', to.query.token)
    next(to.path)
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {App}
})
