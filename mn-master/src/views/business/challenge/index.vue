<template>
  <div class="container">
    <!-- 挑战首页 -->
    <Home
      v-if="pageType === 1"
      ref="home"
      :agentId="agentId"
      :openId="openId"
      :isWeChart="isWeChart"
      :homePageImg="infoDetail.homePageImg"
      :infoShare="infoShare"
      :id="id"
      @updateType="updateType"
      @getExhibitionList="getExhibitionList"
    />
    <!-- 挑战页面 -->
    <Questions
      v-if="pageType === 2"
      :agentId="agentId"
      :id="id"
      :current="currentNum"
      :questionArr="questionArr"
      :backgroundColor="infoDetail.backgroundColor"
      :wxUserInfo="wxUserInfo"
      @updateType="updateType"
    />
    <!-- 挑战结果页面 -->
    <Result
      v-if="pageType === 3"
      ref="result"
      :agentId="agentId"
      :isWeChart="isWeChart"
      :openId="openId"
      :infoShare="infoShare"
      :getResult="getResult"
      @updateType="updateType"
      @getExhibitionList="getExhibitionList"
    />
    <div class="wait" v-if="pageType === 0">
      <img class="wait_img" src="@/assets/challenge/wait.gif" alt="" />
    </div>
  </div>
</template>

<script>
import { redirectWeChatByAppId, initWeChatActivity, addListenWeChatForward } from '@/utils/wechatAuthUtil';
import Home from './components/home';
import Questions from './components/questions';
import Result from './components/result';

