export default [
  // 我的分享
  {
    path: '/shareIndex',
    name: 'ShareIndex',
    meta: { title: '我的分享' },
    component: () => import('@/views/business/myShare/shareIndex.vue'),
  },
  {
    path: '/participationDetails',
    name: 'ParticipationDetails',
    meta: {
      title: '参与详情',
    },
    component: () => import('@/views/business/components/participationDetails.vue'),
  },
];
