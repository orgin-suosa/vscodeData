import $http from 'mn-template/plugins/http';

// 设置axios默认属性
$http.setDefaults({
  headers: {
    demo: 'Alone',
  },
});

// 设置http配置信息 loading、error、clear、encrypt、mockUserInfo
$http.setOptions({
  gateway: '/agent-app-gateway',
  loading(config, msg) {
    // loading不要默认的
  },
  // error(response) {
  //   console.log('response', response);
  // },
  clear() {
    // clear不要默认的
  },
});

// 新增前置钩子
$http.addBeforeHook((config) => {}, 0);

// 新增后置钩子
$http.addAfterHook((response) => {});
