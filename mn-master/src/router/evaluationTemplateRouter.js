export default [
  // 测试详情
  {
    path: '/evaluationTemplate',
    name: 'EvaluationTemplate',
    meta: {
      keepAlive: false,
      title: '',
      hasBack: false,
    },
    component: () => import('@/views/business/evaluationTemplate/index'),
  },
];
