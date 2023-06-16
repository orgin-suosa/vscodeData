import $http from 'mn-template/plugins/http';

const url = process.env.VUE_APP_AGENT_BASE_CONTENT_PATH;

const publicApi = {
  generateCipher: '/maniujk-cipher/cipher/generate', // 加密
  getAppId: url + '/rest/withoutToken/getAppId', // 获取appID getAppId
  weixinByCode: url + '/rest/withoutToken/weixinByCode', // 获取微信用户信息
  getSignature: url + '/rest/withoutToken/getSignature', // 获取微信签名 getSignature
};
// 加密
export const generateCipher = (params) => $http.post(publicApi.generateCipher, params);

// 获取appID
export const getAppId = (params) => $http.post(publicApi.getAppId, params);

// 获取个人信息 weixinByCode
export const weixinByCode = (params) => $http.get(publicApi.weixinByCode, params);

// 获取微信签名 getSignature
export const getSignature = (params) => $http.post(publicApi.getSignature, params);
