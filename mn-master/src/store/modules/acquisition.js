import { isFirstPk, getEvaluationResult, getPkInfoList, wtSelectAgentBusinessCard } from '@/api/acquisition';
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    // 秒薪
    // 代理人是否是第一次PK
    isFirstPk({ commit }, params) {
      return new Promise((resolve, reject) => {
        isFirstPk(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取测试结果
    getEvaluationResult({ commit }, params) {
      return new Promise((resolve, reject) => {
        getEvaluationResult(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取参与情况
    getPkInfoList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPkInfoList(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取名片信息
    wtSelectAgentBusinessCard({ commit }, params) {
      return new Promise((resolve, reject) => {
        wtSelectAgentBusinessCard(params)
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
