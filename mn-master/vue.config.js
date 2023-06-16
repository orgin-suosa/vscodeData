const path = require('path');
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');
const skeletonRouter = require('./src/skeleton/router');

const isProduction = process.env.NODE_ENV !== 'development';

const externals = {
  vue: 'Vue',
  vuex: 'Vuex',
  'vue-router': 'VueRouter',
  axios: 'axios',
  vant: 'vant',
  vconsole: 'VConsole',
};
const CDN_BACE_URL = process.env.VUE_APP_OSS_URL;
const cdn = {
  css: [`${CDN_BACE_URL}static/js/vant-2.8.css`],
  js: [
    'https://res2.wx.qq.com/open/js/jweixin-1.6.0.js',
    `${CDN_BACE_URL}static/js/vue-2.6.11.js`,
    `${CDN_BACE_URL}static/js/axios-0.19.0.js`,
    `${CDN_BACE_URL}static/js/vuex-3.4.0.js`,
    `${CDN_BACE_URL}static/js/vue-router-3.3.2.js`,
    `${CDN_BACE_URL}static/js/vant.min-2.8.js`,
    `${CDN_BACE_URL}static/js/vconsole-3.3.4.js`,
  ],
};
const commonPlugins = [
  new SkeletonWebpackPlugin({
    webpackConfig: {
      entry: {
        app: path.join(__dirname, './src/skeleton'),
      },
    },
    insertAfter: '<div id="skeleton">',
    quiet: true,
    minimize: true,
    router: skeletonRouter,
  }),
];
module.exports = {
  transpileDependencies: ['@manniu-cli/vue-cli-plugin-manniu-cli-plugin'],
  productionSourceMap: false,
  pluginOptions: {
    manniu: {
      jsSort: [],
      cssSort: [],
      skeletonRoutes: [],
      enableAutoSkeletonRoutes: false,
      routeMode: 'history',
      dpsLimit: 5,
    },
    tinypng: {
      key: '',
    },
  },
  // 开启 Skeleton 的样式分离
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/Theme.scss";',
      },
    },
    extract: true,
  },
  chainWebpack: (config) => {
    // 生产环境注入 cdn
    if (isProduction) {
      config.devtool('none');
      config.plugins.delete('preload');
      config.plugins.delete('prefetch');
      config.plugin('html').tap((args) => {
        args[0].cdn = cdn;
        return args;
      });
    }
  },
  configureWebpack: isProduction ? { plugins: [...commonPlugins], externals: { ...externals } } : { plugins: commonPlugins },
};

module.exports.publicPath = process.env.VUE_APP_ENV === 'development' && process.env.VUE_APP_IS_LOCAL ? process.env.BASE_URL : `${process.env.VUE_APP_OSS_URL}/static${process.env.BASE_URL}`;
