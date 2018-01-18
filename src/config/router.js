import Vue from 'vue'
import Router from 'vue-router'

// 主页
import index from '../page/exhibits/index.vue'
import detail from '../page/exhibits/detail.vue'
import model from '../page/exhibits/model_view.vue'                 // 游客看
import login from '../page/login.vue'
import register from '../page/register.vue'

// 编辑 增删改查
import frame from '../page/edit/farme.vue'
import homepage from '../page/edit/homepage.vue'

// 藏品
import exhibitAdd from '../page/edit/exhibit/add_exhibit.vue'
import exhibitEdit from '../page/edit/exhibit/edit_exhibit.vue'
import exhibitBoard from '../page/edit/exhibit/show_board.vue'
import view from '../page/edit/exhibit/model_view.vue'              // 后台看

// 藏品种类
import typeBoard from '../page/edit/exhibitType/show_board.vue'

// 友情链接
import friendshipBoard from '../page/edit/friendshipLink/friendship_board.vue'

// 人员管理
import manageBoard from '../page/edit/manage/manage_board.vue'
import manageAdd from '../page/edit/manage/manage_add.vue'

// 模型测试
import modelPage from '../page/other/model_test.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: index},
    {path: '/detail', component: detail},
    {path: '/login', component: login},
    {path: '/register', component: register},
    {path: '/model', component: model},
    {path: '/other/modelTest', component: modelPage},
    {
      path: '/edit',
      component: frame,
      children: [
        {path: 'homepage', component: homepage},
        {path: 'exhibit/add', component: exhibitAdd},
        {path: 'exhibit/edit', component: exhibitEdit},
        {path: 'exhibit/board', component: exhibitBoard},
        {path: 'exhibit/view', component: view},
        {path: 'type/board', component: typeBoard},
        {path: 'friendship/board', component: friendshipBoard},
        {path: 'manage/board', component: manageBoard},
        {path: 'manage/add', component: manageAdd}
      ]
    },
    {path: '*', redirect: '/'}
  ]
})
