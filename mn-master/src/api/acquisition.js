import $http from 'mn-template/plugins/http';
import axios from 'axios';
const url = getUrl();
const card = getCard();

const requestApi = {
  // 展业工具
  getExhibitionList: url + '/acquisition/getExhibitionList', // 获取展业列表工具
  saveFrequency: url + '/rest/withoutToken/acquisition/saveFrequency', // 保存展业的转发/浏览次数
  // saveFrequency: url + '/acquisition/saveFrequency', // 保存展业的转发/浏览次数
  // 秒薪
  isFirstPk: url + '/rest/withoutToken/acquisition/isFirstPk', // 代理人是否是第一次PK
  getEvaluationResult: url + '/rest/withoutToken/acquisition/getEvaluationResult', // 获取测试结果
  getPkInfoList: url + '/acquisition/getPkInfoList', // 获取参与情况
  // isFirstPk: url + '/acquisition/isFirstPk', // 代理人是否是第一次PK
  // getEvaluationResult: url + '/acquisition/getEvaluationResult', // 获取测试结果

  // 性向测试
  queryParticipation: url + '/acquisition/queryParticipation', // 参与情况
  getAnswerResult: url + '/acquisition/getAnswerResult', // h5-app内获取答题结果
  saveExamRecord: url + '/rest/withoutToken/acquisition/saveExamRecord', // 保存测试记录
  queryAnswerRecord: url + '/rest/withoutToken/acquisition/queryAnswerRecord', // 查询答题历史、测评结果
  queryCharacterPersonInfo: url + '/rest/withoutToken/acquisition/queryCharacterPersonInfo', // 查询是否第一次测试
  generateAptitudeTestResult: url + '/rest/withoutToken/acquisition/generateAptitudeTestResult', // h5-生成测评报告
  // saveExamRecord: url + '/acquisition/saveExamRecord', // 保存测试记录
  // queryAnswerRecord: url + '/acquisition/queryAnswerRecord', // 查询答题历史、测评结果
  // queryCharacterPersonInfo: url + '/acquisition/queryCharacterPersonInfo', // 查询是否第一次测试
  // generateAptitudeTestResult: url + '/acquisition/generateAptitudeTestResult', // h5-生成测评报告

  // 长沙名片
  wtSelectAgentBusinessCard: card + '/wx/bizcard/summary', //  微信端名片
  // 注册
  getCode: url + '/rest/withoutToken/gold/sendVerifyCodeToMobile', // 获取手机验证码
  getImgCode: url + '/rest/withoutToken/gold/getPicValidateCode', // 获取图形验证码
  submitInfo: url + '/rest/withoutToken/gold/goldSignUp', // 提交报名信息
  // getCode: url + '/gold/sendVerifyCodeToMobile', // 获取手机验证码
  // getImgCode: url + '/gold/getPicValidateCode', // 获取图形验证码
  // submitInfo: url + '/gold/goldSignUp', // 提交报名信息

  // FPA 性格色彩测试
  getCustomerList: url + '/app/entry/list', // 获取参与列表
  FPASubmitInfo: url + '/wx/apply', // 提交报名信息
  // checkStatus: url + '/acquisition/characterColor/selectPersonOptionList', // 根据微信OpenId 查询答题完成情况
  selectPersonOptionList: url + '/acquisition/characterColor/selectPersonOptionList', // 根据微信OpenId 查询答题完成情况
  getSubjects: url + '/wx/problems', // 获取题库
  saveResult: url + '/acquisition/characterColor/saveUserAnswerQuestion', // 保存结果
  // getFirstMainId: url + '/gold/getFirstMainId', // 判断微信用户是否做过问卷
  getFirstMainId: url + '/acquisition/characterColor/selectIsSignUp', // 是否报名
  generatePersonRecord: url + ' /acquisition/characterColor/generatePersonRecord', // 展业工具性格色彩客户测评报告生成
  selectPersonRecordList: url + '/acquisition/characterColor/selectPersonRecordList', // 展业工具性格色彩客户测评列表查询
  selectPersonRecordDetail: url + '/acquisition/characterColor/selectPersonRecordDetail', // 展业工具性格色彩客户测评详情查询

  // FPA  微信
  // FPAGetCode: url +  `${BASE_URL}/mobile/sendVerifyCodeToMobile`, // 获取手机验证码
  // FPAgGtImgCode: url +  `${BASE_URL}/mobile/getImageVerifyCode`, // 获取图形验证码
  // getCode: url + '/gold/sendVerifyCodeToMobile', // 获取手机验证码
  // getImgCode: url + '/gold/getPicValidateCode', // 获取图形验证码
  // submitInfo: url + '/gold/goldSignUp', // 提交报名信息
};

// 展业工具
export const getExhibitionList = (params) => $http.post(requestApi.getExhibitionList, params); // 获取展业列表工具
export const saveFrequency = (params) => $http.post(requestApi.saveFrequency, params); // 保存展业的转发/浏览次数
// 秒薪
export const isFirstPk = (params) => $http.post(requestApi.isFirstPk, params); // 代理人是否是第一次PK
export const getEvaluationResult = (params) => $http.post(requestApi.getEvaluationResult, params); // 获取测试结果
export const getPkInfoList = (params) => $http.post(requestApi.getPkInfoList, params); // 获取参与情况
// 性向测试
export const queryParticipation = (params) => $http.post(requestApi.queryParticipation, params); // 参与情况
export const getAnswerResult = (params) => $http.post(requestApi.getAnswerResult, params); // h5-app内获取答题结果
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
} // 保存测试记录
export const queryAnswerRecord = (params) => $http.post(requestApi.queryAnswerRecord, params); // 查询答题历史、测评结果
export const queryCharacterPersonInfo = (params) => $http.post(requestApi.queryCharacterPersonInfo, params); // 查询答题历史、测评结果
export const generateAptitudeTestResult = (params) => $http.post(requestApi.generateAptitudeTestResult, params); // h5-生成测评报告

// 注册
export const getImgCode = (params) => $http.post(requestApi.getImgCode, params); // 获取图形验证码
export const getCode = (params) => $http.post(requestApi.getCode, params); // 获取手机验证码
export const submitInfo = (params) => $http.post(requestApi.submitInfo, params); // 提交报名信息
// 长沙名片
export const wtSelectAgentBusinessCard = (params) => $http.get(requestApi.wtSelectAgentBusinessCard, params);

// FPA 性格色彩测试
// 获取参与列表
export const getCustomerList = (params) => $http.post(requestApi.getCustomerList, params);
// 提交报名信息
export const FPASubmitInfo = (params) => $http.post(requestApi.FPASubmitInfo, params);
// 根据openId获取答题情况
export const checkStatus = (params) => $http.get(`${requestApi.checkStatus}/${params.openid}`);
// 展业工具性格色彩测评情况及答题信息查询
export const selectPersonOptionList = (params) => $http.post(requestApi.selectPersonOptionList, params);
// 获取题库
export const getSubjects = () => $http.get(requestApi.getSubjects);
// 保存结果
export const saveResult = (params) => $http.post(requestApi.saveResult, params);
// 判断微信用户是否做过问卷
export const getFirstMainId = (params) => $http.post(requestApi.getFirstMainId, params);
// 是否报名
export const selectIsSignUp = (params) => $http.post(requestApi.selectIsSignUp, params);

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
    return '/agent-h5/agent-bizcard';
  }
}
