import {
  selectBaseinfoDetail,
  selectBaseinfoShare,
  selectQuestionList,
  selectPersonOptionList,
  saveUserAnswerQuestion,
  selectPersonRecordList,
  selectPersonRecordDetail,
  selectPersonOptionAnswerFinishList,
  selectAnswerQuestionResultDetailForApp,
  generatePersonRecord,
  getShareInfoList,
  getAgentParticipate,
  saveAppAnswerQuestion,
  saveRecord,
} from '@/api/challenge';
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    // 展业工具首页信息查询
    selectBaseinfoDetail({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectBaseinfoDetail(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 展业工具分享设置查询
    selectBaseinfoShare({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectBaseinfoShare(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 展业工具题目列表查询
    selectQuestionList({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectQuestionList(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 展业工具未完成测评答题信息列表查询
    selectPersonOptionList({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectPersonOptionList(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 展业工具客户答题信息保存
    saveUserAnswerQuestion({ commit }, params) {
      return new Promise((resolve, reject) => {
        saveUserAnswerQuestion(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 展业工具客户测评列表查询
    selectPersonRecordList({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectPersonRecordList(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 展业工具客户测评详情查询
    selectPersonRecordDetail({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectPersonRecordDetail(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 展业工具已完成测评答题情况查询
    selectPersonOptionAnswerFinishList({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectPersonOptionAnswerFinishList(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 展业工具答题并返回结果（APP用）
    selectAnswerQuestionResultDetailForApp({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectAnswerQuestionResultDetailForApp(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 展业工具客户测评报告生成
    generatePersonRecord({ commit }, params) {
      return new Promise((resolve, reject) => {
        generatePersonRecord(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 获取分享信息列表
    getShareInfoList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getShareInfoList(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 代理人参与情况列表信息
    getAgentParticipate({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAgentParticipate(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 展业工具代理人答题信息保存
    saveAppAnswerQuestion({ commit }, params) {
      return new Promise((resolve, reject) => {
        saveAppAnswerQuestion(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 保存展业的转发/浏览次数
    saveRecord({ commit }, params) {
      return new Promise((resolve, reject) => {
        saveRecord(params)
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
