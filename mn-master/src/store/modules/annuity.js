import { saveAppAnnuity, getAppPensionResult, getPensionResult, saveAnnuity, wtSelectAgentBusinessCard } from '@/api/annuity';
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    // 养老金信息保存-app
    saveAppAnnuity({ commit }, params) {
      return new Promise((resolve, reject) => {
        saveAppAnnuity(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取养老金结果-APP
    getAppPensionResult({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAppPensionResult(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取养老金结果-h5
    getPensionResult({ commit }, params) {
      return new Promise((resolve, reject) => {
        getPensionResult(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 养老金信息保存-h5
    saveAnnuity({ commit }, params) {
      return new Promise((resolve, reject) => {
        saveAnnuity(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    //  微信端名片
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
