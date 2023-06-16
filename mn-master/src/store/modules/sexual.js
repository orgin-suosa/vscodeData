import { queryParticipation, saveExamRecord, queryAnswerRecord, queryCharacterPersonInfo, getAnswerResult, generateAptitudeTestResult } from '@/api/acquisition';
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    // 性向测试
    // 参与情况
    queryParticipation({ commit }, params) {
      return new Promise((resolve, reject) => {
        queryParticipation(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 保存测试记录
    saveExamRecord({ commit }, params) {
      return new Promise((resolve, reject) => {
        saveExamRecord(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 查询答题历史、测评结果
    queryAnswerRecord({ commit }, params) {
      return new Promise((resolve, reject) => {
        queryAnswerRecord(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 查询答题历史、测评结果
    queryCharacterPersonInfo({ commit }, params) {
      return new Promise((resolve, reject) => {
        queryCharacterPersonInfo(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // h5-app内获取答题结果
    getAnswerResult({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAnswerResult(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // h5-生成测评报告
    generateAptitudeTestResult({ commit }, params) {
      return new Promise((resolve, reject) => {
        generateAptitudeTestResult(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};
