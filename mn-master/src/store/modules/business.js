import { getExhibitionList, saveFrequency, getCode, getImgCode, submitInfo } from '@/api/acquisition';
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    // 展业工具
    // 获取展业列表工具
    getExhibitionList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getExhibitionList(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 保存展业的转发/浏览次数
    saveFrequency({ commit }, params) {
      return new Promise((resolve, reject) => {
        saveFrequency(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取手机验证码
    getCode({ commit }, params) {
      return new Promise((resolve, reject) => {
        getCode(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取图形验证码
    getImgCode({ commit }, params) {
      return new Promise((resolve, reject) => {
        getImgCode(params)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 提交报名信息
    submitInfo({ commit }, params) {
      return new Promise((resolve, reject) => {
        submitInfo(params)
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
