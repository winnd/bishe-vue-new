<template>
  <div class="detail-wrapper">
    <div class="detail-wrapper-bg"></div>
    <header class="el-header r-header" style="height: 60px;">
      <div class="option-box">
        <div class="option-box-bg"></div>
        <div class="mask"></div>
        <a :href="$rootPath" class="back">返回</a>
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
          <a class="collect">收藏</a>
        </div>
      </div>

    </header>

    <el-carousel indicator-position="outside" :autoplay=false class="r-side-detail" :initial-index=parseInt($route.query.index)>
      <el-carousel-item v-for="(exhibitItem,exhibitIndex) in exhibitsList" :key="exhibitIndex" :pic=$HOST+exhibitItem.picUrl>
        <h3>
          <div class="content">
            <div class="left-arrow"></div>
            <ul class="center">
              <li>
                <div class="image">
                  <el-carousel indicator-position="outside" :autoplay=true arrow="never" class="r-img-side">
                    <el-carousel-item v-for="(item,index) in exhibitsList[exhibitIndex].images" :key="index" :pic=$HOST+item.url>
                      <h3>
                        <img :src="$HOST+item.url" @click="previewImg($HOST+item.url)">
                      </h3>
                    </el-carousel-item>
                  </el-carousel>
                  <template v-if="exhibitItem.transformedUrn">
                    <a :href="$rootPath+'model?transformedUrn='+exhibitItem.transformedUrn" class="watch-model">
                      <i class="el-icon-search"></i>查看模型
                    </a>
                  </template>
                </div>
                <div class="instruction">
                  <div class="text">
                    <template>
                      <el-carousel indicator-position="outside" :autoplay=false arrow="never" class="r-txt">
                        <el-carousel-item>
                          <div>
                            <h3>
                              <h1>{{exhibitItem.name}}</h1>
                              <h2>{{exhibitItem.dynasty}} {{exhibitItem.age}} </h2>
                              <p>{{exhibitItem.introduction}}</p>
                            </h3>
                          </div>
                        </el-carousel-item>
                        <el-carousel-item>
                          <div>
                            <h3>
                              <p><span class="label">保护级别</span><span class="content">{{exhibitItem.protectValue}}</span></p>
                              <p><span class="label">文化级别</span><span class="content">{{exhibitItem.cultureValue}}</span></p>
                              <p><span class="label">尺寸</span><span class="content">{{exhibitItem.size}}</span></p>
                              <p><span class="label">用途</span><span class="content">{{exhibitItem.application}}</span></p>
                              <p><span class="label">工艺</span><span class="content">{{exhibitItem.craft}}</span></p>
                              <p><span class="label">材质</span><span class="content">{{exhibitItem.material}}</span></p>
                              <p><span class="label">外形</span><span class="content">{{exhibitItem.shape}}</span></p>
                              <p><span class="label">特性</span><span class="content">{{exhibitItem.feature}}</span></p>
                              <p><span class="label">地域</span><span class="content">{{exhibitItem.area}}</span></p>
                            </h3>
                          </div>
                        </el-carousel-item>
                        <el-carousel-item>
                          <div>
                            <h3>
                              <p><span class="label">馆藏级别</span><span class="content">{{exhibitItem.level}}</span></p>
                              <p><span class="label">完损程度</span><span class="content">{{exhibitItem.attritionRate}}</span></p>
                              <p><span class="label">数量</span><span class="content">{{exhibitItem.amount}}</span></p>
                              <p><span class="label">重量</span><span class="content">{{exhibitItem.weight}}</span></p>
                              <p><span class="label">保护要求</span><span class="content">{{exhibitItem.requiredTech}}</span></p>
                            </h3>
                          </div>
                        </el-carousel-item>
                      </el-carousel>
                    </template>

                  </div>
                </div>
              </li>
            </ul>
            <div class="right-arrow"></div>
          </div>
        </h3>
      </el-carousel-item>
    </el-carousel>
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl">
    </el-dialog>
  </div>
</template>

