export default [
  // 性向测试
  {
    path: '/aptitude',
    name: 'Aptitude',
    meta: { title: '带你了解更真实的自己' },
    component: () => import('@/views/business/aptitude'),
  },
  {
    path: '/customerList',
    name: 'CustomerList',
    meta: {
      keepAlive: false,
      title: '参与情况',
      hasBack: true,
    },
    component: () => import('@/views/business/aptitude/components/customerList.vue'),
  },
];
