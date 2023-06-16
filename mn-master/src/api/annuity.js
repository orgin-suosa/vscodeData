import $http from 'mn-template/plugins/http';
import axios from 'axios';
const url = getUrl();
const card = getCard();

const requestApi = {
  // 养老金
  saveAppAnnuity: url + '/acquisition/annuity/saveAppAnnuity', // 养老金信息保存-app
  getAppPensionResult: url + '/acquisition/annuity/getAppPensionResult', // 获取养老金结果-APP
  getPensionResult: url + '/acquisition/annuity/getPensionResult', // 获取养老金结果-h5
  saveAnnuity: url + '/acquisition/annuity/saveAnnuity', // 养老金信息保存-h5
  // 长沙名片
  wtSelectAgentBusinessCard: card + '/wx/bizcard/summary/', //  微信端名片
};

// 养老金
export const saveAppAnnuity = (params) => $http.post(requestApi.saveAppAnnuity, params); // 养老金信息保存-app
export const getAppPensionResult = (params) => $http.post(requestApi.getAppPensionResult, params); // 获取养老金结果-APP
export const getPensionResult = (params) => $http.post(requestApi.getPensionResult, params); //  获取养老金结果-h5
export const saveAnnuity = (params) => $http.post(requestApi.saveAnnuity, params); // 养老金信息保存-h5
export const wtSelectAgentBusinessCard = (params) => $http.get(requestApi.wtSelectAgentBusinessCard, params); // 微信端名片

const CancelToken = axios.CancelToken;
let cancel;
export function saveExamRecord(params) {
  if (cancel) cancel('取消请求');
  return $http({
    url: requestApi.saveExamRecord,
    method: 'post',
    data: params,
    cancelToken: new CancelToken((c) => {
      cancel = c;
    }),
  });
}

function getUrl() {
  if (process.env.VUE_APP_IS_LOCAL) {
    return '/agent-h5';
    // return '';
  } else {
    return '/agent-h5';
  }
}
function getCard() {
  if (process.env.VUE_APP_IS_LOCAL) {
    return '/agent-h5/agent-bizcard';
  } else {
    return '/agent-app-gateway/agent-h5/agent-bizcard';
  }
}
