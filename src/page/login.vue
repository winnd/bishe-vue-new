<template>
  <div class="login-wrapper">
    <el-form ref="loginForm" label-width="80px" label-position="top">
      <div class="login-box">
        <div class="login-logo"><a>欢迎您 <b>Manager</b></a></div>
        <div class="login-box-body">
          <p>请输入用户名密码</p>
          <el-form-item prop="account">
            <el-input placeholder="用户名"
                      suffix-icon="el-icon-routerManage"
                      :rules="{ required: true, trigger: 'blur', message: '请输入用户名' }"
                      v-model="loginForm.account"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="密码"
                      autoComplete="on"
                      type="password" suffix-icon="el-icon-lock"
                      v-model="loginForm.password"
                      :rules="{required: true, trigger: 'blur', message: '请输入密码'}"
            ></el-input>
          </el-form-item>
          <el-form-item>
          <div class="remember-pw-line">
            <el-checkbox v-model="rememberPW">记住密码</el-checkbox>
            <el-button size="small" @click.native.prevent="login" :loading="loading">登录</el-button>
          </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    created () {},
    data () {
      return {
        loading   : false,
        loginForm : {
          account : 'admin',
          password: '1'
        },
        rememberPW: true
//        rememberPW: eval(localStorage.getItem('rememberPW')) === true
      }
    },
    methods: {
      login () {
        if (this.loginForm.account === '' || this.loginForm.password === '') {
          this.$message.error('密码或用户名不能为空')
        } else {
          this.$store
              .dispatch('Login', this.loginForm)
              .then(data => {
                if (data.status === 0) this.$router.push({ path: '/' })
                else this.$message.error('账号/密码错误')
              })
              .catch((e) => {
                console.log(e)
                this.loading = false
              })
        }
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

      /*.input-box*/
      /*margin-bottom: 20px*/

      .remember-pw-line
        display: flex
        justify-content space-between
        align-items: center


    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;

      &_login {
        font-size: 20px;
      }
    }
</style>
