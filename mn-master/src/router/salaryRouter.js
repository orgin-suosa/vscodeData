export default [
  // 秒薪测评首页
  {
    path: '/salary',
    name: 'Salary',
    meta: { title: '每秒薪资大PK' },
    component: () => import('@/views/business/salary/index'),
  },
  // 秒薪测评详情
  {
    path: '/evaluationDetail',
    name: 'EvaluationDetail',
    meta: { title: '测评详情' },
    component: () => import('@/views/business/salary/components/evaluationDetail'),
  },
];
