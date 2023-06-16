<template>
  <div class="container">
    <!-- 秒薪测评首页 -->
    <EvaluationHome ref="evaluationHome" v-if="pageType === '1'" @updateType="updateType" @getExhibitionList="getExhibitionList" :openId="openId" :agentId="agentId" :isWeChart="isWeChart" />
    <!-- 秒薪测评PK答题页面 -->
    <Evaluation v-if="pageType === '2'" @updateType="updateType" :isWeChart="isWeChart" :wxUserInfo="isWeChart ? wxUserInfo : null" :agentId="agentId" />
    <!-- 秒薪测评PK结果 -->
    <EvaluationResults ref="evaluationResults" v-if="pageType === '3'" :getresult="getresult" @getExhibitionList="getExhibitionList" :agentId="agentId" :isWeChart="isWeChart" />
  </div>
</template>

<script>
import { redirectWeChatByAppId, initWeChatActivity, addListenWeChatForward, transFullPath, serialize } from '@/utils/wechatAuthUtil';
import EvaluationHome from './components/evaluationHome';
import Evaluation from './components/evaluation';
import EvaluationResults from './components/evaluationResults';

export default {
  name: 'Index',
  components: {
    EvaluationHome,
    Evaluation,
    EvaluationResults,
  },
  data() {
    return {
      pageType: '1',
      isWeChart: false, // 是否在微信环境
      isAppOpne: '', // 是否在APP打开
      getresult: '', // pk结果
      agentId: '', // 代理人ID
      openId: '',
      params: {},
    };
  },
  computed: {},
  created() {
    this.isWeChart = this.$appInterface.judgingIsWeChart();
    this.isAppOpne = this.$appInterface.getToken() || '';
    console.log(this.isWeChart, '0000'); // 判断是否是微信环境
    console.log(this.$route.query, 'this.$route.query0000'); // 判断是否是微信环境
    this.agentId = !this.isWeChart ? this.$appInterface.getCreateId() : this.$route.query.agentId;
    console.log('代理人ID');
    if (this.isWeChart || !this.isAppOpne) {
      this.checkAuthProcess();
    } else {
      const list = {
        agentId: this.agentId,
        openId: this.openid || '',
      };
      this.$nextTick(() => {
        this.getExhibitionList(2);
        this.$refs.evaluationHome.getFirstPk(list);
      });
    }
  },
  mounted() {},
  methods: {
    async checkAuthProcess() {
      const { agentId = '', id = '', type = '', code = '', shareId = '' } = this.$route.query;
      this.params = { agentId, id, type, shareId };
      console.log('this.params--->', this.params);
      if (!code) {
        console.log('this.$route.query---1>', this.$route.query);
        await redirectWeChatByAppId(this.params);
      }
      console.log('this.$route.query---2>', this.$route.query);
      // 初始化微信活动主流程
      this.wxUserInfo = await initWeChatActivity(code);
      this.openId = this.wxUserInfo ? this.wxUserInfo.openid : '';
      console.log('wxUserInfo--->', this.wxUserInfo, this.openId);
      const list = {
        agentId: this.agentId,
        openId: this.openId || '',
      };
      await this.getExhibitionList(2);
      this.$refs.evaluationHome.getFirstPk(list);
      // 监听微信转发
      addListenWeChatForward(this.handleForwardData(), () => {
        // 转发回调，增加转发记录
        console.log('转发数据', this.handleForwardData());
        this.getExhibitionList(1);
        if (this.pageType === '1') {
          this.$refs.evaluationHome.isGuide = false;
        } else if (this.pageType === '3') {
          this.$refs.evaluationResults.isGuide = false;
        }
      });
    },
    // 转发参数处理
    handleForwardData() {
      return {
        title: '每秒薪资大pk',
        desc: '快来比一比，看看谁是朋友圈里的秒薪大佬',
        imgUrl: process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/salary.png',
        link: transFullPath() + serialize(this.params),
      };
    },
    // 保存展业的转发/浏览次数
    async getExhibitionList(type) {
      console.log(this.$route, 'this.$route');
      const params = {
        id: this.$route.query.id,
        type: type, // 浏览1，转发2
        agentId: this.agentId,
        openId: this.openId || '',
      };
      console.log(params, 'params');
      await this.$store.dispatch('business/saveFrequency', params);
    },
    // 跳转组件
    updateType(params) {
      this.pageType = params.type;
      this.getresult = params.getresult;
      console.log(this.pageType, 'this.pagetype');
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  .share_icon {
    width: 0.42rem;
    height: 0.42rem;
    vertical-align: middle;
  }
}
</style>
