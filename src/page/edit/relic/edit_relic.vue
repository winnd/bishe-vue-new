<!--suppress JSUnresolvedVariable -->
<template>
  <div class="edit-relic-wrapper">

    <el-form :model="ruleForm" :rules="r_rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

      <div class="line-title">类别设置</div>
      <el-form-item label="从属类别" :style="{display:'inline-block'}" prop="relicTypeRule">
        <el-select v-model="ruleForm.relicType" placeholder="藏品类别">
            <el-option v-for="(item) in relicTypes"
                       :label=item.relicType
                       :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编号" :style="{display:'inline-block'}">
        <el-input v-model="ruleForm.id" :style="{width:'217px'}" :disabled="true" readonly></el-input>
      </el-form-item>

      <div class="line-title">基本信息(必填)</div>

      <el-form-item label="藏品名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="藏品名称"></el-input>
      </el-form-item>

      <!--馆藏级别 完损程度-->
      <div>
        <el-form-item label="馆藏级别" :style="{display:'inline-block'}" prop="level">
          <el-select v-model="ruleForm.level" placeholder="馆藏级别">
            <el-option label="特级" value="特级"></el-option>
            <el-option label="一级" value="一级"></el-option>
            <el-option label="二级" value="二级"></el-option>
            <el-option label="三级" value="三级"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完损程度" :style="{display:'inline-block'}" prop="attritionRate">
          <el-select v-model="ruleForm.attritionRate" placeholder="藏品完损程度">
            <el-option label="完整" value="完整"></el-option>
            <el-option label="轻微损坏" value="轻微损坏"></el-option>
            <el-option label="损坏" value="损坏"></el-option>
            <el-option label="损毁" value="损毁"></el-option>
          </el-select>
        </el-form-item>
      </div>

      <!--数量 重量-->
      <div>
        <el-form-item label="数量" :style="{display:'inline-block'}" prop="amount">
          <el-input v-model="ruleForm.amount" placeholder="数量和单位(如1对)" :style="{width:'217px'}"></el-input>
        </el-form-item>
        <el-form-item label="重量" :style="{display:'inline-block'}" prop="weight">
          <el-input v-model="ruleForm.weight" placeholder="重量(g)" :style="{width:'217px'}"></el-input>
        </el-form-item>
      </div>

      <!--尺寸 材质-->
      <div>
        <el-form-item label="尺寸" :style="{display:'inline-block'}" prop="size">
          <el-input v-model="ruleForm.size" placeholder="尺寸" :style="{width:'217px'}"></el-input>
        </el-form-item>
        <el-form-item label="材质" :style="{display:'inline-block'}" prop="material">
          <el-input v-model="ruleForm.material" placeholder="材质" :style="{width:'217px'}"></el-input>
        </el-form-item>
      </div>

      <!--藏品介绍-->
      <el-form-item label="藏品介绍">
        <el-input type="textarea" v-model="ruleForm.introduction" placeholder="藏品介绍"
                  :style="{height:'100px'}"></el-input>
      </el-form-item>

      <!--上传-->
      <p class="upload-txt">上传展品封面</p>
      <el-upload class="uploader-box" :show-file-list="false"
                 action="111"
                 name="uploadCoverImg"
                 :auto-upload="false"
                 :on-change="onCoverChange"
                 :on-remove="onCoverRemove">
        <img v-if="coverLocalUrl" :src="coverLocalUrl" class="avatar" alt="封面"><i v-else class="avatar-uploader-icon el-icon-plus"></i>
      </el-upload>

      <div class="line-title">其他信息</div>

      <!--用途-->
      <el-form-item label="用途">
        <el-input v-model="ruleForm.application" placeholder="请输入藏品用途"></el-input>
      </el-form-item>

      <!--朝代 具体年代-->
      <div>
        <el-form-item label="朝代" :style="{display:'inline-block'}">
          <el-input v-model="ruleForm.dynasty" placeholder="朝代" :style="{width:'217px'}"></el-input>
        </el-form-item>

        <el-form-item label="具体年代" :style="{display:'inline-block'}">
          <el-input v-model="ruleForm.age" placeholder="具体年代" :style="{width:'217px'}"></el-input>
        </el-form-item>
      </div>

      <!--工艺 外形-->
      <div>
        <el-form-item label="工艺" :style="{display:'inline-block'}">
          <el-input v-model="ruleForm.craft" placeholder="工艺" :style="{width:'217px'}"></el-input>
        </el-form-item>

        <el-form-item label="外形" :style="{display:'inline-block'}">
          <el-input v-model="ruleForm.shape" placeholder="外形" :style="{width:'217px'}"></el-input>
        </el-form-item>
      </div>

      <!-- 特性 地域-->
      <div>
        <el-form-item label="特性" :style="{display:'inline-block'}">
          <el-input v-model="ruleForm.feature" placeholder="藏品特性" :style="{width:'217px'}"></el-input>
        </el-form-item>

        <el-form-item label="地域" :style="{display:'inline-block'}">
          <el-input v-model="ruleForm.area" placeholder="地域" :style="{width:'217px'}"></el-input>
        </el-form-item>
      </div>

      <!--保护级别 文化级别(星级)-->
      <div>
        <el-form-item label="保护级别" :style="{display:'inline-block'}">
          <div class="r-star-box">
            <el-rate v-model="ruleForm.protectValue"></el-rate>
          </div>
        </el-form-item>
        <el-form-item label="文化级别" :style="{display:'inline-block'}" prop="cultureValue">
          <div class="r-star-box">
            <el-rate v-model="ruleForm.cultureValue"></el-rate>
          </div>
        </el-form-item>
      </div>

      <!--文化内涵 保护要求-->
      <el-form-item label="文化内涵">
        <el-input v-model="ruleForm.culturalConnotation" placeholder="藏品文化内涵"></el-input>
      </el-form-item>

      <el-form-item label="保护要求">
        <el-input v-model="ruleForm.requiredTech" placeholder="藏品文化技术保护要求"></el-input>
      </el-form-item>

      <!--上传其他图片-->
      <p class="upload-txt">上传其他展示图片</p>
      <el-upload class="uploader-box"
                 name="uploadImgList"
                 list-type="picture-card"
                 action="111"
                 :auto-upload="false"
                 :on-preview="onImgListPreview"
                 :file-list="imgList"
                 :limit=4
                 :on-change="onImgListChange"
                 :on-exceed="overLimit"
                 :on-remove=onImgListRemove>
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog size="tiny" :visible.sync=previewVisiable>
        <img width="100%" :src="previewImgUrl" alt="">
      </el-dialog>

      <!--模型上传-->
      <p class="upload-txt">上传模型</p>
      暂时关闭
      <!--todo 模型上传-->

      <!--<div class="uploader-box">-->
      <!--<a href="javascript:" class="r-file el-button&#45;&#45;primary el-button&#45;&#45;small el-button">选择文件-->
      <!--<input type="file" @change="getFile">-->
      <!--</a>-->
      <!--<div class="el-upload__tip">请上传.f3d格式的文件</div>-->
      <!--<ul v-if="ruleForm.urn" class="el-upload-list el-upload-list&#45;&#45;text">&lt;!&ndash; &ndash;&gt;-->
      <!--<li class="el-upload-list__item is-success">-->
      <!--<a :href="$rootPath + 'edit/relic/view'" target="_blank" class="el-upload-list__item-name">-->
      <!--<i class="el-icon-document"></i>{{ruleForm.urn ? ruleForm.urn : ''}}<span class="tip">(点击查看预览)</span>-->
      <!--</a>-->
      <!--<label class="el-upload-list__item-status-label">-->
      <!--<i class="el-icon-upload-success el-icon-circle-check"></i>-->
      <!--</label>-->
      <!--<i class="el-icon-close" @click="deleteModel(ruleForm.urn)"></i>-->
      <!--</li>-->
      <!--</ul>-->
      <!--</div>-->

      <!--提交 重置-->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
  import Api, { get } from '@/units/api'
  import { mapGetters } from 'vuex'

  //  const ACCOUNT_ID      = '564fIM6TfltXLD7AN1AQCOhT9V2GZBGe'
  //  const ACCOUNT_SECRECT = 'cepTLQSlLyDmz3i1'
  //  const BUCKET_KEY = 'mbucket1'

  export default {
    computed: {
      ...mapGetters(['relicTypes'])
    },
    created () {
      if (this.$route.query.id) {
        get('relic/select', { id: this.$route.query.id })
          .then((data) => { this.getRelicSuc(data) })

        // 初始化操作模型的token
//        this.$api.api_forge('authentication/v1/authenticate', 'POST',
//          { 'Content-Type': 'application/x-www-form-urlencoded' },              // headers
//          'client_id=' + ACCOUNT_ID + '&' + 'client_secret=' + ACCOUNT_SECRECT + '&' + 'grant_type=' + 'client_credentials' + '&' + 'scope=' + 'data:read data:write bucket:create bucket:read bucket:delete viewables:read',          // 参数
//          this.getTokenSuc, this.failure
//        )
      } else {
        this.$message.error('获取信息失败')
      }
    },
    data () {
      return {
        ruleForm       : {
          // 返回信息
          id                 : 0,
          code               : 0,
          // 必填信息
          relicType          : '',         // 类别
          name               : '',              // 名称
          level              : '',              // 级别
          attritionRate      : '',    // 完整缺损程度
          amount             : '',             // 数量
          weight             : '',             // 重量
          size               : '',               // 尺寸
          material           : '',           // 材质
          protectValue       : 0,     // 保护等级(星级
          cultureValue       : 0,     // 文化等级(星级
          picUrl             : '',            // 封面
          // 其他信息
          application        : '',       // 用途
          dynasty            : '',            // 朝代
          age                : '',                 // 年代
          craft              : '',              // 工艺
          shape              : '',              // 外形
          feature            : '',          // 特性
          area               : '',                   // 地域
          culturalConnotation: '',  // 文化内涵
          requiredTech       : '',          // 保护要求
          introduction       : '',    // 文化背景
          urn                : '',
          transformedUrn     : '',
          bucketKey          : 'mbucket1'
        },
        r_rules        : {
          relicTypeRule: [
            { message: '请选择藏品类型', trigger: 'change', type: 'number' }
          ],
          name         : [
            { required: true, message: '请输入展品名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          level        : [
            { required: true, message: '请选择藏品级别', trigger: 'change' }
          ],
          attritionRate: [
            { required: true, message: '请选择藏品完损程度', trigger: 'change' }
          ],
          amount       : [
            { required: true, message: '数量不能为空', trigger: 'blur' }
          ],
          weight       : [
            { required: true, message: '请输入展品重量', trigger: 'blur' }
          ],
          size         : [
            { required: true, message: '请输入展品尺寸', trigger: 'blur' }
          ],
          material     : [
            { required: true, message: '请输入展品材质', trigger: 'blur' }
          ]
        },
        previewVisiable: false,
        imgList        : [],                                    // imgList是要上传的内容
        previewImgList : [],                                    // previewImgList是从服务器拉下来初始化的时候显示的
        deleteImgList  : [],
        coverLocalUrl  : '',                                         // element ui 自带的
        coverImgFile   : '',
        previewImgUrl  : '',
        modelFile      : ''
      }
    },
    methods : {
      // 获取藏品成功时的回调
      getRelicSuc (data) {
        debugger
        this.ruleForm      = data.data
        this.previewImgUrl = this.ruleForm.picUrl ? this.$HOST + this.ruleForm.picUrl : '' // 封面 (ele组件本地图片的显示)
        this.imgList       = this.ruleForm.relicImages
        this.coverLocalUrl = this.ruleForm.picUrl
      },
      // 上传封面
      onCoverChange (file) {
        this.coverLocalUrl = URL.createObjectURL(file.raw)
        this.coverImgFile  = file
      },
//      // 保存token
//      getTokenSuc (data) {
//        localStorage.setItem('activeToken', data.data.access_token)
//      },
      // 删除封面
      onCoverRemove () { this.coverImgFile = '' },
      // 上传图片相册
      onImgListChange (file, files) {
        debugger
//        this.imgList       = files.filter(x => !x.raw)                  // 这是新增的时候上传的
        let newUploadFiles = files.filter(x => x.raw).map(x => x.raw)   // 这是现在新上传的
        newUploadFiles.map(x => this.imgList.push(x))                   // 组合起来
      },
      // 删除相册
      onImgListRemove (file, files) {
        debugger
        this.deleteImgList.push()
        this.imgList = files
      },
      // 预览相册
      onImgListPreview (file) {
        this.previewImgUrl   = file.url
        this.previewVisiable = true
      },
//      // 上传模型到本地
//      getFile (event) {
//        this.modelFile    = event.target.files[0]
//        this.ruleForm.urn = event.target.files[0].name
//        console.log(this.modelFile)
//        this.submitFile()
//      },
      // 提交模型
//      submitFile () {
//        this.$message.info('开始上传模型')
//        console.log('上传文件')
//        this.$api.api_forge('oss/v2/buckets/' + BUCKET_KEY + '/objects/' + this.modelFile.name, 'PUT',
//          { 'Content-Type': 'application/octet-stream', 'Authorization': 'Bearer ' + localStorage.getItem('activeToken') }, // headers
//          this.modelFile,             // 参数
//          this.submitFileSuc, this.failure
//        )
//      },
//      submitFileSuc (data) {
//        this.$message.success('模型上传成功')
//        console.log('模型上传成功')
//        this.transformFile(data.data.objectId)
//      },
      // 转换模型
//      transformFile (urn) {
//        this.$api.api_forge('modelderivative/v2/designdata/job', 'POST',
//          { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('activeToken') }, // headers
//          { 'input': { 'urn': btoa(urn) }, 'output': { 'formats': [{ 'type': 'svf', 'views': ['2d', '3d'] }] } },          // 参数
//          this.transformFileSuc, this.failure
//        )
//      },
//      transformFileSuc (data) {
//        localStorage.setItem('transformedUrn', data.data.urn)
//        this.ruleForm.transformedUrn = data.data.urn
//        console.log(data.data)
//        console.log('模型转换成功')
//        this.$message.success('模型转换完成 请点击预览')
//      },
      /* 提交 */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {return this.$message.error('请确认所填信息是否完善') }                      // 验证必填值是否填写

          this.formData.append('formData', new Blob([JSON.stringify(this.ruleForm)], { type: 'application/json' }))

          this.coverImgFile !== 'undefined' && this.formData.append('coverImg', this.coverImgFile.raw)

          this.imgList.map(x => { this.formData.append('imgList', x) })

          Api.post('relic/addNew', this.formData, { 'Content-Type': 'multipart/form-data' })
             .then(() => {
               this.$message.success('新增成功')
               this.$router.push({ path: '/edit/relic/board' })
             })
        })
      },
      submitFormSuc () {
        this.$message.success('提交成功')
        this.$router.push({ path: '/edit/relic/board' })
      },
      // 删除服务器上模型
