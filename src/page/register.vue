<template>
  <div class="login-wrapper">
    <div class="login-box">
      <div class="login-logo"></div>
      <div class="login-box-body">
        <p>请输入用户名密码</p>
        <div class="input-box">
          <el-input placeholder="用户名" suffix-icon="el-icon-message" v-model="input2"></el-input>
        </div>
        <div class="input-box">
          <el-input placeholder="登录账号" suffix-icon="el-icon-message" v-model="input2"></el-input>
        </div>
        <div class="input-box">
          <el-input placeholder="密码" suffix-icon="el-icon-edit" v-model="input2"></el-input>
        </div>
        <div class="remember-pw-line">
          <el-checkbox v-model="checked">记住密码</el-checkbox>
          <el-button size="small">注册</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
    }
  }
</script>

<style lang="stylus">
  .login-wrapper
    width: 100%
    min-width: 400px
    height: 100%
    font-family: '微软雅黑'
    background: #d2d6de
    overflow: hidden
    .login-box
      width: 360px
      margin: 7% auto
    .login-logo
      font-size: 25px
      margin-bottom: 25px
      text-align: center
      a
        color: #444;
        b
          font-weight: 700
    .login-box-body
      p
        color: #666
        font-size: 14px
        text-align: center;
        padding: 0 20px 20px 20px
      padding 20px
      background: #fff
      .input-box
        margin-bottom: 20px
      .remember-pw-line
        display: flex
        justify-content space-between
        align-items: center
</style>
