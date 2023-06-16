```js
import { router } from '@manniu-cli/vue-cli-plugin-manniu-cli-plugin/auto';
import Index from '@/views/demo.vue';

const routerConfig = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '*',
    redirect: process.env.VUE_APP_BASE_ROUTE
  }
];

router.addRoutes(routerConfig);
```

```js
// vue.config.js
module.exports = {
  transpileDependencies: [
    '@manniu-cli/vue-cli-plugin-manniu-cli-plugin'
  ],
  pluginOptions: {
    manniu: {
      jsSort: [],
      cssSort: [],
      // 配置骨架屏路由
      skeletonRoutes: [
        {
          path: '',
          name: 'Index',
          meta: {
            skeleton: true
          }
        }
      ],
      enableAutoSkeletonRoutes: false,
      routeMode: 'history',
      dpsLimit: 5
    },
    tinypng: {
      key: ''
    }
  }
};

module.exports.publicPath = process.env.VUE_APP_OSS_URL + '/static' + process.env.BASE_URL;
```
