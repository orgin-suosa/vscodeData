import {
  selectPersonOptionList,
  saveUserAnswerQuestion,
  selectPersonRecordList,
  selectPersonRecordDetail,
  selectPersonOptionAnswerFinishList,
  selectAnswerQuestionResultDetailForApp,
  generatePersonRecord,
  selectIsSignUp,
} from '@/api/character';
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
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
    // 是否报名
    selectIsSignUp({ commit }, params) {
      return new Promise((resolve, reject) => {
        selectIsSignUp(params)
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
  },
};
