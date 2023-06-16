export default [
  // 问卷
  {
    path: '/questionnaire',
    name: 'Qestionnaire',
    meta: { title: '问卷' },
    component: () => import('@/views/business/questionnaire/index'),
  },
  {
    path: '/fPAparticipateList',
    name: 'fPAparticipateList',
    meta: {
      keepAlive: false,
      title: '参与情况',
      hasBack: true,
    },
    component: () => import('@/views/business/character/components/participateList.vue'),
  },
];
