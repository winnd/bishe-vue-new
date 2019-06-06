<template>
  <div class='board-wrapper'>
    <div class="r-oneline">
      <el-button @click="addNew" v-if="hasAuth(3)" class="add-btn">新增展品</el-button>
      <el-form :inline="true" :model="formInline" class="search-form">
        <el-form-item>
          <el-input v-model="formInline.str" placeholder="请输入展品id或展品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table border :data='formData' style='width: 100%' ref='singleTable' class='r-table'>
      <el-table-column type='expand'>
        <template slot-scope='props'>
          <el-form label-position='left' inline class='r-table-expand'>
            <el-form-item :style="{width:'100%'}">
              <img :src=$HOST+props.row.picUrl class="cover-img">
            </el-form-item>
            <el-form-item label='藏品名称'>
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label='编号'>
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label='类别'>
              <span>{{ getType(props.row.relicType) }}</span>
            </el-form-item>
            <el-form-item label='馆藏级别'>
              <span>{{ props.row.level }}</span>
            </el-form-item>
            <el-form-item label='完损程度'>
              <span>{{ props.row.attritionRate }}</span>
            </el-form-item>
            <el-form-item label='数量'>
              <span>{{ props.row.amount }}</span>
            </el-form-item>
            <el-form-item label='重量'>
              <span>{{ props.row.weight }}</span>
            </el-form-item>
            <el-form-item label='尺寸'>
              <span>{{ props.row.size }}</span>
            </el-form-item>
            <el-form-item label='材质'>
              <span>{{ props.row.material }}</span>
            </el-form-item>
            <el-form-item label='藏品介绍' :style="{'maxHeight':'200px','display':'inline-block','overflow':'hidden'}">
              <span>{{ props.row.introduction }}</span>
            </el-form-item>
            <el-form-item label='用途'>
              <span>{{ props.row.application }}</span>
            </el-form-item>
            <el-form-item label='朝代'>
              <span>{{ props.row.dynasty }}</span>
            </el-form-item>
            <el-form-item label='具体年代'>
              <span>{{ props.row.age }}</span>
            </el-form-item>
            <el-form-item label='工艺'>
              <span>{{ props.row.craft }}</span>
            </el-form-item>
            <el-form-item label='外形'>
              <span>{{ props.row.shape }}</span>
            </el-form-item>
            <el-form-item label='特性'>
              <span>{{ props.row.feature }}</span>
            </el-form-item>
            <el-form-item label='保护级别'>
              <el-rate v-model=props.row.protectValue disabled :style="{'padding-top':'10px'}"></el-rate>
            </el-form-item>
            <el-form-item label='文化级别'>
              <el-rate v-model=props.row.cultureValue disabled :style="{'padding-top':'10px'}"></el-rate>
            </el-form-item>
            <el-form-item label='文化内涵'>
              <span>{{ props.row.culturalConnotation }}</span>
            </el-form-item>
            <el-form-item label='保护要求'>
              <span>{{ props.row.requiredTech }}</span>
            </el-form-item>
            <el-form-item label='展示图片' :style="{'width':'100%'}">
              <template v-for="(item,index) in props.row.images">
                <img :src="$HOST+item.url" class="cover-img pdt-14px pdr-5px"/>
              </template>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type='index' width='50'></el-table-column>
      <el-table-column property='name' label='展品名称' width='200'></el-table-column>
      <el-table-column property='id' label='编号' width='150'></el-table-column>
      <el-table-column property='level' label='馆藏级别'></el-table-column>
      <el-table-column property='updateTime' label='添加日期' :formatter="dateFormat" width="200"></el-table-column>
      <template v-if="hasAuth(2)||hasAuth(3)">
        <el-table-column label='操作' width='100'>
          <template slot-scope='scope'>
            <el-button @click='edit(scope.row)' type='text' size='small' v-if="hasAuth(2)">编辑</el-button>
            <el-button @click='deleteItem(scope.row)' type='text' size='small' v-if="hasAuth(3)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <div class="block">
      <el-pagination
        :style="{'float':'right'}"
        @current-change="choicePage"
        :current-page="1"
        :page-size="5"
        layout="total,prev, pager, next, jumper"
        :total=this.totalData>
      </el-pagination>
    </div>
  </div>

</template>

<script>
  import _ from 'lodash'

  export default {
    created(){
      // 获取展品
      this.$api.api_req('relic/select/all', 'GET', {pageNum: 1, pageSize: 5}, this.getInitDataSuc, this.failure)
      // 获取展品种类
      this.$api.api_req('relicType/select/all', 'GET', {}, (_data) => { this.relicTypes = _data.data }, this.failure)
      // 获取权限列表
      this.$api.api_req('museum-api/user/user-auth/id/' + localStorage.getItem('userId'), 'GET', {}, this.getInitAuthList, this.failure, this.logicErr)
    },
    data() {
      return {
        formData: [],
        relicTypes: [],
        authList: [],       // 用户权限信息
        totalData: 0,
        formInline: {
          str: ''
        }
      }
    },
    methods: {
      getInitAuthList(_data){
        this.authList = []
        _data.data.map(x => {
          this.authList.push(x.funcId)
        })
        console.log(this.authList)
      },
      getInitDataSuc(_data){
        this.formData = _data.data
        this.totalData = _data.page.totalNum
      },
      // 添加按钮
      addNew(){
        this.$router.push({path: '/edit/exhibit/add'})
      },
      // 查询按钮
      search(){
        if (/[0-9]/.test(this.formInline.str)) {
          this.$api.api_req('museum-api/relic/resources', 'POST', {pageNum: 1, pageSize: 5, relicId: this.formInline.str}, this.getInitDataSuc, this.failure)
          this.$message.info('查询成功')
        } else {
          this.$api.api_req('museum-api/relic/resources', 'POST', {pageNum: 1, pageSize: 5, name: this.formInline.str}, this.getInitDataSuc, this.failure)
          this.$message.info('查询成功')
        }
      },
      // 编辑按钮
      edit(row){
        this.$router.push({path: '/edit/exhibit/edit' + '?id=' + row.id})
      },
      // 删除按钮
      deleteItem(row){
        this.$confirm('删除该件藏品?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.api_req('museum-api/relic/management/id/' + row.id, 'DELETE', {}, this.deleteSuc, this.failure)
          this.$message({type: 'success', message: '删除成功!'})
        }).catch(() => {
          this.$message({type: 'info', message: '已取消'})
        })
      },
      deleteSuc(_data){
        this.$api.api_req('museum-api/relic/resources', 'POST', {pageNum: 1, pageSize: 5}, _data => { this.formData = _data.data }, this.failure)
      },
      // filters 里没有this对象 所以用method
      getType(index){
        return _.find(this.relicTypes, ['id', index]).relicType
      },
      // 分页-选择页数
      choicePage(val) {
        this.$api.api_req('museum-api/relic/resources', 'POST', {pageNum: val, pageSize: 5}, _data => { this.formData = _data.data }, this.failure)
      },
      // 格式化时间
      dateFormat(row, column){
        console.log()
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

<style lang='stylus'>
  // r_私有样式
  .cover-img
    width: 100px

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

  // table 修正
  .r-table
    table
      tr
        form
          .el-form-item
            width: 50%
        td
          &:last-child
            border-right: 0

  // 展开 样式测试
  .r-table-expand {
    font-size: 0;
    label {
      width: 90px;
      color: #99a9bf;
    }
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }
</style>
