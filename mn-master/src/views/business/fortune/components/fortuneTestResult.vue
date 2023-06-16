<template>
  <fortune-result :fortuneTestResultData="fortuneTestResultData"></fortune-result>
</template>

<script>
import FortuneResult from './fortuneResult';
import { serialize } from '@/utils/wechatAuthUtil.js';
export default {
  name: 'FortuneTestResult',
  components: {
    FortuneResult,
  },
  // props: ['FortuneTestResultData'],
  props: {
    fortuneTestResultData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    fortuneTestResultData(val) {
      console.log('测评结果展示问卷调查', val);
    },
  },
  data() {
    return {
      result: {
        name: '',
        referrerName: '',
        incomePersonage: '',
        incomeCompany: '',
        a: '',
        b: '',
        c: '',
        e: '',
        allowanceAward: '',
        dcompany: '',
        dpersonage: '',
        agentId: '',
        id: '',
      },
    };
  },
  created() {
    const res = this.fortuneTestResultData;
    this.result = res;
    console.log(this.fortuneTestResultData, this.result, '问卷跳转至结果接收-fortuneTestResultData');
  },
  beforeRouteEnter(to, from, next) {
    console.log(to, 'fortuneResultTo');
    console.log(from, 'fortuneResultFrom');
    if (from.path == '/fortunetestresult' && to.path == '/fortunetestresult') {
      if (window.performance.navigation.type == 1) {
        next();
      } else {
        window.location.replace(process.env.VUE_APP_SERVICE_URL + '/h5-agent-business/fortune' + serialize(from.query));
      }
    } else {
      next();
    }
  },
};
</script>
