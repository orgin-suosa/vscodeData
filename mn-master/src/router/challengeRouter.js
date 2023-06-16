export default [
  // 测评首页
  {
    path: '/challenge',
    name: 'Challenge',
    meta: { title: '展业工具' },
    component: () => import('@/views/business/challenge/index'),
  },
  // 参与情况
  {
    path: '/participateList',
    name: 'ParticipateList',
    meta: { title: '参与情况' },
    component: () => import('@/views/business/challenge/components/participateList'),
  },
];
