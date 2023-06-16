export default [
  // FPA性格色彩测试
  {
    path: '/character',
    name: 'character',
    meta: {
      keepAlive: false,
      title: '问卷',
      hasBack: false,
    },
    component: () => import('@/views/business/character/index'),
  },
  {
    path: '/fPAparticipateList',
    name: 'fPAparticipateList',
    meta: {
      keepAlive: false,
      title: '问卷',
      hasBack: true,
    },
    component: () => import('@/views/business/character/components/participateList.vue'),
  },
];
