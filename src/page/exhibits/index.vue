<template>
  <div class="wrapper">
    <div class="index-wrapper2">
      <div class="header">
        <div class="option-box">
          <div class="option-box-bg"></div>
          <div class="mask"></div>
          <div class="login-box">
            <span class="hover-box">
              <template v-if="isLogin">
                <!--admin 登录后台/注销 下拉菜单-->
                <el-dropdown :show-timeout=50>
                  <a class="login">{{username}}</a>
                  <el-dropdown-menu slot="dropdown" style="width: 100px;">
                    <el-dropdown-item><a :href="$rootPath+'edit/exhibit/board'">进入后台</a></el-dropdown-item>
                    <el-dropdown-item><a @click="logout">注销</a></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <!--请登录-->
              <template v-else><a class="login" :href="$rootPath+'login'">登录</a></template>
            </span>
            <span>|</span>
            <a class="collect" @click="addCollect">收藏</a>
          </div>
        </div>
        <span class="title flex ai">
          <h3>首页 · </h3><h2> 精品展示</h2>
        </span>
      </div>

      <el-tabs tab-position="right" @input="handleClick" style="min-height: 460px">
        <el-tab-pane v-for="(item,index) in relicTypeList" key="index">
          <!--标签-->
          <span slot="label" class="regress">
              <i class="i1"></i>{{item.relicType}}<i class="i2"></i>
          </span>
          <!--内容-->
          <div class="show-board-wrapper">
            <div class="side-title">{{getTypeName}}</div>
            <el-carousel :autoplay=false class="r-side" @change="choicePage">
              <div class="relicType-bg" :style="'background-image: url(' + currentTypeImg + ');background-position:right;'"></div>
              <el-carousel-item v-for="item in pages" :key="item">
                <h3>
                  <ul class="item-box">
                    <li v-for="(item,index) in relicList" class="show-item" @click="jumpToPage('/detail?type='+currentType+'&index='+(index+(currentPage-1)*10))">
                      <img :src=$HOST+item.picUrl>
                      <h4 class="name">{{item.name}}</h4>
                    </li>
                    <template v-if="relicList.length < 10" v-for="i in 10-relicList.length">
                      <li style="visibility: hidden"></li>
                    </template>
                  </ul>
                </h3>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>

    <!--友情链接-->
    <div class="footer-wrapper">
      <div class="left">
        <h3>友情链接</h3>
        <ul class="link-box">
          <li v-for="(item,index) in linkList">
            <a :href=item.url target="_blank">
              <img :src=item.image>
              <span>{{item.name}}</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="right">
        <h3>关于本站</h3>
        <p>本站以博物馆藏品为主题，致力于将悠久文化遗产呈现给大家，供大家观赏。
          欢迎大家一起交流，学习。同时网站若有不足或尚需改进之处，恳请提出您的宝贵意见。
          相信您的参与将会使我们的网站更完善。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  const PAGE_SIZE = 10
  const initImg = '~static/img/sidebar-bg1.jpg'

  export default {
    created(){
      // 查询藏品分类
      this.$api.api_req('museum-api/relic-type/resources', 'GET', {}, (_data) => { this.relicTypeList = _data.data.reverse() }, this.failure)
      // 查询藏品
      this.$api.api_req('museum-api/relic/resources', 'POST', {pageNum: this.currentPage, pageSize: PAGE_SIZE, relicType: this.currentType}, this.initData, this.failure)
      // 查询友链
      this.$api.api_req('museum-api/friendship-link/resources', 'POST', {pageSize: 100, pageNum: 1}, (_data) => { this.linkList = _data.data }, this.failure)
    },
    data(){
      return {
        relicTypeList: [],        // 藏品种类
        relicList: [],           // 当前展示数据
        linkList: [],            // 友链
        currentType: 1,          // 当前种类
        currentPage: 0,          // 当前页数
        pages: 0,                // 总页数
        currentTypeImg: initImg,
        isLogin: localStorage.getItem('isLogin') === '1',           // 是否是登录状态
        username: localStorage.getItem('username')
      }
    },
    methods: {
      // 初始获取
      initData(_data){
        this.relicList = []
        this.relicList = _data.data
        this.pages = _data.page.pages === 0 ? 1 : _data.page.pages
      },
      // 选择展品第几页
      choicePage(val, oldVal){
        this.currentPage = val + 1
        this.selectRelic()
      },
      // 点击标签
      handleClick(val){
        if (this.relicTypeList.length !== 0) {
          this.currentType = this.relicTypeList[val].id
          this.currentTypeImg = this.$HOST + this.relicTypeList[val].img
          this.selectRelic()
        }
      },
      // 刷新页面数据
      selectRelic(){
        this.$api.api_req('museum-api/relic/resources', 'POST', {pageNum: this.currentPage, pageSize: PAGE_SIZE, relicType: this.currentType}, this.initData, this.failure)
      },
      jumpToPage(url){
        this.$router.push({path: url})
      },
      // 注销
      logout(){
        this.$api.api_req('museum-api/user/logout', 'GET',
          {},
          this.logoutSuc, this.failure
        )
      },
      logoutSuc(){
        localStorage.removeItem('isLogin')
        this.isLogin = false
        this.$message.success('登出成功')
      },
      // 添加收藏
      addCollect(){
        try {
          window.external.addFavorite(window.location.href, '基于web的博物馆藏品管理展示系统')
        } catch (e) {
          try {
            window.sidebar.addPanel('基于web的博物馆藏品管理展示系统', window.location.href, '')
          } catch (e) {
            alert('加入收藏失败，请使用Ctrl+D进行添加')
          }
        }
      },
      failure(_err){
        console.log('添加藏品提交失败原因')
        console.log(_err)
      }
    },
    computed: {
      getTypeName(){
        if (this.relicTypeList.length !== 0) {
          var a = {a: 1, b: 2}
          _.has(a, 'a')
          return _.find(this.relicTypeList, ['id', this.currentType]).relicType
        }
      }
    }
  }
