let jweixin = require('jweixin-module');
let location = {
  jweixin_get: function (data) {
    console.log('jweixin_get');
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
            console.log('checkjsapi Success');
            // console.log(res);
          },
          fail: function (res) {
            // console.log(res);
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
        console.log('error');
        console.log(res);
        resolve(false);
      });
    });
  },
};

export default location;
