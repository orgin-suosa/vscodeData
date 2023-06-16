import $http from 'mn-template/plugins/http';
import axios from 'axios';
const url = getUrl();

const requestApi = {
  // 展业工具
  // 二期街口
  selectPersonOptionList: url + '/rest/withoutToken/acquisition/characterColor/selectPersonOptionList', // 展业工具未完成测评答题信息列表查询
  saveUserAnswerQuestion: url + '/rest/withoutToken/acquisition/characterColor/saveUserAnswerQuestion', // 展业工具客户答题信息保存
  selectPersonRecordDetail: url + '/rest/withoutToken/acquisition/characterColor/selectPersonRecordDetail', // 展业工具客户测评详情查询
  generatePersonRecord: url + '/rest/withoutToken/acquisition/characterColor/generatePersonRecord', // 展业工具客户测评报告生成
  selectIsSignUp: url + '/rest/withoutToken/acquisition/characterColor/selectIsSignUp', // 是否报名

  // // 二期街口
  // selectPersonOptionList: url + '/acquisition/characterColor/selectPersonOptionList', // 展业工具未完成测评答题信息列表查询
  // saveUserAnswerQuestion: url + '/acquisition/characterColor/saveUserAnswerQuestion', // 展业工具客户答题信息保存
  // selectPersonRecordDetail: url + '/acquisition/characterColor/selectPersonRecordDetail', // 展业工具客户测评详情查询
  // generatePersonRecord: url + '/acquisition/characterColor/generatePersonRecord', // 展业工具客户测评报告生成
  // selectIsSignUp: url + '/acquisition/characterColor/selectIsSignUp', // 是否报名

  // 二期街口
  selectAnswerQuestionResultDetailForApp: url + '/acquisition/characterColor/selectAnswerQuestionResultDetailForApp', // 展业工具客户测评报告生成
  selectPersonRecordList: url + '/acquisition/characterColor/selectCharacterColorPersonRecordList', // 展业工具客户测评列表查询
};

// 展业工具
export const selectIsSignUp = (params) => $http.post(requestApi.selectIsSignUp, params); // 是否报名
export const selectPersonOptionList = (params) => $http.post(requestApi.selectPersonOptionList, params); // 展业工具未完成测评答题信息列表查询

// 判断微信用户是否做过问卷
export const getFirstMainId = (params) => $http.post(requestApi.getFirstMainId, params);
const CancelToken = axios.CancelToken;
let cancel;
export function saveUserAnswerQuestion(params) {
  if (cancel) cancel('取消请求');
  return $http({
    url: requestApi.saveUserAnswerQuestion,
    method: 'post',
    data: params,
    cancelToken: new CancelToken((c) => {
      cancel = c;
    }),
  });
}
// 展业工具客户答题信息保存
export const selectPersonRecordList = (params) => $http.post(requestApi.selectPersonRecordList, params); // 展业工具客户测评列表查询
export const selectPersonRecordDetail = (params) => $http.post(requestApi.selectPersonRecordDetail, params); // 展业工具客户测评详情查询
export const selectPersonOptionAnswerFinishList = (params) => $http.post(requestApi.selectPersonOptionAnswerFinishList, params); // 展业工具已完成测评答题情况查询
export const selectAnswerQuestionResultDetailForApp = (params) => $http.post(requestApi.selectAnswerQuestionResultDetailForApp, params); // 展业工具答题并返回结果（APP用）
export const generatePersonRecord = (params) => $http.post(requestApi.generatePersonRecord, params); // 展业工具客户测评报告生成

function getUrl() {
  if (process.env.VUE_APP_IS_LOCAL) {
    return '/agent-h5';
    //  return '';
  } else {
    return '/agent-h5';
  }
}