</script>

<style lang="stylus">
  .wrapper
    width 100%
    height: 100%
    min-width: 1240px // 1005px
    font-family '微软雅黑'
    margin: 0 auto
    .index-wrapper2
      display flex
      flex-flow: column
      height: 100%
      .header
        position: relative
        text-align: right
        flex: 0 120px
        width: 100%
        background url("~static/img/header_bg.jpg")
        background-size: 100%;
        overflow: hidden
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
        /* 首页 · 精品展示 */
        .title
          position: absolute
          bottom: 0
          left: 0
          border-bottom: 5px solid rgb(48, 76, 123)
          width: 150px
          color: #fff
          h3
            font-size 16px
            font-weight bold
          h2
            display: inline-block
            font-size: 20px
            font-weight: bold
            line-height: 33px
        img
          width: 100%
      /* 整个导航菜单控件 */
      .el-tabs
        flex 1
        /*导航菜单-导航条*/
        .el-tabs__header
          margin-left: 0px
          display: flex
          .el-tabs__nav-wrap
            &::after
              background: initial
          .el-tabs__nav-scroll
            display: flex
            align-items center
            background-image url("~static/img/sidebar-tab-bg2.jpg")
            background-size auto 100%
            /*单个导航菜单item*/
            .el-tabs__item
              height auto
              color #fff
              &.is-active
                color #409EFF
              .regress
                display: flex
                align-items: center
                justify-content: center
                font-size: 26px
                p
                  display: flex
                  font-size: 14px
                  width: 200px
                i
                  background url("~static/img/icon_ear.png")
                  display: inline-block;
                  vertical-align: middle;
                  width: 22px;
                  height: 28px;
                  margin: 0 5px;
                .i1
                  background-position left top
                .i2
                  background-position right top
              &.is-active
                i
                  background url("~static/img/icon_ear_active.png")
        /*导航菜单-内容*/
        .el-tabs__content
          height: 100%
          .el-tab-pane
            height: 100%
          /*'玉器' 标题 加ul 内容*/
          .show-board-wrapper
            display: flex
            flex-flow column wrap
            height: 100%
            min-height: 500px
            /*padding: 20px*/
            /*border-right: 1px solid #eee*/
            font-size: 14px
            color: #6b6e72
            line-height 20px
            .side-title
              height 33px
              padding-left: 5px
              color: #fff
              line-height 33px
              background: url("~static/img/title_bg.jpg") no-repeat
              background-size 100%
            .r-side
              flex: 1
              background #ddd
              .relicType-bg
                height: 100%
                width 100%
                background-color #333
                background-repeat no-repeat
                background-size 110%
                opacity 0.8
                filter blur(6px)
                transform: scale(1.25)
              .el-carousel__container
                height 100%
                background green
                overflow: hidden
              .el-carousel__item
                display: flex
                h3
                  flex: 1
                  display: flex
                  justify-content: center
                  color: #475669;
                  font-size: 14px;
                  min-height: 400px;
                  padding: 20px
                  margin: 0;
                  background-size 100%
                  /* 藏品列表 */
                  ul.item-box
                    display: flex
                    flex-flow: row wrap
                    justify-content: space-around
                    width: 100%
                    max-width: 1050px
                    li
                      border-radius: 4px;
                      border: 1px solid #ebeef5;
                      overflow: hidden;
                      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                      display: flex
                      flex-flow: column
                      width: 150px
                      max-height: 160px;
                      padding: 10px 10px 0 10px
                      margin: 5px
                      background: #fff
                      cursor pointer
                      img
                        width 150px
                        height: 120px
                      .name
                        flex: 1
                        display: flex
                        justify-content: center
                        align-items center
                        text-align: center
                      p
                        text-align: center
              /* 索引按钮 (已经变成圆形 */
              > .el-carousel__indicators
                button
                  width: 20px
                  height: 20px
                  border-radius 50%

  // 友链
    .footer-wrapper
      background #555
      display: flex
      flex-flow: row wrap
      min-height: 100px
      font-size: 14px
      color: #ccc
      padding: 28px 25px
      h3
        font-size: 15px
        font-weight: bold
      .left
        flex: 1
        .link-box
          padding-top: 10px
          display: flex
          flex-flow wrap
          li
            width: 30%
            line-height: 28px
            a
              cursor: pointer
              img
                width 15px
                height: 15px
                vertical-align middle
              span
                color: #ccc
                margin-left: 5px
                display: inline-block
                vertical-align middle
      .right
        flex: 1
        p
          padding: 18px 18px 0 18px
          line-height: 25px

  // 下拉菜单
  .el-dropdown-menu
    .el-dropdown-menu__item
      padding 0
      a
        display inline-block
        padding: 0 20px
        width 100%
</style>
