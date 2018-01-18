<template>
  <div class="friendship-board-wrapper">
    <div class="r-oneline">
      <el-button @click="flag.showAdd=true" v-if=hasAuth(10) class="add-btn">新增友链</el-button>
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item>
          <el-input v-model="searchForm.str" placeholder="请输入关键词"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data="linkList" style="width: 100%;">
      <el-table-column type='index' width='50'></el-table-column>
      <el-table-column property="name" label="链接名称"></el-table-column>
      <el-table-column property="id" label="id"></el-table-column>
      <el-table-column property="url" label="链接url"></el-table-column>
      <el-table-column property="image" label="图标链接"></el-table-column>
      <el-table-column property="updateTime" :formatter="dateFormat" label="更新时间" width="200px"></el-table-column>
      <template v-if="hasAuth(12)||hasAuth(11)">
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small" v-if="hasAuth(12)">修改</el-button>
            <el-button @click="deleteItem(scope.row)" type="text" size="small" v-if="hasAuth(11)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!--新增友链弹出框-->
    <el-dialog title="新增友链" :visible.sync="flag.showAdd">
      <el-form :model="addForm">
        <el-form-item label="链接名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接url" :label-width="formLabelWidth">
          <el-input v-model="addForm.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标链接" :label-width="formLabelWidth">
          <el-input v-model="addForm.image" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="flag.showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改友链弹出框-->
    <el-dialog title="修改友链" :visible.sync="flag.showEdit">
      <el-form :model="editForm">
        <el-form-item label="链接名称" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接url" :label-width="formLabelWidth">
          <el-input v-model="editForm.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标链接" :label-width="formLabelWidth">
          <el-input v-model="editForm.image" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="flag.showEdit = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    created(){
      // 查询友链
      this.$api.api_req('museum-api/friendship-link/resources', 'POST', {pageSize: 100, pageNum: 1}, (_data) => { this.linkList = _data.data }, this.failure)
      // 获取权限列表
      this.$api.api_req('museum-api/user/user-auth/id/' + localStorage.getItem('userId'), 'GET', {}, this.getInitAuthList, this.failure, this.logicErr)
    },
    data(){
      return {
        linkList: [],
        authList: [],       // 用户权限信息
        flag: {
          showAdd: false,
          showEdit: false
        },
        addForm: {
          name: '',
          url: '',
          image: ''
        },
        editForm: {},
        searchForm: {
          str: ''
        },
        formLabelWidth: '80px'
      }
    },
    methods: {
      getInitAuthList(_data){
        this.authList = []
        _data.data.map(x => {
          this.authList.push(x.funcId)
        })
      },
      // 查询的按钮
      search(){
        if (/[0-9]/.test(this.searchForm.str)) {
          this.$message.info('按id查询')
          this.$api.api_req('museum-api/friendship-link/resources', 'POST', {pageSize: 100, pageNum: 1, id: this.searchForm.str}, (_data) => { this.linkList = _data.data }, this.failure)
        } else {
          this.$message.info('按展品名称查询')
          this.$api.api_req('museum-api/friendship-link/resources', 'POST', {pageSize: 100, pageNum: 1, name: this.searchForm.str}, (_data) => { this.linkList = _data.data }, this.failure)
        }
//        this.$message.info({type: 'info', message: '已显示全部'})
      },
      addSubmit(){
        this.flag.showAdd = false
        this.$api.api_req('museum-api/friendship-link/management', 'POST', this.addForm, this.addSubmitSuc, this.failure)
      },
      addSubmitSuc(_data){
        this.$message.success('新增友链成功')
        this.$api.api_req('museum-api/friendship-link/resources', 'POST', {pageSize: 100, pageNum: 1}, (_data) => { this.linkList = _data.data }, this.failure)
      },
      // 点击'修改'按钮
      edit(row){
        this.flag.showEdit = true
        this.$api.api_req('museum-api/friendship-link/resources', 'POST', {id: row.id, pageSize: 100, pageNum: 1}, this.searchEditItemSuc, this.failure)
      },
      searchEditItemSuc(_data){
        this.editForm = _data.data[0]
        console.log(_data.data[0])
      },
      // 提交修改
      editSubmit(){
        this.$api.api_req('museum-api/friendship-link/management', 'PUT', {id: this.editForm.id, name: this.editForm.name, url: this.editForm.url, image: this.editForm.image}, this.editSubmitSuc, this.failure)
      },
      editSubmitSuc(){
        this.flag.showEdit = false
        this.$message.success('修改友链成功')
        this.$api.api_req('museum-api/friendship-link/resources', 'POST', {pageSize: 100, pageNum: 1}, (_data) => { this.linkList = _data.data }, this.failure)
      },
      // 删除
      deleteItem(row){
        this.$confirm('删除该友链?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.api_req('museum-api/friendship-link/management/id/' + row.id, 'DELETE', {}, this.deleteSuc, this.failure)
        }).catch(() => {
          this.$message({type: 'info', message: '已取消'})
        })
      },
      deleteSuc(_data){
        this.$api.api_req('museum-api/friendship-link/resources', 'POST', {pageSize: 100, pageNum: 1}, (_data) => { this.linkList = _data.data }, this.failure)
        this.$message({type: 'success', message: '删除成功!'})
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
</style>
