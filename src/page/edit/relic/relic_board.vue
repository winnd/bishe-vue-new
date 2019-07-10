<template>
  <div class='board-wrapper'>
    <div class="r-oneline">
      <el-button @click="addNew" v-if="hasPerm('relic_insert')" class="add-btn">新增展品</el-button>
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
              <img :src="props.row.picUrl" class="cover-img" alt="">
            </el-form-item>
            <el-form-item label='藏品名称'>
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label='编号'>
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label='类别'>
              <span>{{ getType(props.row.relicTypes) }}</span>
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
              <template v-for="(item) in props.row.relicImages">
                <img :src="item.url" class="cover-img pdt-14px pdr-5px" alt="" />
              </template>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type='index' width='50'></el-table-column>
      <el-table-column property='name' label='展品名称' width='200'></el-table-column>
      <el-table-column property='id' label='编号' width='150'></el-table-column>
      <el-table-column property='level' label='馆藏级别'></el-table-column>
      <el-table-column property='updateTime' label='添加日期' :formatter="dateFormat"></el-table-column>
      <template v-if="hasPerm('relic_update')||hasPerm('relic_delete')">
        <el-table-column label='操作' width='100'>
          <template slot-scope='scope'>
            <el-button @click='edit(scope.row)' type='text' size='small' v-if="hasPerm('relic_update')">编辑</el-button>
            <el-button @click='deleteRelic(scope.row)' type='text' size='small' v-if="hasPerm('relic_delete')">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <div class="block">
      <el-pagination
        :style="{'float':'right'}"
        @current-change="choicePage"
        :current-page="currentPage"
        :page-size="pageSize"
        :prev-click="currentPage-1"
        :next-click="currentPage+1"
        layout="total,prev, pager, next, jumper"
        :total=this.totalData>
      </el-pagination>
    </div>
  </div>

</template>

<script>
  import { post, get, deleteItem } from '@/units/api'

  export default {
    inject : ['refresh'],
    created () {
      this._getRelicData(this.currentPage, this.pageSize)     // 获取数据 第 1 页, 10条
    },
    data () {
      return {
        formData   : [],
        authList   : [],       // 用户权限信息
        totalData  : 0,
        formInline : {
          str: ''
        },
        currentPage: 1,
        pageSize   : 10
      }
    },
    methods: {
      _getRelicData (pageNum, pageSize) {
        return get('relic/select/allRelic', { pageNum, pageSize })
          .then(data => { this.getInitDataSuc(data) })
      },
      getInitDataSuc (data) {
        this.formData  = data.data.list
        this.totalData = data.data.total        // todo 页数
      },
      getInitAuthList (data) {
        this.authList = []
        data.data.map(x => {
          this.authList.push(x.funcId)
        })
        console.log(this.authList)
      },
      addNew () { this.$router.push({ path: '/edit/relic/add' }) },
      // 查询按钮 todo
      search () {
        if (/[0-9]/.test(this.formInline.str)) {
          post('museum-api/relic/resources', { pageNum: 1, pageSize: 10, relicId: this.formInline.str })
            .then(data => {this.getInitDataSuc(data)})
          this.$message.info('查询成功')
        } else {
          post('museum-api/relic/resources', { pageNum: 1, pageSize: 10, name: this.formInline.str })
            .then(data => {this.getInitDataSuc(data)})
          this.$message.info('查询成功')
        }
      },
      // 编辑按钮
      edit (row) { this.$router.push({ path: '/edit/relic/edit' + '?id=' + row.id }) },
      // 删除按钮
      deleteRelic (row) {
        this.$confirm('删除该件藏品?', '确认', { type: 'warning' })
            .then(() => {
              deleteItem('relic/delete', { id: row.id })
                .then(() => { this.$message.success('删除成功!') })
                .then(() => { this.refresh() })
            })
            .catch(() => { this.$message.info('删除失败') })
      },
      deleteSuc () {
        this.$api.api_req('museum-api/relic/resources', 'POST', { pageNum: 1, pageSize: 5 }, _data => { this.formData = _data.data }, this.failure)
      },
      // filters 里没有this对象 所以用method
      getType (index) { return this.$store.state.relicTypes.relicTypes.find(x => x.id === index) },
      // 分页-选择页数
      choicePage (val, a, b) {
        this._getRelicData(val, this.pageSize)
      },
      // 格式化时间
      dateFormat (row, column) {
        return new Date(row[column.property]).toLocaleString()
      },
      hasAuth (index) {
        return this.authList.indexOf(index) !== -1
      },
      logicErr (_err) {
        this.$message.error(_err)
      }
    }
  }
</script>

<style lang='stylus'>
  .cover-img
    width: 100px

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

  .r-table
    table
      tr
        form
          .el-form-item
            width: 50%

        td
          &:last-child
            border-right: 0

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
