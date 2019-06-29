<template>
  <div class="user-add-wrapper">

    <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px" class="user-add-form">

      <div class="base-set">
        <div class="line-title">基本设置</div>
        <el-form-item label="账号" prop="account" :style="{display:'inline-block'}">
          <el-input v-model="userForm.account"></el-input>
        </el-form-item>

        <el-form-item label="用户名" prop="name" :style="{display:'inline-block'}">
          <el-input v-model="userForm.name"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password" :style="{display:'inline-block'}">
          <el-input type="password" v-model="userForm.password" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPass" :style="{display:'inline-block'}">
          <el-input type="password" v-model="userForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>
      </div>

      <div class="line-title">权限设置</div>

      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group class="r-radio-box" v-model="checkedRight" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="item in rightName" :label="item" :key="item">{{item}}</el-checkbox>
      </el-checkbox-group>

      <el-form-item>
        <el-button type="primary" @click="submitForm('userForm')">提交</el-button>
        <el-button @click="resetForm('userForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    created(){
      // 获取全部权限列表
      this.$api.api_req('museum-api/routerManage/auth-menu', 'GET', {}, this.initAuthLists, this.failure)
    },
    data(){
      // 密码验证
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.userForm.checkPass !== '') {
            this.$refs.userForm.validateField('checkPass')
          }
          callback()
        }
      }
      // 密码确认
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.userForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        checkAll: false,
        rightName: [],            // 全部权限 名称
        rights: [],               // 全部权限 索引
        rightIndex: [],           // 选中的权限 索引
        checkedRight: [],         // 选中的权限 名称
        isIndeterminate: false,   // flag 是否选了部分
        userForm: {
          account: '',
          name: '',
          password: '',
          checkPass: ''
        },
        rules: {
          account: [
            {required: true, message: '请输入登录账号', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {required: true, validator: validatePass2, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 初始化权限列表和权限索引列表
      initAuthLists(data){
        data.data.menus.map((item) => {
          item.functions.map((item) => {
            this.rightName.push(item.functionName)      // 全部权限 名称
            this.rights.push(item)                      // 全部权限 索引
          })
        })
      },
      // 检查是否全选
      handleCheckAllChange(val) {
        this.checkedRight = val ? this.rightName : []   // true : false
        this.isIndeterminate = false
      },
      // 检查是否选了部分
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.rightName.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.rightName.length
      },
      // 提交
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$api.api_req('museum-api/routerManage/register', 'POST', _.pick(this.userForm, ['account', 'name', 'password']), this.submitFormSuc, this.failure)
          } else {
            this.$message.error({message: '请检查填写信息是否完整'})
            return false
          }
        })
      },
      // 注册用户成功, 授予权限
      submitFormSuc(data){
        // 拿到选中的权限索引 权限转索引
        this.rightIndex = []
        this.checkedRight.map((item) => {
          this.rightIndex.push(parseInt(_.find(this.rights, ['functionName', item]).id))
        })
        console.log(Array.from(this.rightIndex))
        this.$api.api_req('museum-api/routerManage/routerManage-auth', 'POST', {userId: data.data.id, authList: this.rightIndex}, this.registSuc, this.failure)
      },
      registSuc(data){
        console.log(data)
        this.$message({type: 'success', message: '注册成功'})
        this.$router.push({path: '/edit/user/board'})
      },
      // 重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.$message({message: '重置完成'})
      },
      failure(_err){
        console.log('交互失败')
        console.log(_err)
      }
    }
  }
</script>

<style lang="stylus">
  .user-add-wrapper
    width: 600px
  //标题
    .line-title
      color: #1f2f3d;
      font-size: 22px;
      font-weight: 400;
      border-left 5px solid #409eff
      margin: 20px 0 20px 0
      padding-left: 10px
    .user-add-form
      .base-set
        width: 400px
      /*.manage-right-box*/
        /*margin-left 50px*/
        /*margin-bottom: 20px*/
        /*.el-checkbox-group*/
          /*padding: 10px 0*/
      .el-input__inner
        width: 300px
    .el-form-item
      display: flex
      justify-content: center
    .el-checkbox
      width: 150px
      margin-left: 30px
      padding-bottom: 5px

  .el-checkbox
    margin 0
  .el-checkbox + .el-checkbox
    margin 0
</style>