export default {
  name: 'Index',
  components: {
    Home,
    Questions,
    Result,
  },
  data() {
    return {
      pageType: 0,
      isWeChart: false, // 是否在微信环境
      isAppOpne: '',
      token: '', // 用户token
      agentId: '', // 代理人ID
      openId: '', // 微信openid
      // openId: 'o6Bw_v1kZJ3dL3FkhSHSjQAaEKws', // 微信openid
      id: '',
      params: {},
      getResult: {}, // 测试结果
      wxUserInfo: {},
      mobile: '',
      getParams: {}, // 获取答题情况
      allTopic: [],
      currentNum: 1, // 已答的最大题号
      questionArr: [],
      infoDetail: {}, // 展业工具首页信息查询
      infoShare: {}, // 展业工具分享设置查询
    };
  },
  computed: {},
  created() {
    this.getQuery();
  },
  mounted() {},
  methods: {
    // 获取参数
    getQuery() {
      this.isWeChart = this.$appInterface.judgingIsWeChart();
      this.isAppOpne = this.$appInterface.getToken() || '';
      console.log(this.isWeChart, '0000'); // 判断是否是微信环境
      const query = this.$route.query;
      // this.agentId = !this.isWeChart ? this.$appInterface.getCreateId() || '692307343584661504' : this.$route.query.agentId || '692307343584661504';
      // this.id = query?.id ? query.id : '832197984354566144';
      this.agentId = !this.isWeChart ? this.$appInterface.getCreateId() || '' : this.$route.query.agentId || '';
      this.id = query?.id ? query.id : '';
      this.getBaseinfoDetail();
      this.getBaseinfoShare();
      if (this.isWeChart || !this.isAppOpne) {
        this.checkAuthProcess();
      } else {
        this.getQuestionList();
        this.$nextTick(() => {
          this.getExhibitionList(2);
        });
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
      this.getQuestionList();
      this.getExhibitionList(2);
      // 监听微信转发
      addListenWeChatForward(this.handleForwardData(), () => {
        // 转发回调，增加转发记录
        console.log('转发数据', this.handleForwardData());
        this.getExhibitionList(1);
        if (this.pageType === 1) {
          this.$refs.home.isGuide = false;
        } else if (this.pageType === 3) {
          this.$refs.result.isGuide = false;
        }
      });
    },
    // 转发参数处理
    handleForwardData() {
      return {
        title: this.infoShare.title || '',
        desc: this.infoShare.subheading || '',
        imgUrl: this.infoShare.coverImg || process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/aptitude.png',
        link: process.env.VUE_APP_SERVICE_URL + '/h5-agent-business/challenge?agentId=' + this.agentId + '&id=' + this.id,
      };
    },
    // 获取展业工具首页信息查询
    getBaseinfoDetail() {
      this.$store.dispatch('challenge/selectBaseinfoDetail', { id: this.id }).then((res) => {
        if (res.code === 200) {
          console.log(res, 'selectBaseinfoDetail============>');
          this.infoDetail = res.data;
        }
      });
    },
    // 获取展业工具分享设置查询
    getBaseinfoShare() {
      this.$store.dispatch('challenge/selectBaseinfoShare', { id: this.id }).then((res) => {
        if (res.code === 200) {
          console.log(res, 'selectBaseinfoShare============>');
          this.infoShare = res.data;
        }
      });
    },
    // 展业工具题目列表查询
    getQuestionList() {
      this.$store.dispatch('challenge/selectQuestionList', { baseInfoId: this.id }).then((res) => {
        if (res.code === 200) {
          console.log(res, 'selectQuestionList============>');
          this.allTopic = res.data;
          this.checkStatus();
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
        baseInfoId: this.id,
        openId: this.openId,
      };
      this.$store.dispatch('challenge/selectPersonOptionList', param).then((res) => {
        console.log('获取答题情况-----', res);
        if (res.code === 200) {
          if (res.data.personOptionRecords.length === 0 && !res.data.personRecordId) {
            // 用户没有参加过测评
            this.getParams.status = '3';
            this.handleFunc(this.getParams);
          }
          if (res.data.personOptionRecords.length !== 0) {
            // 用户已经测试过了,并未完成测试
            this.getParams.status = '2';
            this.getParams.list = res.data.personOptionRecords;
            this.handleFunc(this.getParams, 'openLink');
          }
          if (res.data.personOptionRecords.length === 0 && res.data.personRecordId) {
            // 用户已经测试过了,并完成测试了
            this.getParams.status = '1';
            this.handleFunc(this.getParams, 'openLink');
          }
        }
      });
    },
    // 根据答题情况，做不同处理
    handleFunc(param, from) {
      console.log('根据答题情况，做不同处理', param);
      if (param.status === '1') {
        console.log('已参与性向测试,显示答题结果页面');
        this.pageType = 3;
      } else {
        this.dealData(param, from);
      }
    },
    // 处理答题数据
    dealData(param, from) {
      const questionArr = this.allTopic;
      const optionsA = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      console.log('questionArr', questionArr);
      if (questionArr && questionArr.length > 0) {
        for (let i = 0; i < questionArr.length; i++) {
          if (this.questionArr.length < questionArr.length) {
            const options = [];
            questionArr[i].options.map((item, ind) => {
              options.push({
                num: ind + 1 + '',
                id: item.id,
                questionId: item.questionId,
                content: optionsA[ind] + ':' + item.optionContent || '',
                // optionValue: item.optionValue, // 指定跳转（0：否；1：是）
                // nextQuesCode: item.nextQuesCode,
              });
            });
            this.questionArr.push({
              id: questionArr[i].id || '',
              answer: '',
              title: questionArr[i].questionName || '',
              options: options,
            });
          }
        }
      }
      // ------------------------ 已答的最大题号
      if (param.list) {
        console.log(param.list, this.questionArr, this.currentNum, 'list');
        if (this.questionArr.length === param.list.length) {
          this.currentNum = param.list.length;
        } else {
          this.currentNum = param.list.length + 1;
        }
        this.questionArr.map((item) => {
          param.list.map((itm) => {
            if (item.id === itm.questionId) {
              item.answer = itm.questionOptionsId;
            }
          });
        });
      }
      // 继续答题
      if (param.status === '2') {
        console.log('请继续答题--', this);
        this.pageType = 2;
      }
      // 开始答题
      if (param.status === '3') {
        this.currentNum = 1;
        console.log('首页', this.questionArr); // 默认页面
        this.questionArr.forEach((ele) => {
          ele.answer = '';
        });
        this.pageType = 1;
      }
    },
    // 保存展业的转发/浏览次数
    getExhibitionList(type) {
      const params = {
        id: this.id,
        type: type, // 浏览2，转发1
        agentId: this.agentId,
        openId: this.openId || '',
      };
      console.log('保存展业的转发/浏览次数params', params);
      this.$store.dispatch('business/saveFrequency', params);
    },
    // 跳转组件
    updateType(params) {
      this.pageType = params.type;
      this.getResult = params.getResult;
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
