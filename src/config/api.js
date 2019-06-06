import axios from 'axios'
// require('es6-promise').polyfill()

// const HOST = 'localhost:8080/'  // 本地端口
// const HOST = 'http://115.29.140.80:8080/'
const HOST = 'http://localhost:8082/'
const FORGE_HOST = 'https://developer.api.autodesk.com/'

export default {
  api_path(){
    return HOST
  },
  api_req(url, method = 'POST', params, success, failure, logicErr){
    axios({
      method: method,
      url: HOST + url,
      data: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'authorization': localStorage.getItem('token')
      },
      // withCredentials: true,
      crossDomain: true
    }).then(res => {
      if (success) {
        if (res.data.status.toString() === '0') {
          success(res.data)
        } else if (logicErr) {
          logicErr(res.data.message)
        }
      } else {
        console.wran('r_:axios的接受成功suc回调函数未定义')
      }
    }).catch((err) => {
      failure(err)
    })
  },
  api_base(url, method = 'POST', params, success, failure, signs){
    axios({
      method: method,
      url: HOST + url,
      data: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      },
      // withCredentials: true,
      crossDomain: true
    }).then(res => {
      if (success) {
        if (res.data.status === '200') {
          success(res.data)
        } else {
          console.log(res.data.message)
        }
      } else {
        console.wran('r_:axios的接受成功suc回调函数未定义')
      }
    }).catch((err) => {
      failure(err)
    })
  },
  api_forge(url, method = 'POST', headers, params, success, failure, signs){
    axios({
      method: method,
      url: url,
      data: params,
      headers: headers,
      widthCredentials: true,
      crossDomain: true
    }).then(res => {
      if (success) {
        // console.log('交互成功')
        // console.log(res)
        success(res)
      } else {
        console.log('交互失败')
        console.log(res)
      }
    }).catch(err => {
      failure(err)
    })
  }
}
