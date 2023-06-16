export default {
  /*
    用法： this.$FT.getUrlKey('article_id', href);
    name, url（必传）
    */
  getUrl: function () {
    // 不含参数
    return window.location.protocol + '//' + window.location.host + '' + window.location.pathname;
  },
  getUrlKey: function (name, url) {
    console.log('videoJump-path', url, location);
    // let path = url == undefined ? location?.href : '';
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ''])[1].replace(/\+/g, '%20')) || null;
  },
  clearArr: function (array) {
    array.length = 0;
    array.splice(0, 0);
  },
  getCurrentPages: function () {
    let pages = getCurrentPages(); // 获取栈实例
    let currentRoute = pages[pages.length - 1].route; // 获取当前页⾯路由
    let currentPage = pages[pages.length - 1]['$page']['fullPath']; //当前页⾯路径(带参数)
    console.log('pushMessage-currentRoute', currentRoute);
    console.log('pushMessage-currentPage', currentPage);
    return currentRoute == currentPage;
  },
   /*
    校验手机号位数
    */
  validatemobile:function(newname) {
    let celVal=/^1\d{10}$/;
    return celVal.test(newname);
  },
  isNull(value) {
    if (value === undefined || value === null || value === '' || value === {} || value === []) {
      return true;
    } else {
      return false;
    }
  },
  returnFloat: function (value) {
    // //强制保留两位小数，不足补零
    var value = Math.round(parseFloat(value) * 100) / 100;
    var s = value.toString().split('.');
    if (s.length == 1) {
      value = value.toString() + '.00';
      return value;
    }
    if (s.length > 1) {
      if (s[1].length < 2) {
        value = value.toString() + '0';
      }
      return value;
    }
  },
  difference: function (beginTime, endTime) {
    const diffDate = {
      dayDiff: '',
      hoursyDiff: '',
      minutesDiff: '',
      minutesDiff: '',
      secondsDiff: '',
    };
    let dateBegin = new Date(beginTime);
    let dateEnd = new Date(endTime);
    let dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
    diffDate.dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
    let leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    diffDate.hoursyDiff = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
    //计算相差分钟数
    let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    diffDate.minutesDiff = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
    //计算相差秒数
    let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    diffDate.secondsDiff = Math.round(leave3 / 1000);
    console.log('相差' + diffDate.dayDiff + '天' + diffDate.hoursyDiff + '小时' + diffDate.minutesDiff + '分钟' + diffDate.secondsDiff + '秒');
    return diffDate;
  },
  timeStamp(ary) {
    let nowDate = new Date();
    let date = {
      year: nowDate.getFullYear(),
      month: nowDate.getMonth() + 1,
      date: nowDate.getDate(),
      hours: nowDate.getHours(),
      minutes: nowDate.getMinutes(),
      seconds: nowDate.getSeconds(),
      screenTimeStamp: '',
    };

    if (parseInt(date.month) < 10) {
      date.month = '0' + date.month;
    }
    if (parseInt(date.date) < 10) {
      date.date = '0' + date.date;
    }
    date.screenTimeStamp = date.year + '' + date.month + '' + date.date + '' + date.hours + '' + date.minutes;
    return date;
    // return	this.addVersion(ary, screenTimeStamp)
  },
  versionKey(ary, screenTimeStamp) {
    let data = this.timeStamp();
    let ver = '?r=' + data.screenTimeStamp;
    return ver;
  },
  addVersion(ary, screenTimeStamp) {
    let data = this.timeStamp();
    let ver = '?r=' + data.screenTimeStamp;
    if (this.getType(ary) == 'string') {
      return ary + ver;
    }
  },
  getType(value) {
    return Object.prototype.toString
      .call(value) // [object Undefined]
      .match(/\s+(\w+)/)[1] // Undefined
      .toLowerCase(); // undefined
  },
  // rpx转px
  rpxToPx(rpx) {
    const screenWidth = uni.getSystemInfoSync().screenWidth;
    return (screenWidth * Number.parseInt(rpx)) / 750;
  },
  // px转rpx
  pxToRpx(px) {
    const screenWidth = uni.getSystemInfoSync().screenWidth;
    return (750 * Number.parseInt(px)) / screenWidth;
  },
  currentRoute() {
    let currentRoutes = getCurrentPages(); // 获取当前打开过的页面路由数组
    let currentRoute = currentRoutes[currentRoutes.length - 1].route; //获取当前页面路由
    let currentParam = currentRoutes[currentRoutes.length - 1].options; //获取路由参数
    // 拼接参数
    let param = '';
    for (let key in currentParam) {
      param += '?' + key + '=' + currentParam[key];
    }
    let localRoute = currentRoute + param;
    return localRoute;
  },
  getSystemInf: function () {
    // 获取手机系统信息
    const info = uni.getSystemInfoSync();
    const data = {
      statusBarHeight: 0,
      navBarHeight: 0,
    };
    // 设置状态栏高度（H5顶部无状态栏小程序有状态栏需要撑起高度）
    data.statusBarHeight = info.statusBarHeight;
    console.log('获取手机系统信息:', info);
    // // 除了h5 app mp-alipay的情况下执行
    // // #ifndef H5
    // // 获取胶囊的位置
    // const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
    // // (胶囊底部高度 - 状态栏的高度) + (胶囊顶部高度 - 状态栏内的高度) = 导航栏的高度
    // data.navBarHeight = menuButtonInfo.bottom - info.statusBarHeight + (menuButtonInfo.top - info.statusBarHeight);

    // // #endif
    return data;
  },
  getFindTime: function (time) {
    var date = new Date(time);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';

    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D;
  },
  /*
  *手机号加密处理
  */
  geTel: function(tel){
      var reg = /^(\d{3})\d{4}(\d{4})$/;  
      return tel.replace(reg, "$1****$2");
  },
  textEncryption:function(value,start,end){
	return value.split('').fill('*',start,end).join('');
 },
  compare: function (key, desc) {
    //key:  用于排序的数组的key值
    //desc： 布尔值，为true是升序排序，false是降序排序
    return function (a, b) {
      let value1 = a[key];
      let value2 = b[key];
      if (desc == true) {
        // 升序排列
        return value1 - value2;
      } else {
        // 降序排列
        return value2 - value1;
      }
    };
  },
};
