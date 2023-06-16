import $http from 'mn-template/plugins/http';
import axios from 'axios';
const url = getUrl();

const requestApi = {
  // 展业工具
  selectBaseinfoDetail: url + '/rest/withoutToken/acquisition/acquisitionTool/selectBaseinfoDetail', // 展业工具首页信息查询
  selectBaseinfoShare: url + '/rest/withoutToken/acquisition/acquisitionTool/selectBaseinfoShare', // 展业工具分享设置查询
  selectQuestionList: url + '/rest/withoutToken/acquisition/acquisitionTool/selectQuestionList', // 展业工具题目列表查询
  selectPersonOptionList: url + '/rest/withoutToken/acquisition/acquisitionTool/selectPersonOptionList', // 展业工具未完成测评答题信息列表查询
  saveUserAnswerQuestion: url + '/rest/withoutToken/acquisition/acquisitionTool/saveUserAnswerQuestion', // 展业工具客户答题信息保存
  selectPersonRecordDetail: url + '/rest/withoutToken/acquisition/acquisitionTool/selectPersonRecordDetail', // 展业工具客户测评详情查询
  generatePersonRecord: url + '/rest/withoutToken/acquisition/acquisitionTool/generatePersonRecord', // 展业工具客户测评报告生成

  // selectBaseinfoDetail: url + '/acquisition/acquisitionTool/selectBaseinfoDetail', // 展业工具首页信息查询
  // selectBaseinfoShare: url + '/acquisition/acquisitionTool/selectBaseinfoShare', // 展业工具分享设置查询
  // selectQuestionList: url + '/acquisition/acquisitionTool/selectQuestionList', // 展业工具题目列表查询
  // selectPersonOptionList: url + '/acquisition/acquisitionTool/selectPersonOptionList', // 展业工具未完成测评答题信息列表查询
  // saveUserAnswerQuestion: url + '/acquisition/acquisitionTool/saveUserAnswerQuestion', // 展业工具客户答题信息保存
  // selectPersonRecordDetail: url + '/acquisition/acquisitionTool/selectPersonRecordDetail', // 展业工具客户测评详情查询
  // generatePersonRecord: url + '/acquisition/acquisitionTool/generatePersonRecord', // 展业工具客户测评报告生成

  selectPersonRecordList: url + '/acquisition/acquisitionTool/selectPersonRecordList', // 展业工具客户测评列表查询
  selectPersonOptionAnswerFinishList: url + '/acquisition/acquisitionTool/selectPersonOptionAnswerFinishList', // 展业工具已完成测评答题情况查询
  selectAnswerQuestionResultDetailForApp: url + '/acquisition/acquisitionTool/selectAnswerQuestionResultDetailForApp', // 展业工具客户测评报告生成

  // 配置测评
  getShareInfoList: url + '/acquisition/acquisitionTool/getShareInfoList', // 获取分享信息列表
  getAgentParticipate: url + '/acquisition/acquisitionTool/getAgentParticipate', // 代理人参与情况列表信息
  saveAppAnswerQuestion: url + '/acquisition/acquisitionTool/saveAppAnswerQuestion', // 展业工具代理人答题信息保存
  saveRecord: url + '/acquisition/acquisitionTool/saveRecord', // 保存展业的转发/浏览次数
};

// 展业工具
export const selectBaseinfoDetail = (params) => $http.post(requestApi.selectBaseinfoDetail, params); // 展业工具首页信息查询
export const selectBaseinfoShare = (params) => $http.post(requestApi.selectBaseinfoShare, params); // 展业工具分享设置查询
export const selectQuestionList = (params) => $http.post(requestApi.selectQuestionList, params); // 展业工具题目列表查询
export const selectPersonOptionList = (params) => $http.post(requestApi.selectPersonOptionList, params); // 展业工具未完成测评答题信息列表查询
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

// 配置测评
export const getShareInfoList = (params) => $http.post(requestApi.getShareInfoList, params); // 获取分享信息列表
export const getAgentParticipate = (params) => $http.post(requestApi.getAgentParticipate, params); // 代理人参与情况列表信息
export const saveAppAnswerQuestion = (params) => $http.post(requestApi.saveAppAnswerQuestion, params); // 展业工具代理人答题信息保存
export const saveRecord = (params) => $http.post(requestApi.saveRecord, params); // 保存展业的转发/浏览次数

function getUrl() {
  if (process.env.VUE_APP_IS_LOCAL) {
    return '/agent-h5';
    // return '';
  } else {
    return '/agent-h5';
  }
}
