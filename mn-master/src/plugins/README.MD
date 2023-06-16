该目录放置Vue第三方插件初始化的文件。该目录会被自动加载。

例如：
```js
import Vue from 'vue';
import { Plugin } from 'vue-fragment';

Vue.use(Plugin);
Vue.property.$test = 'manniu';
```
