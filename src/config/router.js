import Vue from 'vue'
import Router from 'vue-router'
import index from '../page/exhibits/index.vue'
import detail from '../page/exhibits/detail.vue'
import model from '../page/exhibits/model_view.vue'
import login from '../page/login.vue'
import register from '../page/register.vue'
import frame from '../page/edit/farme.vue'
import homepage from '../page/edit/homepage.vue'
import exhibitAdd from '../page/edit/exhibit/add_exhibit.vue'
import exhibitEdit from '../page/edit/exhibit/edit_exhibit.vue'
import exhibitBoard from '../page/edit/exhibit/show_board.vue'
import view from '../page/edit/exhibit/model_view.vue'
import typeBoard from '../page/edit/exhibitType/show_board.vue'
import friendshipBoard from '../page/edit/friendshipLink/friendship_board.vue'
import manageBoard from '../page/edit/manage/manage_board.vue'
import manageAdd from '../page/edit/manage/manage_add.vue'
import modelPage from '../page/other/model_test.vue'
import page404 from '../page/404.vue'

const _import = (file) => () => import('../page/' + file)

Vue.use(Router)

export const constantRouterMap = [
  {path: '/login', component: login, hidden: true},                 // 登录
//  {path: '/404', component: page404, hidden: true},
//  {path: '/detail', component: detail},
//  {path: '/register', component: register},                       // 注册
  {
    path     : '/',
    component: index,
    name     : '首页',
    hidden   : true
  }
]

export const asyncRouterMap = [
  {path: '/model', component: model},
  {path: '/other/modelTest', component: modelPage},               // 模型测试
  {
    path     : '/edit',                                   // 后台 - 编辑页面
    component: frame,
    children : [
      {path: 'homepage', component: homepage},
      {path: 'exhibit/add', component: exhibitAdd},              // 藏品
      {path: 'exhibit/edit', component: exhibitEdit},
      {path: 'exhibit/board', component: exhibitBoard},
      {path: 'exhibit/view', component: view},                   // 后台
      {path: 'type/board', component: typeBoard},                // 藏品种类
      {path: 'friendship/board', component: friendshipBoard},    // 友情链接
      {path: 'manage/board', component: manageBoard},            // 人员管理
      {path: 'manage/add', component: manageAdd}
    ]
  },
  {path: '*', redirect: '/'}
]

export default new Router({
  routes: constantRouterMap
})
