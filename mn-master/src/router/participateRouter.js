export default [
  // 我的参与
  {
    path: '/participateIndex',
    name: 'ParticipateIndex',
    meta: { title: '我的参与' },
    component: () => import('@/views/business/myParticipation/participateIndex.vue'),
  },
  // {
  //   path: '/fPAparticipateList',
  //   name: 'fPAparticipateList',
  //   meta: {
  //     keepAlive: false,
  //     title: '参与情况',
  //     hasBack: true,
  //   },
  //   component: () => import('@/views/business/character/components/participateList.vue'),
  // },
];