<script>
  const ACCOUNT_ID = '564fIM6TfltXLD7AN1AQCOhT9V2GZBGe'
  const ACCOUNT_SECRECT = 'cepTLQSlLyDmz3i1'
  const BUCKET_KEY = 'mbucket1'

  export default {
    created(){
      this.$api.api_req('museum-api/relic/resources', 'POST', {pageNum: 1, pageSize: 100, relicType: this.$route.query.type}, this.getOneTypeExhibitsSuc, this.failure)
      // 初始化操作模型的token
      this.$api.api_forge('authentication/v1/authenticate', 'POST',
        {'Content-Type': 'application/x-www-form-urlencoded'},              // headers
        'client_id=' + ACCOUNT_ID + '&' + 'client_secret=' + ACCOUNT_SECRECT + '&' + 'grant_type=' + 'client_credentials' + '&' + 'scope=' + 'data:read data:write bucket:create bucket:read bucket:delete viewables:read',          // 参数
        this.getTokenSuc, this.failure
      )
    },
    data(){
      return {
        exhibitsList: [],
        dialogVisible: false,                                     // 放大图片
        dialogImageUrl: '',                                         // 放大图片预览
        isLogin: localStorage.getItem('isLogin') === '1',           // 是否是登录状态
        username: localStorage.getItem('username')
      }
    },
    methods: {
      getOneTypeExhibitsSuc(_data){
        this.exhibitsList = _data.data
        console.log(_data.data)
      },
      // 图片放大预览
      previewImg(url){
        this.dialogVisible = true
        this.dialogImageUrl = url
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
    component: {}
  }
</script>

<style lang="stylus">
  // ele ui样式修改 暂存
  .r-side-detail
    flex: 1
    height: 100%
    & > .el-carousel__container
      height: calc(100% - 90px)
      > .el-carousel__arrow
        width: 50px
        height: 50px
      h3
        height: 100%
    & > .el-carousel__indicators
      height: 90px
      display: flex
      justify-content center
      overflow: auto
      button
        background-size 100% 100%
        width: 68px;
        height: 68px;
        opacity: 0.6
      .el-carousel__indicator
        &.is-active
          button
            opacity: 1

  .r-img-side
    h3
      text-align center
      cursor pointer
      img
        height: 100%
        max-width 330px
    .el-carousel__indicators
      height: 100px
      overflow: auto
      li.el-carousel__indicator
        button
          background-size 100% 100%
          width: 68px;
          height: 68px;
          opacity: 1
      &.is-active
        button
          opacity: 1

  .watch-model
    color: #4267BF;
    font-weight: bolder
    float right
    margin-right: 20px
    i
      padding-right: 5px

  .r-txt
    display flex
    height: 100%
    > .el-carousel__container
      flex: 1
      height: 100%
      .el-carousel__item
        > div
          padding: 50px 10px 30px 50px
    > .el-carousel__indicators
      display: flex
      flex-flow column
      justify-content: center
      flex: 0 40px
      padding-right: 40px
      /*background #fff*/
      button
        width: 20px
        height: 20px
        border-radius 50%
        background #444

  .detail-wrapper
    min-width: 1050px
    width: 100%
    height 100%
    min-height: 650px;
    display: flex
    flex-flow column
    overflow: hidden
    background #99A9BF
    position: relative
    .detail-wrapper-bg
      width: 100%;
      height: 100%;
      filter: blur(5px);
      position: absolute;
      background-size: 103%;
      background-image url("~static/img/detail-out-bg.jpg")
      transform: scale(1.01);
    .r-header
      z-index: 5
      padding: 0
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
          background-image url("~static/img/detail-out-bg.jpg")
          filter: blur(7px);
          background-size 103%
          transform: scale(1.01);
          z-index -6
        .mask
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background #000
          opacity: 0.4
          z-index: -5
        a
          display inline-block
          cursor pointer
          color #fff
          padding: 0 12px
          transition: all .3s;
          &:hover
            background-color: hsla(0, 0%, 100%, .3);
        .back
          padding: 0 15px
          margin-left: 50px
          float: left
        .login-box
          float right
          margin-right: 50px
          color #fff
          .hover-box
            display: inline-block
    .content
      flex: 1
      height: 100%
      display: flex
      justify-content space-between
      width: 100%
      .left-arrow
        flex: 0 70px
        display flex
        justify-content: center
        align-items: center
      .right-arrow
        flex: 0 70px
        display flex
        justify-content: center
        align-items: center
      .center
        flex: 1
        display: flex
        justify-content: center
        position: relative
        overflow: hidden
        max-width 1000px
        background: url("~static/img/detail-bg.png") no-repeat
        background-size 100%
        > li
          width 100%
          height 515px
          display: flex
          justify-content center
          align-items: center
          .image
            flex: 1
          .instruction
            flex: 1
            display: flex
            height: 100%
            .text
              min-width: 400px
              flex: 1
              line-height: 1.5;
              /*background #fff*/
              h1
                display: inline-block
                font-weight: blod
                font-size: 25px
                padding: 5px 0
                border-bottom 3px solid #6D9EBF
              h2
                padding-top: 5px
              p
                font-size: 14px
                margin-top: 5px
                color: #555
                display: flex
                .label
                  flex: 0 75px
                .content
                  flex: 1
    .footer
      flex: 0 100px
      width: 100%
      background: 1px solid yellow
      .album-container
        display: flex
        height: 100%
        overflow hidden
        .album-imgs
          flex: 1
          display: flex
          width 6000px
          height 100%
          ul.slide-bar
            display flex
            flex: 1
            justify-content flex-start
            align-items center
            flex-flow: row
            border 1px solid chartreuse
            li.img-item
              width: 68px;
              height: 68px;
              line-height: 68px;
              border: 1px solid #dfdfdf;
              margin: 5px
              .img-box
                width 100%
                height: 100%
                img
                  width: 100%
                  height 100%
        .slider-btn
          flex: 0 50px
          board: 1px solid green

  // 下拉菜单
  .el-dropdown-menu
    .el-dropdown-menu__item
      padding 0
      a
        display inline-block
        padding: 0 20px
        width 100%
</style>
