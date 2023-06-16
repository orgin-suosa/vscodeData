import $http from 'mn-template/plugins/http';

// 获取亲友列表
export const listRelatives = () => $http.post('/device-link-consumer/measureBloodPressure/listPage', {
  pageIndex: 1,
  pageSize: 10,
  ifOwnData: true,
  measureUser: null
});

// 新增亲友
export const list = params => $http.get('/aaa/bbb', params);
