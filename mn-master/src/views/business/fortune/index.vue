<template>
  <div class="fortune_index">
    <!-- 财富金矿首页 -->
    <fortune-home
      ref="home"
      v-if="showComponent == 'home'"
      :wx-user-info="wxUserInfo"
      :wxData="{ id: id, agentId: agentId }"
      @clickShare="handleHomeShareClick"
      @clickReview="handleHomeReviewClick"
      @reviewHistory="handleHomeReviewHistory"
    ></fortune-home>
    <!-- 问卷答题 -->
    <fortune-question v-if="showComponent == 'question'" :data="componentParams"></fortune-question>
    <!-- 参与情况 -->
    <!-- <fortune-test v-if="showComponent == 'test'"> </fortune-test> -->
    <!-- 测评结果 -->
    <!-- <fortune-result v-if="showComponent == 'result'" @clickFortuneResult="handleHomeFortuneResult" :data="componentParams"> </fortune-result> -->
    <!-- 填写报名信息 -->
    <!-- <van-overlay v-if="showComponent == 'signup'"> -->
    <van-overlay :show="showDialog">
      <signup-dialog :user-id="agentId" :wx-user-info="wxUserInfo" :type="type" @onConfirm="signUp" @onCancel="onCancel" />
    </van-overlay>
    <!-- 引导页 -->
    <Guide v-if="isGuide" @onHide="onHide" />
  </div>
</template>
<script>
import { redirectWeChatByAppId, initWeChatActivity, addListenWeChatForward } from '@/utils/wechatAuthUtil';
import SignupDialog from '@/components/signupDialog';
import Guide from '@/views/business/salary/components/guide';
import FortuneHome from './components/fortuneHome';
import FortuneQuestion from './components/fortuneQuestion';
// import FortuneTest from './components/fortuneTest.vue';
// import FortuneResult from './components/fortuneResult';
export default {
  name: 'Fortune',
  components: {
    SignupDialog,
    Guide,
    FortuneHome,
    FortuneQuestion,
    // FortuneResult,
  },
  data() {
    return {
      // home:首页,guide:引导页,signup:报名弹框,question:填写问卷,result:答题成功
      showComponent: 'home',
      showDialog: false,
      isGuide: false,
      componentParams: null,
      agentId: '',
      userId: '',
      id: '', // 测评id
      type: 100, // 测评类型（100：财富金矿；200：性向测试）
      wxUserInfo: {},
      params: {
        agentId: '',
        id: '',
        type: '',
        shareId: '',
      },
      wxData: {},
    };
  },
  computed: {
    judgeEnvIsWechat() {
      return this.$appInterface.judgingIsWeChart();
    },
  },
  created() {
    console.info('财富金矿主页1.2.4');
    this.getParamsFromRoute();
  },
  methods: {
    handleHomeShareClick() {
      if (this.judgeEnvIsWechat) {
        return (this.isGuide = true);
      }
      this.showComponent = 'guide';
    },
    handleHomeReviewClick(data) {
      /**
       * data : { page: '跳转的组件', params: { key:value } }
       */
      console.log(data);
      const { page, params } = data;
      const userId = params.userId ? params.userId : this.userId;
      console.log('主页-问卷调差-data', data);
      if (page) {
        this.showComponent = page;
        console.log('主页-问卷调差-params-isFirst', { ...params, agentId: this.agentId, id: this.id, userId: userId });
        if (params) {
          this.componentParams = { ...params, agentId: this.agentId, id: this.id, userId: userId };
          if (params.isFirst) {
            this.showDialog = true;
          }
        }
        console.log('主页-问卷调差-传参-componentParams', this.componentParams);
      }
    },
    handleHomeReviewHistory(data) {
      const { page, params } = data;
      if (page) {
        this.showComponent = page;
        if (params) {
          this.componentParams = { ...params, agentId: this.agentId, id: this.id };
        }
        console.log('主页-参与情况', this.componentParams);
      }
    },
    handleHomeFortuneResult(data) {
      console.log('主页-测评结果-data', data);
      const { page, params } = data;
      if (page) {
        this.showComponent = page;
        if (params) {
          this.componentParams = { ...params, agentId: this.agentId, id: this.id };
        }
        console.log('主页-测评结果', this.componentParams);
      }
    },
    onHide() {
      this.showComponent = 'home';
      this.isGuide = false;
    },
    // 获取报名人id并跳转到测评页面
    signUp(userId) {
      // 回传报名人id
      console.log(userId, '获取报名页回传报名人id');
      console.log('agentId-id-userId', { agentId: this.agentId, id: this.id, userId: userId });
      this.userId = userId;
      if (userId) {
        this.showDialog = false;
        this.componentParams = { agentId: this.agentId, id: this.id, userId: userId };
        this.showComponent = 'question';
        // this.$router.replace({
        //   name: 'FortuneQuestion',
        //   query: { userId, agentId: this.agentId, id: this.id },
        // });
      }
    },
    onCancel() {
      this.showDialog = false;
      this.showComponent = 'home';
    },
    getParamsFromRoute() {
      if (this.judgeEnvIsWechat) {
        this.agentId = this.$route.query.agentId;
        this.checkAuthProcess();
      } else {
        this.agentId = this.$appInterface.getCreateId() || this.$route.query.agentId;
      }
      this.imgUrl = process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/fortune.png';
      this.id = this.$route.query.id;
    },
    async checkAuthProcess() {
      const { agentId = '', id = '', type = '', code = '', shareId = '' } = this.$route.query;
      this.params = { agentId, id, type, shareId };
      if (!code) {
        await redirectWeChatByAppId(this.params);
      }
      console.info('初始化微信活动主流程');
      // 初始化微信活动主流程
      this.wxUserInfo = await initWeChatActivity(code);
      this.$refs.home.recordShareTime(2);
      console.info('监听微信转发- this.wxUserInfo', this.wxUserInfo);
      // 监听微信转发
      addListenWeChatForward(this.handleForwardData(), () => {
        // 转发回调，增加转发记录
        this.$refs.home.recordShareTime(1);
        this.showComponent = 'home';
        this.isGuide = false;
        console.log('转发数据', this.handleForwardData());
      });
    },
    handleForwardData() {
      return {
        title: '朋友圈财富金矿知多少',
        desc: '你的朋友圈价值百万！还不赶紧挖掘一下你朋友圈里的财富金矿',
        imgUrl: process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/fortune.png',
        link: process.env.VUE_APP_SERVICE_URL + '/h5-agent-business/fortune?agentId=' + this.agentId + '&id=' + this.id,
      };
    },
  },
};
</script>
<style lang="scss" scoped></style>
