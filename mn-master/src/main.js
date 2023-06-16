import { router, store, vueApp } from '@manniu-cli/vue-cli-plugin-manniu-cli-plugin/auto';
import '@/router';
import Vue from 'vue';
import appInterface from '@/utils/appInterface';
import EventTrack from '@manniu-core/BuriedpointProvider';
import { gdpSend } from '@/utils/eventTracking.js';
import Vconsole from 'vconsole';
import { version } from '../package.json';
import Icons from '@/assets/icons.js';

console.log('router, store, vueApp: ', router, store, vueApp);
Vue.prototype.$Icons = Icons;
Vue.prototype.$appInterface = appInterface;
Vue.prototype.$gdp = gdpSend;
if (process.env.VUE_APP_CONSOLE) {
  const vConsole = new Vconsole();
  Vue.use(vConsole);
  console.log('version: ', version);
}
// 数据埋点
const token = appInterface.getToken();
if (typeof window !== 'undefined' && !window.gdp) {
  EventTrack.init(process.env, { platform: token ? 'hybrid' : 'js', debug: true }, 'agent');

  Vue.use(EventTrack);
}
const setHtmlFontSize = () => {
  const htmlDom = document.getElementsByTagName('html')[0];
  let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
  if (htmlWidth >= 750) {
    htmlWidth = 750;
  }
  if (htmlWidth <= 320) {
    htmlWidth = 320;
  }
  htmlDom.style.fontSize = `${htmlWidth / 7.5}px`;
};
window.onresize = setHtmlFontSize;
setHtmlFontSize();
