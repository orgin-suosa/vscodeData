module.exports = (cfg) => {
  // 自定义local代理，默认如果为本地开发则代理到localhost:8081,线上调试为VUE_APP_SERVICE_URL
  cfg['/proxy'].target = 'https://agent-test.manniuhealth.com';
  return cfg;
};
