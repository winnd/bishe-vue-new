<template>
  <div class="view-wrapper">
    <div id="MyViewerDiv">asdfasdfasdf</div>
  </div>
</template>

<script>
  const ACCOUNT_ID = '564fIM6TfltXLD7AN1AQCOhT9V2GZBGe'
  const ACCOUNT_SECRECT = 'cepTLQSlLyDmz3i1'

  export default {
    created(){
      // 获取token
      this.$api.api_forge('authentication/v1/authenticate', 'POST',
        {'Content-Type': 'application/x-www-form-urlencoded'}, // headers
        'client_id=' + ACCOUNT_ID + '&' + 'client_secret=' + ACCOUNT_SECRECT + '&' + 'grant_type=' + 'client_credentials' + '&' + 'scope=' + 'data:read data:write bucket:create bucket:read bucket:delete viewables:read',          // 参数
        this.getTokenSuc, this.failure)

      this.urn = 'urn:' + this.$route.query.transformedUrn

//      curl
//      -v 'https://developer.api.autodesk.com/authentication/v1/authenticate'
//      -X 'POST'
//      -H 'Content-Type: application/x-www-form-urlencoded'
//      -d 'client_id=<your-Client ID>&' +
//      'client_secret=<your-Client Secret>&' +
//      'grant_type=client_credentials&scope=data:read data:write bucket:create bucket:read'
    },
    data(){
      return {
        viewer: null,
        options: {
          env: 'AutodeskProduction',
          accessToken: ''
        }
      }
    },
    methods: {
      // 获取token
      getTokenSuc(data){
        this.options.accessToken = data.data.access_token
        Autodesk.Viewing.Initializer(this.options, () => {
          Autodesk.Viewing.Document.load(this.urn, this.onDocumentLoadSuccess, this.onDocumentLoadFailure)
        })
      },
      onDocumentLoadSuccess(doc){
        // A document contains references to 3D and 2D viewables.
        let viewables = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {'type': 'geometry'}, true)
        if (viewables.length === 0) {
          console.error('Document contains no viewables.')
          return 0
        }

        // Choose any of the avialble viewables
        let initialViewable = viewables[0]
        let svfUrl = doc.getViewablePath(initialViewable)
        let modelOptions = {
          sharedPropertyDbPath: doc.getPropertyDbPath()
        }

        let viewerDiv = document.getElementById('MyViewerDiv')
        this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv)
        this.viewer.start(svfUrl, modelOptions, this.onLoadModelSuccess, this.onLoadModelError)
      },
      // viewer.loadModel() success callback.
      onLoadModelSuccess(model){
//        console.log('onLoadModelSuccess()!')
//        console.log('Validate model loaded: ' + (this.viewer.model === model))
//        console.log(model)
      },
      onLoadModelError(viewerErrorCode){
        console.error('onLoadModelError() - errorCode:' + viewerErrorCode)
      },
      onDocumentLoadFailure(viewerErrorCode){
        console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode)
      },
      failure(_err){
        console.log('r_操作失败')
        console.log(_err)
      }
    }
  }
</script>

<style>
  .view-wrapper {
    display: flex;
    height: 100%;
    width: 100%;
  }

  #MyViewerDiv {
    height: 100%;
    width: 100%;
    background-color: #F0F8FF;
    position: relative;
  }
</style>
