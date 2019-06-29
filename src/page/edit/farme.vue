<template>
  <div class="index-wrapper">

    <el-container>
      <div class="r-logo">
        <div class="option-box">
          <div class="option-box-bg"></div>
          <div class="mask"></div>
          <h1>博物馆后台管理系统</h1>
          <div class="login-box">
            <span class="hover-box">
              <template v-if="isLogin">
                <!--admin 登录后台/注销 下拉菜单-->
                <el-dropdown :show-timeout=50>
                  <a class="login">{{username}}</a>
                  <el-dropdown-menu slot="dropdown" style="width: 100px;">
                    <el-dropdown-item><a @click="logout">注销</a></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <!--请登录-->
              <template v-else><a class="login" :href="$rootPath+'login'">登录</a></template>
            </span>
          </div>
        </div>
      </div>

      <el-header class="r-header" height="40px">
        <div class="header-left" :class="isCollapse?'narrow':'wide'">
          <el-radio-group v-model="isCollapse">
            <el-button type="primary" :icon="isCollapse?'el-icon-caret-right':'el-icon-caret-left'"
                       style="background: transparent;color:#409EFF" class="r-btn"
                       @click="isCollapse = !isCollapse"></el-button>
          </el-radio-group>
        </div>
        <div class="header-right">
          <!--面包屑-->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item :to=secondNav.path>{{secondNav.name}}</el-breadcrumb-item><!-- :to="{ path: '/edit/relic/board' }"-->
          </el-breadcrumb>
        </div>
      </el-header>

      <el-container>

        <el-aside width="auto">
          <!--左侧菜单-->
          <el-row class="tac">
            <el-col>
              <el-menu class="el-menu-vertical-demo" default-active="1" :router=true :collapse="isCollapse">

                <template v-for="(item,index) in sideNav">
                  <el-menu-item :index=(index+1).toString() :route=item.path style="padding-left:5px">
                    <i :class=item.icon></i>
                    <span slot="title">{{item.name}}</span>
                  </el-menu-item>
                </template>

              </el-menu>
            </el-col>
          </el-row>
        </el-aside>

        <el-main class="r-main">
          <router-view v-if="isRouterAlive"></router-view>
        </el-main>

      </el-container>
    </el-container>

  </div>
</template>

<script>
  import { hadLogin, resetLoginStatus } from '@/units/auth'

  export default {
    created () {
      this.isLogin = hadLogin()                 // 是否登录
      if (!this.isLogin) {
        alert('后台管理页面,需要登录')
        this.$router.push({ 'path': '/login' })
      }
    },
    data () {
      return {
        isRouterAlive: true,      // 用来刷新页面的
        sideNav      : [
          { name: '藏品管理', path: '/edit/relic/board', icon: 'el-icon-star-off' },
          { name: '类别管理', path: '/edit/relicTypes/board', icon: 'el-icon-edit' },
          { name: '人员管理', path: '/edit/user/board', icon: 'el-icon-setting' },
          { name: '友情链接', path: '/edit/friendship/board', icon: 'el-icon-tickets' }
        ],
        isCollapse   : false,
        secondNav    : { name: '藏品管理', path: '/edit/relic/board', icon: 'el-icon-star-off' },
        username     : localStorage.getItem('username'),
        isLogin      : false
      }
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      },
      // 注销
      logout () {
        console.log('登出')
        this.$api.api_req('museum-api/routerManage/logout', 'GET',
          {},
          this.logoutSuc, this.failure
        )
      },
      logoutSuc () {
        resetLoginStatus()
        this.isLogin = false
        this.$message.success('登出成功')
        this.$router.push({ path: '/login' })
      },
      refresh () {    // 刷新页面, 定义是在frame中, 在子页面中进行调用, 利用 v-if 进行重新加载
        this.isRouterAlive = false
        this.$nextTick(() => {this.isRouterAlive = true})
      }
    },
    watch  : {
      $route (newValue) {
        this.sideNav.map(x => {
          if (newValue.path === x.path) {
            this.secondNav = x
          }
        })
      }
    },
    provide () {
      return {
        refresh: this.refresh
      }
    }
  }
</script>

<style lang="stylus">
  .index-wrapper
    height: 100%
    min-height: 600px
    width: 100%
    min-width 1060px

    .r-logo
      background: url("~static/img/header_bg.jpg")
      background-size: 100%
      background-position: 0px -22px
      padding: 0
      position: relative
      text-align: right
      flex: 0 100px
      width: 100%
      overflow: hidden

      h1
        position: relative
        padding-left: 5px;
        color: #fff
        font-size: 20px
        font-weight: bolder
        float: left

      .option-box
        width 100%
        position: relative
        overflow: hidden
        font-size: 14px
        line-height: 42px

      .option-box-bg
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        /*background-image url("/static/img/header_bg.jpg")*/
        filter: blur(3px);
        background-size 100%
        transform: scale(1.01);

      .mask
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        /*background #fff*/
        opacity: 0.1

      a
        display inline-block
        cursor pointer
        color #fff
        padding: 0 12px
        transition: all .3s;

        &:hover
          background-color: hsla(0, 0%, 100%, .3);

      .login-box
        position: relative
        float right
        margin-right: 20px
        color #fff

        .hover-box
          display: inline-block

    .el-container
      height: 100%

      .r-header
        display flex
        color: #333;
        background #eee
        padding: 0

        .header-left
          display: flex
          justify-content: center
          align-items center
          background: #eee
          -webkit-transition: all .3s ease-in-out
          transition: all .3s ease-in-out
          border-right: 1px solid #e6e6e6

          &.wide
            flex: 0 180px

          &.narrow
            flex: 0 64px

          > .el-radio-group
            width: 100%

            .r-btn
              width: 100%
              border 0
              color: #409EFF
              border-radius: 0
              height: 100%

        .header-right
          flex: 1
          padding-left: 15px
          display: flex
          align-items: center

      .r-header.logo
        background gray

      .el-aside
        background-color: #eee;
        color: #333;
        text-align: center;
        line-height: 200px;

      .r-main
        padding: 15px
        height: 100%
        background: #fafafa

  // 显示隐藏
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px;
  }

  // 下拉菜单
  .el-dropdown-menu
    .el-dropdown-menu__item
      padding 0

      a
        display inline-block
        padding: 0 20px
        width 100%

</style>
