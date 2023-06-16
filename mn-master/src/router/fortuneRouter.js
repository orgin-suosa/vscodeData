export default [
  // 性向测试
  {
    path: '/fortune',
    name: 'Fortune',
    meta: { title: '朋友圈财富金矿知多少' },
    component: () => import('@/views/business/fortune/index'),
  },
  {
    path: '/fortunequestion',
    name: 'FortuneQuestion',
    meta: { title: '朋友圈财富金矿知多少' },
    component: () => import('@/views/business/fortune/components/fortuneQuestion'),
  },
  {
    path: '/fortunetestresult',
    name: 'FortuneTestResult',
    meta: { title: '朋友圈财富金矿知多少' },
    component: () => import('@/views/business/fortune/components/fortuneTestResult'),
  },
  {
    path: '/fortunetest',
    name: 'FortuneTest',
    meta: { title: '参与情况' },
    component: () => import('@/views/business/fortune/components/fortuneTest'),
  },
];
