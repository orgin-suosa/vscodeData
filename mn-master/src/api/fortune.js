import $http from 'mn-template/plugins/http';

const service = '/agent-h5';

// 提交测评问卷
export function postReviewAndGetResult(params) {
  return $http.post(service + '/rest/withoutToken/gold/goldResultInfo', params);
}

// 测评历史列表
export function getGoldInfoList(params) {
  return $http.post(service + '/gold/getGoldInfo', params);
}
// 测评情况弹框
export function getGoldwPopupEvaluation(params) {
  return $http.post(service + '/gold/getGoldConditionDetail', params);
}
// 测评结果弹框
export function getGoldPopupResult(params) {
  return $http.post(service + '/gold/getGoldResultDetail', params);
}
// 判断微信用户是否做过问卷
export function getFirstMainId(params) {
  return $http.post(service + '/gold/getFirstMainId', params);
}
