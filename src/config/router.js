import Vue from 'vue'
import Router from 'vue-router'
import index from '../page/relics/index.vue'
import detail from '../page/relics/detail.vue'
import model from '../page/relics/model_view.vue'
import login from '../page/login.vue'
import register from '../page/register.vue'
import frame from '../page/edit/farme.vue'
import relicAdd from '../page/edit/relic/add_relic.vue'
import relicEdit from '../page/edit/relic/edit_relic.vue'
import relicBoard from '../page/edit/relic/relic_board.vue'
import view from '../page/edit/relic/model_view.vue'
import typeBoard from '../page/edit/relicType/relicType_board.vue'
import friendshipBoard from '../page/edit/friendshipLink/friendship_board.vue'
import userBoard from '../page/edit/user/user_board.vue'
import userAdd from '../page/edit/user/user_add.vue'
import modelPage from '../page/other/model_test.vue'
import page404 from '../page/404.vue'

// const _import = (file) => () => import('../page/' + file)
Vue.use(Router)

export const staticRouterMap = [
  { path: '/login', component: login, hidden: true },                 // 登录
  { path: '/404', component: page404, hidden: true },
  { path: '/detail', component: detail },
  { path: '/register', component: register },                       // 注册
  { path: '/', component: index, name: '首页', hidden: true }
]

export const dynamicRouterMap = [
  { path: '/model', component: model, meta: { title: 'model' } },
  { path: '/other/modelTest', component: modelPage },               // 模型测试   // todo 模型
  {
    path     : '/edit',
    component: frame,
    redirect : '/edit/relic/board',
    children : [
      { path: 'relic/board', component: relicBoard, code: 8 },
      { path: 'relic/add', component: relicAdd, code: 9 },
      { path: 'relic/edit', component: relicEdit, code: 10 },
      { path: 'relic/view', component: view },                                 // 后台 todo ???
      { path: 'relicTypes/board', name: '展品类型', component: typeBoard, code: 12 },
      { path: 'friendship/board', name: '友情链接', component: friendshipBoard, code: 16 },
      { path: 'user/board', name: '人员管理', component: userBoard, code: 20 },
      { path: 'user/add', name: '人员管理', component: userAdd }
    ]
  },
  { path: '*', redirect: '/' }
]

export default new Router({
  routes: staticRouterMap
})
