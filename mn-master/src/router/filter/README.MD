该目录放置需要自定义路由过滤器（守卫）的文件。该目录会被自动加载。

默认加载:
* `BudpParamsFilter` 中台参数过滤器
* `ToRootFilter` 清空路由栈并跳转到指定路由为当前首页

例如:
```js
import {AbstractRouterFilter} from '@manniu-cli/manniu-cli-framework';
export default class Demo extends AbstractRouterFilter {
    onBefore (to, from) {
        console.log(`from ${from.path} to ${to.path}`);
    }
}
```

如需要排除默认加载过滤器：
```js
import {BudpParamsFilter} from '@manniu-cli/manniu-cli-framework';
// 禁用中台过滤器
BudpParamsFilter.property.matches = () => false;
```
