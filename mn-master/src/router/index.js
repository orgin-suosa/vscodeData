import { router } from '@manniu-cli/vue-cli-plugin-manniu-cli-plugin/auto';
import { toggleSkeletonRouter } from '../skeleton/utils';
import salaryRouter from './salaryRouter';
import aptitudeRouter from './aptitudeRouter';
import fortuneRouter from './fortuneRouter';
import challengeRouter from './challengeRouter';
import characterRouter from './characterRouter';
import questionnaireRouter from './questionnaireRouter';
import shareRouter from './shareRouter';
import participateRouter from './participateRouter';
import evaluationTemplateRouter from './evaluationTemplateRouter';
import annuityRouter from './annuityRouter';
const routerConfig = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/views/demo.vue'),
  },
  // 展业工具首页
  {
    path: '/business',
    name: 'Business',
    meta: { title: '展业工具' },
    component: () => import('@/views/business'),
  },

  ...salaryRouter,
  ...aptitudeRouter,
  ...fortuneRouter,
  ...challengeRouter,
  ...characterRouter,
  ...questionnaireRouter,
  ...shareRouter,
  ...participateRouter,
  ...evaluationTemplateRouter,
  ...annuityRouter,
  {
    path: '*',
    redirect: process.env.VUE_APP_BASE_ROUTE,
  },
];

router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  toggleSkeletonRouter(to, from);
  next();
});

router.addRoutes(routerConfig);