//      deleteModel (name) {
//        console.log(this.ruleForm.urn)
//        this.$api.api_forge('oss/v2/buckets/' + BUCKET_KEY + '/objects/' + name, 'DELETE',
//          { 'Authorization': 'Bearer ' + localStorage.getItem('activeToken') },
//          {},
//          this.delectObjectSuc, this.failure
//        )
//      },
//      delectObjectSuc (data) {
//        console.log(data)
//        this.modelFile    = null
//        this.ruleForm.urn = ''
//        this.$message.success('删除成功')
//      },
      overLimit () { this.$message.warning('最多只能上传4个图片') },
      resetForm (formName) { this.$refs[formName].resetFields() },
      failure (_err) {
        console.log('添加藏品提交失败原因')
        console.log(_err)
      }
    }/* ,
     watch  : {
     currentType (newValue) {
     this.ruleForm.relicType = newValue
     }
     } */
  }
</script>

<style lang="stylus">
  .edit-relic-wrapper
    width: 100%
    border: 1px solid #e6ebf5;
    background-color: #fff;
    color: #2d2f33;
    border-radius: 4px;

    .line-title
      color: #1f2f3d;
      font-size: 22px;
      font-weight: 400;
      border-left 5px solid $themeColor
      margin: 20px 0 20px 0
      padding-left: 10px

  // 星级盒子
  .r-star-box
    display inline-block
    vertical-align top
    padding-top 9px
    width: 207px;
    padding-left: 10px;

  .demo-ruleForm
    width: 640px

  // 上传的单独样式
  .upload-txt
    margin: 20px
    margin-top: 5px

  .uploader-box
    border-radius: 3px;
    border: 1px solid #EBEBEB;
    padding: 24px;
    margin: 0 0 14px 14px;

    &:hover
      box-shadow: rgba(232, 237, 250, 0.6) 0 0 8px 0, rgba(232, 237, 250, .5) 0 2px 4px 0;

    .el-upload
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

    .el-upload:hover
      border-color: #409EFF;

    .avatar-uploader-icon
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;

  // 上传样式结束

  textarea
    height: 100%

  // 上传模型
  .r-file
    position: relative
    display: inline-block
    overflow: hidden
    text-decoration: none
    cursor pointer

    input
      position: absolute
      font-size: 100px
      right: 0
      top: 0
      opacity: 0
      cursor pointer

    &:hover
      background: #66b1ff
      border-color: #66b1ff
      color: #fff

  .tip
    padding-left: 20px
</style>
