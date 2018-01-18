<template>
  <div class="view-wrapper">
    <div id="MyViewerDiv"></div>
  </div>
</template>

<script>
  const ACTIVE_TOKEN = localStorage.getItem('activeToken')
  const URN = 'urn:' + localStorage.getItem('transformedUrn')
  export default {
    created(){
      console.log(URN)
      Autodesk.Viewing.Initializer(this.options, () => {
        Autodesk.Viewing.Document.load(URN, this.onDocumentLoadSuccess, this.onDocumentLoadFailure)
      })
    },
    data(){
      return {
        viewer: null,
        options: {
          env: 'AutodeskProduction',
          accessToken: ACTIVE_TOKEN
        }
      }
    },
    methods: {
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
        console.log('onLoadModelSuccess()!')
        console.log('Validate model loaded: ' + (this.viewer.model === model))
        console.log(model)
      },
      onLoadModelError(viewerErrorCode){
        console.error('onLoadModelError() - errorCode:' + viewerErrorCode)
      },
      onDocumentLoadFailure(viewerErrorCode){
        console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode)
      }
    }
  }
</script>

<style>
  @import "/static/css/style.min.css";

  .view-wrapper {
    display: flex;
    height: 100%;
    width: 100%;
  }

  .view-box {
    flex: 1;
  }

  #MyViewerDiv {
    height: 100%;
    width: 100%;
    background-color: #F0F8FF;
    position: relative;
  }
</style>
