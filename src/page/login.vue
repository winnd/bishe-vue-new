<template>
  <div class="login-wrapper">
    <el-form ref="loginForm" label-width="80px">
      <div class="login-box">
        <div class="login-logo"><a>欢迎您 <b>Manager</b></a></div>
        <div class="login-box-body">
          <p>请输入用户名密码</p>
          <div class="input-box">
            <el-input placeholder="用户名" suffix-icon="el-icon-message" v-model="loginForm.username" value="1"></el-input>
          </div>
          <div class="input-box">
            <el-input placeholder="密码" type="password" suffix-icon="el-icon-edit" v-model="loginForm.password"
                      value="MTIzNDU2"></el-input>
          </div>
          <div class="remember-pw-line">
            <el-checkbox v-model="rememberPW">记住密码</el-checkbox>
            <el-button size="small" @click="login">登录</el-button>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    created(){
      if (this.rememberPW) {
        this.loginForm.username = localStorage.getItem('username')
        this.loginForm.password = localStorage.getItem('password')
      }
      console.log(this.rememberPW)
    },
    data(){
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        rememberPW: eval(localStorage.getItem('rememberPW')) === true
      }
    },
    methods: {
      login(){
        if (this.loginForm.username === '' || this.loginForm.password === '') {
          this.$message.error('密码或用户名不能为空')
        } else {
          if (this.rememberPW) {
            localStorage.setItem('rememberPW', this.rememberPW)
            localStorage.setItem('username', this.loginForm.username)
            localStorage.setItem('password', this.loginForm.password)
          } else {
            localStorage.setItem('rememberPW', this.rememberPW)
            localStorage.removeItem('username')
            localStorage.removeItem('password')
          }
          this.$api.api_req('museum-api/user/login', 'POST', {account: this.loginForm.username, password: btoa(this.loginForm.password)}, this.loginReqSuc, this.failure, this.logicErr)
        }
      },
      loginReqSuc(_data){
        localStorage.setItem('userId', _data.data.tokenModel.userId)
        localStorage.setItem('token', _data.data.tokenModel.token)
        localStorage.setItem('isLogin', 1)
        this.$router.push('/edit/exhibit/board')
      },
      failure(_err){
        console.log(_err)
      },
      logicErr(_err){
        this.$message.error(_err)
      }
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
