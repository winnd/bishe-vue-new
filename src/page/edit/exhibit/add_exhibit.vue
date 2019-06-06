<template>
  <div class="add-exhibit-wrapper">
    
    <el-form :model="ruleForm" :rules="r_rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      
      <div class="line-title">类别设置</div>
      <el-form-item label="从属类别" :style="{display:'inline-block'}" prop="relicType">
        <el-select v-model="ruleForm.relicType" placeholder="藏品类别">
          <template v-for="(item,index) in relicType">
            <el-option :label=item.relicType :value=item.id.toString() :key="item.id"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="编号" :style="{display:'inline-block'}">
        <el-input v-model="ruleForm.id" :style="{width:'217px'}" readonly></el-input>
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
        <el-input type="textarea" v-model="ruleForm.introduction" placeholder="藏品介绍" :style="{height:'100px'}"></el-input>
      </el-form-item>
      
      <!--上传-->
      <p class="upload-txt">上传展品封面</p>
      <el-upload class="uploader-box" :show-file-list="false" action="/museum-api/file/management" name="uploadFile" :headers=uploadHeader :on-success="uploadCover">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="avatar-uploader-icon el-icon-plus"></i>
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
      <el-upload class="uploader-box" name="uploadFile" list-type="picture-card" action="/museum-api/file/management" :on-success="handleUploadImgs" :data=uploadPrams :on-preview="handlePictureCardPreview" :limit=4 :on-exceed="overLimit" :on-remove=handleRemove :headers=uploadHeader>
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog size="tiny" :visible.sync=flag.previewVisiable>
        <img width="100%" :src="previewImg">
      </el-dialog>
      
      <!--模型上传-->
      <p class="upload-txt">上传模型</p>
      
      <div class="uploader-box">
        <a href="javascript:;" class="r-file el-button--primary el-button--small el-button">选择文件
          <input type="file" @change="getFile($event)">
        </a>
        <div class="el-upload__tip">请上传.f3d格式的文件</div>
        <ul v-if="ruleForm.urn" class="el-upload-list el-upload-list--text"><!-- -->
          <li class="el-upload-list__item is-success">
            <a :href="$rootPath + 'edit/exhibit/view'" target="_blank" class="el-upload-list__item-name">
              <i class="el-icon-document"></i>{{ruleForm.urn ? ruleForm.urn : ''}}<span class="tip">(点击查看预览)</span>
            </a>
            <label class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-circle-check"></i>
            </label>
            <i class="el-icon-close" @click="deleteModel(ruleForm.urn)"></i>
          </li>
        </ul>
      </div>
      
      <!--提交 重置-->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  
  </div>
</template>

