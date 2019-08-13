<template>
  <div class="model-wrapper">
    sdasd
    <br>
    <button @click="getToken">获取初始token</button>
    <br>
    {{activeToken}}
    <br>
    <!--<button @click="createBucket">创建bucket</button>-->
    <br>
    <button @click="checkAllBucket">查看所有bucket</button>
    <br><br>
    <button @click="checkBucket">查看单个bucket</button>
    <br><br>
    <button @click="checkObjects">查看所有object</button>
    <br>

    <br><br>
    <button @click="delectObjec">删除Object</button>
    <br><br>

    <form action="" style="background: #00ff00">
      <input type="file" @change="getFile($event)"><!--@change="mUpload($event)"-->
      <button type="submit" @click="submitFile($event)">提交</button>
    </form>
    <br><br><br><br><br><br><br>

    <button @click="transformFile">转换文件</button>
    <br><br><br><br><br><br><br>

    <button @click="checkTransform">查看转换状态</button>
  </div>
</template>

<script>
  // 需要存到后台
  const ACCOUNT_ID = '564fIM6TfltXLD7AN1AQCOhT9V2GZBGe'
  const ACCOUNT_SECRECT = 'cepTLQSlLyDmz3i1'

  const BUCKET_KEY = 'mbucket1'
  // urn
  // transformdUrn

  // 客户端也需要申请token 来查看

  // 新增模型上传功能
  // relic表中需新增4个字段 urn transformedUrn bucketKey modelName
  // 需更新相关增删改查

  // 以下来不及可以不做
  // 新增2张表
  // 1张专门记 ACCOUNT_ID 和 ACCOUNT_SECRECT
  // 1张记BUCKET_KEY并和relic表关联            (就像img跟relic的关联关系

  const ACTIVE_TOKEN = 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJjbGllbnRfaWQiOiI1NjRmSU02VGZsdFhMRDdBTjFBUUNPaFQ5VjJHWkJHZSIsImV4cCI6MTUxNDMzMjU5Niwic2NvcGUiOlsiZGF0YTpyZWFkIiwiZGF0YTp3cml0ZSIsImJ1Y2tldDpjcmVhdGUiLCJidWNrZXQ6cmVhZCIsImJ1Y2tldDpkZWxldGUiLCJ2aWV3YWJsZXM6cmVhZCJdLCJhdWQiOiJodHRwczovL2F1dG9kZXNrLmNvbS9hdWQvand0ZXhwNjAiLCJqdGkiOiJsQndscjRNOEcyTUdYOUdacmZtTzB3aDdSYWJtMkQ2NzV3d0RHRDVWV3lHdmQ5NmRWeWhhR3RUYzQ0UEpvQWNHIn0.zjtuM1c5AlKZcl-6agp9e7Mzi5CM_2pQU96jeA-AOUs'

  // persistent 永久 transient 暂时
  const BUCKET_TYPE = 'persistent'

  export default {
    created(){
      localStorage.setItem('transformedUrn', btoa('urn:adsk.objects:os.object:mbucket1/27%E4%B8%AA%E7%AB%8B%E6%96%B9%E4%BD%93v5.f3d'))
    },
    data(){
      return {
        activeToken: localStorage.getItem('activeToken'),
        bucketKey: 'mbucket1',
        fileList: [],
        urn: '',
        transformedUrn: '',
        uploadHeaders: {
          'Content-Type': 'application/octet-stream',
          'Authorization': 'Bearer ' + ACTIVE_TOKEN
        },
        file: ''
      }
    },
    methods: {
      // 获取token
      getToken(){
        console.log(Date.now())
//        console.log(parseInt(localStorage.getItem('expires_in')) - parseInt(Date.now()))
        let forceRefresh = true
//        if (!localStorage.getItem('expires_in') || localStorage.getItem('expires_in') < Date.now() || forceRefresh) {
        this.$api.api_forge('authentication/v1/authenticate', 'POST',
          {'Content-Type': 'application/x-www-form-urlencoded'}, // headers
          'client_id=' + ACCOUNT_ID + '&' + 'client_secret=' + ACCOUNT_SECRECT + '&' + 'grant_type=' + 'client_credentials' + '&' + 'scope=' + 'data:read data:write bucket:create bucket:read bucket:delete viewables:read',          // 参数
          this.getTokenSuc, this.failure
        )
//        } else {
//          console.log('token戳未过期')
//        }
      },
      getTokenSuc(data){
        console.log(data)
        this.activeToken = data.data.access_token
        localStorage.setItem('activeToken', data.data.access_token)
//        localStorage.setItem('expires_in', Date.now() + data.data.expires_in * 1000) // 记录过时时间戳
      },
      /*      // 创建bucket
       createBucket(){
       console.log(localStorage.getItem('activeToken'))
       this.$api.api_forge(
       'oss/v2/buckets',
       'POST',
       {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + ACTIVE_TOKEN},
       {bucketKey: this.bucketKey, policyKey: 'transient'},
       this.createBucketSuc,
       this.failure
       )
       },
       createBucketSuc(data){
       this.$message.success(data)
       console.log(data)
       }, */
      // 列出所有bucket
      checkAllBucket(){
        this.$api.api_forge(
          'oss/v2/buckets',
          'GET',
          {'Authorization': 'Bearer ' + localStorage.getItem('activeToken')},
          {},
          this.checkAllBucketSuc,
          this.failure
        )
      },
      checkAllBucketSuc(data){
        console.log(data.data)
      },
      // 查看单个bucket
      checkBucket(){
        this.$api.api_forge(
          'oss/v2/buckets/' + this.bucketKey + '/details',
          'GET',
          {'Authorization': 'Bearer ' + localStorage.getItem('activeToken')},
          {},
          this.checkBucketSuc,
          this.failure
        )
      },
      checkBucketSuc(data){
        this.$message.success(data)
        console.log(data)
      },
      // 查看所有单个bucket中的object
      checkObjects(){
        this.$api.api_forge(
          'oss/v2/buckets/' + BUCKET_KEY + '/objects',
          'GET',
          {'Authorization': 'Bearer ' + localStorage.getItem('activeToken')},
          {},
          this.checkObjectsSuc,
          this.failure
        )
      },
      checkObjectsSuc(data){
        console.log(data.data)
      },
      // 删除单个obj
      delectObjec(){
        this.$api.api_forge(
          'oss/v2/buckets/' + BUCKET_KEY + '/objects/' + 'v1.f3d',
          'DELETE',
          {'Authorization': 'Bearer ' + localStorage.getItem('activeToken')},
          {},
          this.delectObjectSuc,
          this.failure
        )
      },
      delectObjectSuc(data){
        console.log(data.data)
      },
      getFile(event){
        this.file = event.target.files[0]
        console.log(this.file)
      },
      submitFile($event){
        this.$api.api_forge(
          'oss/v2/buckets/' + BUCKET_KEY + '/objects/' + this.file.name,
          'PUT',
          {'Content-Type': 'application/octet-stream', 'Authorization': 'Bearer ' + localStorage.getItem('activeToken')}, // headers
          this.file,          // 参数
          this.mUploadSuc,
          this.failure
        )
      },
      // 上传文件
      mUpload(event){
        console.log(event.target.files[0])
        this.$api.api_forge(
          'oss/v2/buckets/' + BUCKET_KEY + '/objects/' + event.target.files[0].name,
          'PUT',
          {'Content-Type': 'application/octet-stream', 'Authorization': 'Bearer ' + localStorage.getItem('activeToken')}, // headers
          {},          // 参数
          this.mUploadSuc,
          this.failure
        )
      },
      mUploadSuc(data){
        console.log('上传完成')
        console.log(data)
        localStorage.setItem('urn', data.data.objectId)
      },
      // 转换文件
      transformFile(){
        this.$api.api_forge(
          'modelderivative/v2/designdata/job',
          'POST',
          {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('activeToken')}, // headers
          {
            'input': {'urn': btoa(localStorage.getItem('urn'))},
            'output': {'formats': [{'type': 'svf', 'views': ['2d', '3d']}]}
          },          // 参数
          this.transformFileSuc,
          this.failure
        )
      },
      transformFileSuc(data){
        console.log('转换完成')
        console.log(data.data)
        localStorage.setItem('transformedUrn', data.data.urn)
        this.transformedUrn = data.data.urn
        console.log(this.transformedUrn)
      },
      // 查看转换情况
      checkTransform(){
        this.$api.api_forge(
          'modelderivative/v2/designdata' + '/' + localStorage.getItem('transformedUrn') + '/manifest',
          'GET',
          {'Authorization': 'Bearer ' + localStorage.getItem('activeToken')}, // headers
          {},          // 参数
          this.checkTransformSuc,
          this.failure
        )
      },
      checkTransformSuc(data){
        console.log(data.data)
      },
      failure(err){
        console.log(err)
      }
    }
  }
</script>

<style lang="stylus">
  .model-wrapper
    font-size: 14px
</style>
