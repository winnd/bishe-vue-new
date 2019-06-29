<template>
  <div class="relicType-board-wrapper">
    <div class="r-oneline">
      <el-button @click="flag.addFlag = true" v-if="hasAuth(4)">新增类别</el-button>
      <el-form :inline="true" :model="formInline" class="search-form">
        <el-form-item>
          <el-input v-model="formInline.user" placeholder="请输入关键词"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="typeData" style="width: 100%;">
      <el-table-column type='index' width='50'></el-table-column>
      <el-table-column property="relicTypes" label="藏品类别"></el-table-column>
      <el-table-column property="id" label="类别id"></el-table-column>
      <el-table-column property="updateTime" :formatter="dateFormat" label="更新时间"></el-table-column>
      <template v-if="hasAuth(4)||hasAuth(5)">
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button @click="showEditItem(scope.row)" type="text" size="small" v-if="hasAuth(4)">修改</el-button>
            <el-button @click="deleteItem(scope.row)" type="text" size="small" v-if="hasAuth(5)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!--新增弹框-->
    <el-dialog title="新增藏品类别" :visible.sync="flag.addFlag">
      <el-form :model="addForm">
        <el-form-item label="类别名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.relicType" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="背景图片" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            name="uploadFile"
            action="/museum-api/file/management"
            :headers=uploadHeader
            :on-success="addBg">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="flag.addFlag = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑弹框-->
    <el-dialog title="编辑藏品类别" :visible.sync="flag.editFlag">
      <el-form :model="editForm">
        <el-form-item label="类别名称" :label-width="formLabelWidth">
          <el-input v-model="editForm.relicType" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="背景图片" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            name="uploadFile"
            action="/museum-api/file/management"
            :headers=uploadHeader
            :on-success="editBg">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="flag.editFlag = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    created(){
      this.$api.api_req('relicType/select/allRelicType', 'GET', {}, (_data) => { this.typeData = _data.data }, this.failure)
      // 获取权限列表
      this.$api.api_req('museum-api/routerManage/routerManage-auth/id/' + localStorage.getItem('userId'), 'GET', {}, this.getInitAuthList, this.failure, this.logicErr)
    },
    data(){
      return {
        typeData: [],
        authList: [],                   // 用户权限信息
        formInline: {
          user: ''
        },
        addForm: {
          relicType: '',
          img: ''
        },
        editForm: {
          relicType: '',
          img: '',
          id: 0
        },
        flag: {
          addFlag: false,
          editFlag: false
        },
        uploadHeader: {
          'authorization': localStorage.getItem('token')// header 身份验证token
        },
        formLabelWidth: '80px',
        imageUrl: ''
      }
    },
    methods: {
      getInitAuthList(_data){
        this.authList = []
        _data.data.map(x => {
          this.authList.push(x.funcId)
        })
      },
      // 删除按钮
      deleteItem(row){
        this.$confirm('删除该类别?', '确认', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
          .then(() => {
            this.$api.api_req('museum-api/relic-type/management/' + row.id, 'DELETE', {}, this.deleteSuc, this.failure)
            this.$message({type: 'success', message: '删除成功!'})
          }).catch(() => { this.$message({type: 'info', message: '已取消'}) })
      },
      deleteSuc(){
        this.$api.api_req('museum-api/relic-type/resources', 'GET', {}, (_data) => { this.typeData = _data.data }, this.failure)
      },
      addSubmit(){
        this.$api.api_req('museum-api/relic-type/management', 'POST', this.addForm, this.addTypeSuc, this.failure)
      },
      addTypeSuc(){
        this.$api.api_req('museum-api/relic-type/resources', 'GET', {}, (_data) => { this.typeData = _data.data }, this.failure)
        this.imageUrl = ''
        this.flag.addFlag = false
        this.$message.success('添加成功')
      },
      // 修改按钮
      showEditItem(row){
        this.flag.editFlag = true
        this.imageUrl = this.$HOST + row.img
        this.editForm.img = row.img
        this.editForm.relicType = row.relicType
        this.editForm.id = row.id
      },
      editSubmit(){
        this.$api.api_req('museum-api/relic-type/management', 'PUT', this.editForm, this.editTypeSuc, this.failure)
      },
      editTypeSuc(){
        this.$api.api_req('museum-api/relic-type/resources', 'GET', {}, (_data) => { this.typeData = _data.data }, this.failure)
        this.imageUrl = ''
        this.$message({type: 'success', message: '修改成功'})
        this.flag.editFlag = false
      },
      // addForm上传背景
      addBg(res, file){
        this.imageUrl = URL.createObjectURL(file.raw) // 渲染
        this.coverImgId = res.data.id                 // 返回的图片id
        this.addForm.img = res.data.url
      },
      editBg(res, file){
        this.imageUrl = URL.createObjectURL(file.raw) // 渲染
        this.coverImgId = res.data.id                 // 返回的图片id
        this.editForm.img = res.data.url
      },
      // 查询按钮
      search(){
        this.$message.info({type: 'info', message: '已显示全部'})
      },
      // 格式化时间
      dateFormat(row, column){
        return new Date(row[column.property]).toLocaleString()
      },
      hasAuth(index){
        return this.authList.indexOf(index) !== -1
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

<style lang="stylus">

  // table 修正
  table
    tr
      form
        .el-form-item
          width: 50%
      td
        &:last-child
          border-right: 0

  // 上传图片
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
