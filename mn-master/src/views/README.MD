该目录下放置需要路由的页面
> 如开启自动创建路由配置，则会自动把该目录的vue文件自动配置到routers。

#### 以__（两个下划线，例如__foo __.vue）开头和结尾的目录和文件将被忽略。
例如：
```
views/
├── __partial__.vue
├── index.vue
├── users.vue
└── users/
    └── _id.vue
```

自动生成路由：
```js
export default [
  {
    name: 'index',
    path: '/',
    component: () => import('@/views/index.vue')
  },
  {
    name: 'users',
    path: '/users',
    component: () => import('@/views/users.vue'),
    children: [
      {
        name: 'users-id',
        path: ':id?',
        component: () => import('@/views/users/_id.vue')
      }
    ]
  }
]
```
如果路由页面采用分文件方式：template 为.vue文件，scss为样式等：
```
views/
└── users/
    └── index.vue
```
自动生成路由：
```js
export default [
  {
    name: 'users',
    path: '/users',
    component: () => import('@/views/users/index.vue')
  }
]
```

如果要使路由参数为必须，则创建一个该参数的目录，然后在该目录中添加`index.vue`。 在上面的示例中，如果将`users/_id.vue`替换为`users/_id/index.vue`，则需要：`id`参数。

### <route> 自定义标签块

如果页面组件有<route>自定义标签块，则该标签内的内容json将与route config合并。

例如，如果index.vue具有以下<route>块：

```vue
<route>
{
  "name": "home",
  "meta": {
    "requiresAuth": true
  }
}
</route>

<template>
  <h1>Hello</h1>
</template>
```

生成的路由配置如下:
```js
module.exports = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/views/index.vue'),
    meta: {
      requiresAuth: true
    }
  }
]
```
