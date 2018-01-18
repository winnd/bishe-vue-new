// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './config/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 自定义功能组件
import api from './config/api'
import tool from './unit/tool'
import _ from 'lodash'

// 轮播组件
import Carousel from 'element-ui/packages/carousel'
import CarouselItem from 'element-ui/packages/carousel-item'
// 标签组件
// import Tabs from 'element-ui/packages/tabs'
// import TabPane from 'element-ui/packages/tab-pane'

// 绑定
Vue.prototype.$api = api
Vue.prototype.$tool = tool
// Object.defineProperty(Vue.prototype, '_', {value: _})
Vue.prototype._ = _
Vue.prototype.$HOST = 'http://115.29.140.80:8080/'
Vue.prototype.$rootPath = './#/'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Carousel)
Vue.use(CarouselItem)
// Vue.use(Tabs)
// Vue.use(TabPane)

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
  router,
  template: '<App/>',
  components: {App}
})
