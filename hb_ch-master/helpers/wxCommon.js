let jweixin = require('jweixin-module');
export default {
  /**  动态生成标签
    *   info参数
    *     let info={
        eleId:"", // 元素ID
        appid:"", // 小程序id号 gh_****
        url:"", // 跳转小程序的页面路径地址 例: pages/home/home - (后面必须带上.html后缀 否则IOS跳转时出现小程序页面未配置)
         content:"" // html字符串 例: "<button>点我</button>"
       }
    */
  wx_launch(info) {
    let that = this;
    if (!that.isWechat()) {
      return;
    }
    if (that.is_version()) {
      var btn = document.querySelector(info.eleId); //获取元素
      let script = document.createElement('script'); // 创建script内容插槽 避免template标签冲突
      script.type = 'text/wxtag-template'; // 使用script插槽 必须定义这个type
      script.text = info.content; // 自定义的html字符串内容    style="width:100%;text-align: center; background-color: #ffffff; padding: 10rpx 0;"
      let html = `<wx-open-launch-weapp username="${info.appid}" path="${info.url}">${script.outerHTML}</wx-open-launch-weapp>`;
      btn.innerHTML = html; // html字符串赋值
      // 点击按钮 正常跳转触发
      btn.addEventListener('launch', function (e) {
        console.log('success');
      });
      // 点击跳转 抛出异常
      btn.addEventListener('error', function (e) {
        console.log('fail', e.detail);
        alert(`跳转异常 - ${e.detail}`);
      });
    } else {
      alert('您的版本号不支持');
    }
  },

  // 判断当前微信版本号是否支持
  is_version() {
    let client = false; // 当前版本号是否支持 (默认不支持)
    let wxInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i); // 微信浏览器信息
    console.log('微信版本号', wxInfo);
    // 微信版本号 wxInfo[1] = "7.0.18.1740" (示例)
    //进行split转成数组进行判断 [7,0,18,1740] (示例)
    let version = wxInfo[1].split('.');
    // 判断版本在7.0.12及以上的版本
    if (version[0] <= 7) {
      if ((version[1] = 0)) {
        if (version[2] >= 12) {
          client = true; // 当前版本支持
        }
      } else {
        client = true; // 当前版本支持
      }
    } else {
      client = true; // 当前版本支持
    }
    return client;
  },
  jweixin_get: function (data) {
    console.log('jweixin_get', data);
    return new Promise((resolve, reject) => {
      jweixin.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: ['getLocation'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        openTagList: ['wx-open-launch-weapp'], // 微信开放标签 小程序跳转按钮
      });
      jweixin.ready(function () {
        jweixin.checkJsApi({
          jsApiList: ['getLocation'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: function (res) {
            console.log('初始化微信SDK Success', res);
            // console.log(res);
          },
          fail: function (res) {
            console.log('初始化微信SDK fail', res);
            resolve(false);
          },
        });
        jweixin.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            resolve(res);
          },
          fail: function (res) {
            resolve(false);
          },
        });
      });

      jweixin.error(function (res) {
        console.log('初始化微信SDK error', res);
        console.log(res);
        resolve(false);
      });
    }).catch(err=>{
		console.log("初始化微信SDK -catch",err)
         alert(err) 
		 });
  },
};
