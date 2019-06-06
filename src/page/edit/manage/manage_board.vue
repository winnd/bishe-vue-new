<template>
  <div class="exhibitType-board-wrapper">
    <div class="r-oneline">
      <el-button @click="addNew" v-if="hasAuth(7)">新增管理人员</el-button>
    </div>

    <el-table border :data="userData">
      <el-table-column type='index' width='50'></el-table-column>
      <el-table-column property="account" label="登录名"></el-table-column>
      <el-table-column property="name" label="用户名"></el-table-column>
      <el-table-column property="password" label="密码" :formatter="fakePW"></el-table-column>
      <el-table-column property="id" label="用户id"></el-table-column>
      <el-table-column property="updateTime" :formatter="dateFormat" label="更新时间" width="200px"></el-table-column>
      <template v-if="hasAuth(9)||hasAuth(8)">
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small" v-show="hasAuth(9)">修改</el-button>
            <el-button @click="deleteItem(scope.row)" type="text" size="small" v-show="hasAuth(8)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!--修改人员信息-->
    <el-dialog title="修改人员信息" :visible.sync="flag.showEdit" class="r-box">
      <el-form :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="账号" prop="account" :label-width="formLabelWidth">
          <el-input v-model="editForm.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input type="password" v-model="editForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" :label-width="formLabelWidth">
          <el-input type="password" v-model="editForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <!--修改权限-->
      <el-checkbox :indeterminate="flag.isIndeterminate" v-model="flag.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group class="r-radio-box" v-model="checkedRight" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="item in rightName" :label="item" :key="item">{{item}}</el-checkbox>
      </el-checkbox-group>

      <div slot="footer" class="dialog-footer">
        <el-button @click="flag.showEdit = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    created(){
      // 获取用户列表
      this.$api.api_req('user/select/all', 'GET', {}, (_data) => { this.userData = _data.data }, this.failure)
      // 获取全部权限列表
      this.$api.api_req('museum-api/user/auth-menu', 'GET', {}, this.initAuthLists, this.failure)
      // 获取当前用户的权限列表
      this.$api.api_req('museum-api/user/user-auth/id/' + localStorage.getItem('userId'), 'GET', {}, this.getCurrentAuth, this.failure, this.logicErr)
    },
    data(){
      // 密码验证
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.editForm.checkPass !== '') {
            this.$refs.editForm.validateField('checkPass')
          }
          callback()
        }
      }
      // 密码确认
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.editForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        userData: [],
        authList: [],                       // 当前用户权限信息
        choicedAuthList: [],
        editForm: {
          id: '',
          account: '',
          name: '',
          password: '',
          checkPass: ''
        },
        flag: {
          showEdit: false,
          isIndeterminate: false,          // flag 是否选了部分
          checkAll: false
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
        },
        rightName: [],                     // 全部权限 名称
        rights: [],                        // 全部权限 对象
        rightIndex: [],                    // 选中的权限 索引
        checkedRight: [],                  // 选中的权限 名称
        formLabelWidth: '80px'
      }
    },
    methods: {
      // 获取全部权限列表回调
      initAuthLists(data){
        data.data.menus.map((item, index) => {
          item.functions.map((item, index) => {
            this.rightName.push(item.functionName)      // 全部权限 名称
            this.rights.push(item)                      // 全部权限 对象
          })
        })
      },
      // 获取当前用户可操作的权限列表
      getCurrentAuth(_data){
        this.authList = []
        let tempData = Array.from(_data.data)
        tempData.shift()
        tempData.map(x => {
          this.authList.push(x.funcId)
        })
      },
      // 检查是否全选
      handleCheckAllChange(val) {
        this.checkedRight = val ? this.rightName : []   // true : false
        this.flag.isIndeterminate = false
      },
      // 检查是否选了部分
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length
        this.flag.checkAll = checkedCount === this.rightName.length
        this.flag.isIndeterminate = checkedCount > 0 && checkedCount < this.rightName.length
      },
      // 添加按钮
      addNew(){
        this.$router.push({path: '/edit/manage/add'})
      },
      // 编辑按钮
      edit(row){
        // 初始化
        this.flag = {showEdit: true, isIndeterminate: false, checkAll: false}
        this.editForm = {id: row.id, account: row.account, name: row.name, password: '', checkPass: ''}
        this.choicedAuthList = []
        this.checkedRight = []
        this.$api.api_req('museum-api/user/user-auth/id/' + row.id, 'GET', {}, this.getChoicedUserAuth, this.failure, this.logicErr)        // 获取选中的user权限
      },
      getChoicedUserAuth(_data){
        let tempData = Array.from(_data.data)
        console.log(tempData)
        tempData.map(x => {
          if (x.funcId === 1) { } else {
            this.choicedAuthList.push(x.funcId)
            this.checkedRight.push(_.find(this.rights, ['id', x.funcId]).functionName)
          }
        })
        this.flag.checkAll = this.choicedAuthList.length === this.rightName.length                                                // 是否全选
        this.flag.isIndeterminate = this.choicedAuthList.length > 0 && this.choicedAuthList.length < this.rightName.length        // 是否半选
      },
      editSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.rightIndex = this.nameToIndex(this.checkedRight, this.rights, 'id')
            this.$api.api_req('museum-api/user/management', 'PUT',
              {account: this.editForm.account, password: btoa(this.editForm.password), name: this.editForm.password, id: this.editForm.id},
              () => {}, this.failure)
            this.$api.api_req('museum-api/user/user-auth', 'POST', {userId: this.editForm.id, authList: this.rightIndex}, this.editSubmitSuc, this.failure)
          } else {
            this.$message.error({message: '请检查填写信息是否完整'})
            return false
          }
        })
      },
      editSubmitSuc(){
        this.$api.api_req('museum-api/user/all-users', 'GET', {}, (_data) => { this.userData = _data.data }, this.failure)
        this.flag.showEdit = false
        this.$message.success('更新用户成功')
      },
      deleteItem(row){
        this.$confirm('删除该用户?', '确认', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          this.$api.api_req('museum-api/user/management/id/' + row.id, 'DELETE', {}, this.deleteSuc, this.failure)
          this.$message({type: 'success', message: '删除成功!'})
        }).catch(() => { this.$message({type: 'info', message: '已取消'}) })
      },
      deleteSuc(data){
        this.$api.api_req('museum-api/user/all-users', 'GET', {}, (_data) => { this.userData = _data.data }, this.failure)
        this.$message.success('删除成功')
      },
      /**
       *  权限的名字列表转索引列表
       * @param _nameList     名字列表 (需要转成索引列表的目标
       * @param model         对照表   (权限整张表
       * @param target        id
       * @returns {Array}
       */
      nameToIndex(_nameList, model, target){
        let indexList = []
        _nameList.map((item, index) => {
          indexList.push(parseInt(_.find(model, ['functionName', item])[target]))
        })
        return indexList
      },
      // 伪显示密码
      fakePW(row, column){
        return '******'
      },
      hasAuth(index){
        return this.authList.indexOf(index) !== -1
      },
      // 格式化时间
      dateFormat(row, column){
        return new Date(row[column.property]).toLocaleString()
      },
      failure(_err){
        console.log('交互失败')
        console.log(_err)
      },
      logicErr(_err){
        this.$message.error(_err)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  // table 修正
  table
    tr
      form
        .el-form-item
          width: 50%
      td
        &:last-child
          border-right: 0

  // 添加按钮
  .r-oneline
    margin-bottom: 20px
    .add-btn
      float left
    .search-form
      float right
      margin-bottom: 0
      .el-form-item
        margin-bottom 0
    &::after
      content: ''
      display: block
      clear: both

  .r-radio-box
    .el-checkbox
      width: 50%;
      margin: 0
</style>
