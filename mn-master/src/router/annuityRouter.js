export default [
  // 测试详情
  {
    path: '/annuity',
    name: 'OldAgePension',
    meta: {
      keepAlive: true,
      title: '养老金测算器',
      hasBack: false,
    },
    component: () => import('@/views/business/annuity/index'),
  },
];
