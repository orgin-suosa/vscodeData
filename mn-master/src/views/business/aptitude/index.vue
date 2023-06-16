<template>
  <div class="wx_container">
    <!-- 首页，开始评估 -->
    <SurveyIntro ref="surveyIntro" v-if="showPageType === 1" :agentId="agentId" :wxUserInfo="wxUserInfo" @getMobile="getMobile" :hasMobile="mobile" @getExhibitionList="getExhibitionList" />
    <!-- 答题页面 -->
    <Questionnaire v-if="showPageType === 2" :agentId="agentId" :id="id" :mobile="mobile" :current="currentNum" :questionArr="questionArr" @getResult="getResult" />
    <!-- 结果页面 -->
    <TestResult ref="testResult" v-if="showPageType === 3" :mobile="mobile" :agentId="agentId" :resultParams="resultParams" @getExhibitionList="getExhibitionList" />
    <div class="wait" v-if="showPageType === 0">
      <img class="wait_img" src="@/assets/challenge/wait.gif" alt="" />
    </div>
  </div>
</template>
<script>
import SurveyIntro from './components/surveyIntro.vue';
import Questionnaire from './components/questionnaire';
import TestResult from './components/testResult';
import topic from './components/allTopic.js';
import { redirectWeChatByAppId, initWeChatActivity, addListenWeChatForward } from '@/utils/wechatAuthUtil';
export default {
  name: 'WxSurveyIntro',
  components: {
    SurveyIntro,
    Questionnaire,
    TestResult,
  },
  data() {
    return {
      showPageType: 0,
      agentId: '',
      id: '',
      params: {},
      wxUserInfo: {},
      openId: '',
      mobile: '',
      getParams: {}, // 获取答题情况
      allTopic: [],
      currentNum: 1, // 已答的最大题号
      questionArr: [],
      resultParams: [],
      isWeChart: false,
    };
  },
  created() {
    this.getQuery();
  },
  mounted() {},
  methods: {
    // 获取参数
    getQuery() {
      this.allTopic = topic;
      this.isWeChart = this.$appInterface.judgingIsWeChart();
      const query = this.$route.query;
      this.agentId = query?.agentId ? query.agentId : '';
      this.id = query?.id ? query.id : '';
      if (!this.$appInterface.getCreateId()) {
        this.checkAuthProcess();
      } else {
        this.getExhibitionList(2);
        this.isFirst();
        // this.showPageType = 1;
      }
    },
    async checkAuthProcess() {
      const { agentId = '', code = '', id = '' } = this.$route.query;
      this.params = { agentId, code, id };
      if (!code) {
        await redirectWeChatByAppId(this.params);
      }
      // 初始化微信活动主流程
      this.wxUserInfo = await initWeChatActivity(code);
      this.openId = this.wxUserInfo ? this.wxUserInfo.openid : '';
      await this.isFirst();
      await this.getExhibitionList(2);
      // 监听微信转发
      addListenWeChatForward(this.handleForwardData(), () => {
        // 转发回调，增加转发记录
        console.log('转发数据', this.handleForwardData());
        this.getExhibitionList(1);
        if (this.showPageType === 1) {
          this.$refs.surveyIntro.isGuide = false;
        } else if (this.showPageType === 3) {
          this.$refs.testResult.isGuide = false;
        }
      });
    },
    // 转发参数处理
    handleForwardData() {
      return {
        title: '带你了解更真实的自己',
        desc: '测一测最真实的自己，或许可以了解到一个不为人知的你',
        imgUrl: process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/aptitude.png',
        link: process.env.VUE_APP_SERVICE_URL + '/h5-agent-business/aptitude?agentId=' + this.agentId + '&id=' + this.id,
      };
    },
    // 判断用户是否是第一次测试
    async isFirst() {
      const param = {
        openId: this.openId || 'openid',
        agentId: this.agentId,
        mobile: this.mobile || '',
      };
      await this.$store.dispatch('sexual/queryCharacterPersonInfo', param).then((res) => {
        console.log('res判断用户是否是第一次测试-----', res);
        if (res.code === 200) {
          if (res.data.mobile) {
            this.mobile = res.data.mobile;
            this.checkStatus();
            console.log('已经答题了', this.mobile);
          } else {
            this.showPageType = 1;
          }
        }
      });
    },
    // 获取答题情况以及题库
    checkStatus() {
      if (!this.isWeChart) {
        this.pageType = 1;
        return;
      }
      const param = {
        agentId: this.agentId,
        mobile: this.mobile,
      };
      this.$store.dispatch('sexual/queryAnswerRecord', param).then((res) => {
        console.log('获取答题情况以及题库-----', res);
        // 用户第一次进入报名，没有答题
        if (res.code === 200 && !res.data.list && !res.data.resultLlist) {
          this.getParams.status = '2';
          this.getParams.list = res.data.list;
          this.handleFunc(this.getParams, 'openLink');
        }
        // 用户已经测试过了,并未完成测试
        if (res.code === 200 && ((res.data.list && res.data.list.length > 0) || !res.data.resultLlist)) {
          this.getParams.status = '2';
          this.getParams.list = res.data.list;
          this.handleFunc(this.getParams, 'openLink');
        }
        // 用户已经测试过了,并完成测试了
        if (res.code === 200 && res.data.list.length === 0 && res.data.resultLlist) {
          this.getParams.status = '1';
          this.getParams.resultLlist = res.data.resultLlist;
          this.handleFunc(this.getParams, 'openLink');
        }
      });
    },
    // 根据答题情况，做不同处理
    handleFunc(param, from) {
      console.log('根据答题情况，做不同处理', param);
      if (param.status === '1') {
        console.log('已参与性向测试,显示答题结果页面', param);
        this.getResult({ params: param.resultLlist });
        // this.showPageType = 3;
      } else {
        this.dealData(param, from);
      }
    },
    // 处理答题数据
    dealData(param, from) {
      console.log('param处理答题数据-----', param);
      const questionArr = this.allTopic;
      if (questionArr && questionArr.length > 0) {
        for (let i = 0; i < questionArr.length; i++) {
          if (this.questionArr.length < questionArr.length) {
            const options = [
              { code: 'A', num: '1', content: questionArr[i]?.optionA || '' },
              { code: 'B', num: '2', content: questionArr[i]?.optionB || '' },
              { code: 'C', num: '3', content: questionArr[i]?.optionC || '' },
              { code: 'D', num: '4', content: questionArr[i]?.optionD || '' },
            ];
            this.questionArr.push({
              id: questionArr[i].id || '',
              problemsId: questionArr[i].problemsId,
              answer: questionArr[i].optionOpt || '',
              title: questionArr[i].title || '',
              options: options,
            });
          }
        }
      }
      // ------------------------ 已答的最大题号
      if (param.list) {
        if (this.questionArr.length === param.list.length) {
          this.currentNum = param.list.length;
        } else if (!param.list) {
          this.currentNum = 1;
        } else {
          this.currentNum = param.list.length + 1;
        }
        this.questionArr.map((item) => {
          param.list.map((itm) => {
            if (item.id * 1 === itm.questionSequence) {
              item.answer = String(itm.optionResult);
            }
          });
        });
      }
      // 继续答题
      if (param.status === '2') {
        console.log('请继续答题--', this);
        this.showPageType = 2;
      }
      // 开始答题
      if (param.status === '3' && from === 'signUp') {
        console.log('请开始答题', this); // 默认页面
        this.showPageType = 2;
      }
      // 再次答题
      if (param.status === '3' && from === 'nextText') {
        this.currentNum = 1;
        console.log('首页', this.questionArr); // 默认页面
        this.questionArr.forEach((ele) => {
          ele.answer = '';
        });
        this.showPageType = 1;
      }
    },
    // 获取填写注册的手机号
    getMobile(params) {
      this.mobile = params;
    },
    // 查看报告跳转到结果页面
    getResult(params) {
      this.showPageType = 3;
      this.resultParams = params.params;
      console.log(params, 'param');
    },
    // 保存展业的转发/浏览次数
    getExhibitionList(type) {
      const params = {
        id: this.id,
        type: type, // 浏览2，转发1
        agentId: this.agentId,
        openId: this.openId || '',
      };
      console.log(params, 'params');
      this.$store.dispatch('business/saveFrequency', params);
    },
  },
};
</script>
<style lang="scss" scoped>
.wx_container {
  .wait {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .wait_img {
      width: 145px;
      height: 97px;
    }
  }
}
</style>