<script>
  import _ from 'lodash'
  
  const ACCOUNT_ID = '564fIM6TfltXLD7AN1AQCOhT9V2GZBGe'
  const ACCOUNT_SECRECT = 'cepTLQSlLyDmz3i1'
  const BUCKET_KEY = 'mbucket1'
  
  export default {
    created() {
      // 获取新增展品id
      this.$api.api_req('museum-api/relic/management/template', 'GET', {'CURRENT_USER_ID': 1}, (_data) => { this.ruleForm.id = _data.data.id }, this.failure)
      // 获取种类列表
      this.$api.api_req('museum-api/relic-type/resources', 'GET', {}, (_data) => { this.relicType = _data.data }, this.failure)
      // 初始化操作模型的token
      this.$api.api_forge('authentication/v1/authenticate', 'POST',
        {'Content-Type': 'application/x-www-form-urlencoded'}, // headers
        'client_id=' + ACCOUNT_ID + '&' + 'client_secret=' + ACCOUNT_SECRECT + '&' + 'grant_type=' + 'client_credentials' + '&' + 'scope=' + 'data:read data:write bucket:create bucket:read bucket:delete viewables:read',          // 参数
        this.getTokenSuc, this.failure
      )
    },
    data() {
      return {
        ruleForm: {
          // 返回信息
          id: 0,
          code: 0,
          // 必填信息
          relicType: '1',         // 类别
          name: '',              // 名称
          level: '一级',              // 馆藏级别
          attritionRate: '完整',    // 完整缺损程度
          amount: '1件',             // 数量
          weight: '-',             // 重量
          size: '',               // 尺寸
          material: '玉质',           // 材质
          protectValue: 5,     // 保护等级(星级
          cultureValue: 4,     // 文化等级(星级
          picUrl: '',            // 封面
          // 其他信息
          application: '祭器',       // 用途
          dynasty: '石器时代',            // 朝代
          age: '',                 // 年代
          craft: '手工',              // 工艺
          shape: '',              // 外形
          feature: '随葬品',          // 特性
          area: '',                   // 地域
          culturalConnotation: '的代表',  // 文化内涵
          requiredTech: '避光 避高温 避潮湿',          // 保护要求
          introduction: '',    // 文化背景
          urn: '',                      // 这个该用来存模型名称
          transformedUrn: '',
          bucketKey: 'mbucket1'
        },
        r_rules: {
          relicType: [
            {required: true, message: '请选择藏品类型', trigger: 'change'}
          ],
          name: [
            {required: true, message: '请输入展品名称', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
          ],
          level: [
            {required: true, message: '请选择藏品级别', trigger: 'change'}
          ],
          attritionRate: [
            {required: true, message: '请选择藏品完损程度', trigger: 'change'}
          ],
          amount: [
            {required: true, message: '数量不能为空', trigger: 'blur'}
          ],
          weight: [
            {required: true, message: '请输入展品重量', trigger: 'blur'}
          ],
          size: [
            {required: true, message: '请输入展品尺寸', trigger: 'blur'}
          ],
          material: [
            {required: true, message: '请输入展品材质', trigger: 'blur'}
          ]
        },
        relicType: [],
        imageUrl: '',                                   // element ui 自带的 本地图片地址
        tempImageList: [],                              // {id: 0, tempId: 0}   // id是服务器返回的图片id tempId 是本地上传成功的id
        uploadHeader: {
          'authorization': localStorage.getItem('token')// header 身份验证token
        },
        uploadPrams: {
          imageIds: _.pick(this.tempImageList, ['id'])
        },
        flag: {
          previewVisiable: false
        },
        coverImgId: 0,
        previewImg: '',
        modelFile: ''
      }
    },
    methods: {
      // 保存token
      getTokenSuc(data) {
        localStorage.setItem('activeToken', data.data.access_token)
      },
      // 上传封面
      uploadCover(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw) // 渲染
        if (this.coverImgId !== 0) {
          // 删除cover
          this.$api.api_req('museum-api/relic/management/image', 'DELETE', {relicId: this.ruleForm.id, imageId: this.coverImgId}, () => {}/*, this.failure */)
          this.coverImgId = 0
        }
        this.coverImgId = res.data.id
        this.$api.api_req('museum-api/relic/management/image', 'POST', {relicId: this.ruleForm.id, imageIds: [].concat(res.data.id)}, () => { this.$message({type: 'success', message: '封面上传成功!'}) }/*, this.failure */) // 绑定
        this.ruleForm.picUrl = res.data.url
      },
      // 上传图片相册
      handleUploadImgs(res, file) {
        this.tempImageList.push({id: res.data.id, tempId: file.uid})
        this.$api.api_req('museum-api/relic/management/image', 'POST', {relicId: this.ruleForm.id, imageIds: _.map(this.tempImageList, 'id')}, () => { this.$message.success({message: '图片上传成功'}) }/*, this.failure */)
      },
      // 删除相册
      handleRemove(_data) {
        var delImgId = _.find(this.tempImageList, ['tempId', _data.uid]).id
        this.$api.api_req('museum-api/relic/management/image', 'DELETE', {relicId: this.ruleForm.id, imageId: delImgId}, () => {}/*, this.failure */)
        this.tempImageList = _.reject(this.tempImageList, ['tempId', _data.uid])
      },
      // 上传模型
      getFile(event) {
        this.modelFile = event.target.files[0]
        this.ruleForm.urn = event.target.files[0].name
        console.log(this.modelFile)
        this.submitFile()
      },
      // 提交模型
      submitFile() {
        this.$message.info('开始上传模型')
        console.log('上传文件')
        this.$api.api_forge('oss/v2/buckets/' + BUCKET_KEY + '/objects/' + this.ruleForm.urn, 'PUT',
          {'Content-Type': 'application/octet-stream', 'Authorization': 'Bearer ' + localStorage.getItem('activeToken')}, // headers
          this.modelFile,             // 参数
          this.submitFileSuc/*, this.failure */)
      },
      submitFileSuc(data) {
        this.$message.success('模型上传成功')
        console.log('模型上传成功')
        this.transformFile(data.data.objectId)
      },
      // 转换模型
      transformFile(urn) {
        this.$api.api_forge('modelderivative/v2/designdata/job', 'POST',
          {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('activeToken')}, // headers
          {'input': {'urn': btoa(urn)}, 'output': {'formats': [{'type': 'svf', 'views': ['2d', '3d']}]}},          // 参数
          this.transformFileSuc /*,
          this.failure */
        )
      },
      transformFileSuc(data) {
        console.log(data.data)
        localStorage.setItem('transformedUrn', data.data.urn)
        this.ruleForm.transformedUrn = data.data.urn
        console.log('模型转换成功')
        this.$message.success('模型转换完成 请点击预览')
      },
      /* 提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$api.api_req('museum-api/relic/management', 'PUT', this.ruleForm, this.submitFormSuc/*, this.failure */)  // 上传文件到服务器
//            this.$api.api_req('museum-api/file/management', 'POST', this.ruleForm, this.submitFormSuc, this.failure) //
          } else {
            this.$message.error('请确认所填信息是否完善')
            return false
          }
        })
      },
      submitFormSuc(_data) {
        this.$message({type: 'success', message: '提交成功!'})
        this.$router.push({path: '/edit/exhibit/board'})
      },
      // 删除服务器上模型
      deleteModel(name) {
        this.$api.api_forge('oss/v2/buckets/' + BUCKET_KEY + '/objects/' + name, 'DELETE',
          {'Authorization': 'Bearer ' + localStorage.getItem('activeToken')},
          {},
          this.delectObjectSuc/*, this.failure */
        )
      },
      delectObjectSuc(data) {
        console.log(data)
        this.modelFile = null
        this.ruleForm.urn = ''
        this.$message.success('删除成功')
      },
      handlePictureCardPreview(file) {
        this.previewImg = file.url
        this.flag.previewVisiable = true
      },
      overLimit() {
        alert('最大只能传4张预览图')
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      failure(_err) {
        console.log('r_操作失败')
        console.log(_err)
      }
    },
    filters: {
      isNull(target) {
        if (target) {
          return target
        } else {
          return ''
        }
      }
    }
  }
</script>

<style lang="stylus">
  .add-exhibit-wrapper
    width: 100%
    border: 1px solid #e6ebf5;
    background-color: #fff;
    color: #2d2f33;
    border-radius: 4px;
    
    .line-title
      color: #1f2f3d;
      font-size: 22px;
      font-weight: 400;
      border-left 5px solid #409eff
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
    border: 1px solid rgb(235, 235, 235);
    padding: 24px;
    margin: 0 0 14px 14px;
    
    &:hover
      box-shadow: rgba(232, 237, 250, 0.6) 0px 0px 8px 0px, rgba(232, 237, 250, 0.5) 0px 2px 4px 0px;
    
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
