import skeletonRouter from './router';

export function findSkeletonDom(name) {
  const match = skeletonRouter.routes.find((route) => route.name === name);
  const skeletonDom = match && match.skeletonId && document.getElementById(match.skeletonId);
  return skeletonDom;
}

export function handleShowSkeletonRouter(name) {
  if (!name) return;
  const skeletonDom = findSkeletonDom(name);
  if (skeletonDom) {
    skeletonDom.style.display = 'block';
  }
}

export function handleHideSkeletonRouter(name) {
  if (!name) return;
  const skeletonDom = findSkeletonDom(name);
  if (skeletonDom) {
    skeletonDom.style.display = 'none';
  }
}

/**
 * 骨架屏显示依赖路由监听
 * 隐藏由组件内接口完成之后调用 handleHideSkeletonRouter 函数
 * keepAlive 的组件由于不会销毁，created 函数只会触发一次
 * 所以我们只需要显示一次骨架屏即可，创建 Map 来记录 keepAlive 页面
 */
const keepAliveMap = new Map();

export function toggleSkeletonRouter(to, from) {
  handleHideSkeletonRouter(from.name);
  if (!keepAliveMap.has(to.name)) {
    handleShowSkeletonRouter(to.name);
    if (to.meta && to.meta.keepAlive) {
      keepAliveMap.set(to.name, true);
    }
  }
}
