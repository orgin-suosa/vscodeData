<template>
  <div class="container">
    <MnNavBar ref="mnNavBar" v-if="!isWeChart" :class="pageType != 1 ? 'isShowBack' : ''" :title="htmlTitle" left-text="" right-text="" :top="barHeight" @click-left="goBack" />

    <div :class="isWeChart ? 'container-scroll weChart-scroll ' : 'container-scroll'">
      <!-- 挑战首页 -->
      <Home
        v-if="pageType === 1"
        ref="home"
        :agentId="agentId"
        :openId="openId"
        :isWeChart="isWeChart"
        :infoDetail="infoDetail"
        :infoShare="infoShare"
        :id="id"
        :userId="userId"
        :baseInfoId="id"
        :hasMobile="mobile"
        :wxUserInfo="wxUserInfo"
        :isFirstSignUp="isFirstSignUp"
        :appModelDate="appModelDate"
        :dealData="dealData"
        @getMobile="getMobile"
        @updateType="updateType"
        @getExhibitionList="getExhibitionList"
        @changeAppFormData="changeAppFormData"
        @changeResult="changeResult"
      />
      <!-- 挑战结果页面 -->
      <Result
        v-if="pageType === 2 || pageType === 3"
        ref="result"
        :agentId="agentId"
        :isWeChart="isWeChart"
        :openId="openId"
        :mobile="mobile"
        :infoShare="infoShare"
        :getResult="getResult"
        :infoDetail="infoDetail"
        :resultlist="resultlist"
        :dealData="dealData"
        :cardDate="cardDate"
        @updateType="updateType"
        @getExhibitionList="getExhibitionList"
      />
    </div>

    <div class="wait" v-if="pageType === 0">
      <img class="wait_img" src="@/assets/challenge/wait.gif" alt="" />
    </div>
  </div>
</template>

<script>
import { serialize, redirectWeChatByAppId, initWeChatActivity, addListenWeChatForward } from '@/utils/wechatAuthUtil';
import Home from './components/home';
// import Questions from './components/questions';
import Result from './components/result';
import sharePic from '@/assets/FPAptitude/character.png';
import MnNavBar from '@/components/NavBar.vue';
export default {
  name: 'OldAgePension',
  components: {
    Home,
    // Questions,
    Result,
    MnNavBar,
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
      params: {
        agentId: '',
        id: '',
        type: '',
        shareId: '',
      },
      getResult: {
        createdTime: '2021-06-25 14:48:26',
        result: '本地数据',
        resultAnalyse: '',
        // 测试结果
      },
      wxUserInfo: {},
      mobile: '',
      getParams: {}, // 获取答题情况
      allTopic: [],
      currentNum: 1, // 已答的最大题号
      questionArr: [],
      infoDetail: {}, // 展业工具首页信息查询
      infoShare: {
        title: '养老金测算器',
        subheading: '蛮牛伙伴帮助您测算养老金',
      },
      // 展业工具分享设置查询

      type: 400, // 测评类型（100：财富金矿；200：性向测试，性格色彩测试）
      userId: '',
      baseInfoId: '', //  测评信息ID
      isFirstSignUp: false, // 是否第一次答题
      sharePic,
      barHeight: this.$appInterface.getStatusBar(),
      appModelDate: {},
      recordID: '',
      resultlist: [], // 测试结果
      cardDate: {}, // 名片信息
      isShowBack: true,
      htmlTitle: '养老金测算器',
      sharePicture: process.env.VUE_APP_OSS_CS_URL + '/h5-agent-business/annuity.png',
      isAndroid: false,
    };
  },
  beforeRouteLeave(to, from, next) {
    console.log('beforeRouteLeave', to, from, next);
    next();
  },
  computed: {
    judgeEnvIsWechat() {
      return this.$appInterface.judgingIsWeChart();
    },
  },
  watch: {
    pageType: {
      handler(newName, oldName) {
        this.pageType = newName;
        if (newName == 0 || newName == 1) {
          this.htmlTitle = '养老金测算器';
          document.title = '养老金测算器';
        } else {
          this.htmlTitle = '测算结果';
          document.title = '测算结果';
        }
        console.log('养老金组件显示更新-newName -', newName, this.htmlTitle);
        console.log('养老金组件显示-oldName -', oldName, this.htmlTitle);
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    htmlTitle: {
      handler(newName, oldName) {
        this.htmlTitle = newName;
        console.log('养老金组件-htmlTitle-newName -', newName, this.htmlTitle);
        console.log('养老金组件-htmlTitle-oldName -', oldName, this.htmlTitle);
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    document.title = '养老金测算器';
    this.barHeight = this.$appInterface.getStatusBar();
    this.getQuery();
    const query = this.$route.query;
    this.$appInterface.isShowNavBar(false); // 关闭原生标题
    this.agentId = !this.judgeEnvIsWechat ? this.$appInterface.getCreateId() || '782994890127572992' : this.$route.query.agentId || '782994890127572992';
    this.id = query?.id ? query.id : '833716936419311616';
    console.info('展业名片-getBusinessCard', this.agentId);
    this.getBusinessCard();
    console.info('加载分享图', this.sharePicture);
  },
  mounted() {},
  methods: {
    // 获取参数
    getQuery() {
      this.isWeChart = this.$appInterface.judgingIsWeChart();
      this.isAppOpne = this.$appInterface.getToken() || '';
      console.log(this.isWeChart, '判断是否是微信环境'); // 判断是否是微信环境
      console.log('微信环境判断-judgeEnvIsWechat', this.judgeEnvIsWechat);
      console.log('微信环境判断-isAppOpne', this.isAppOpne);
      const query = this.$route.query;
      this.agentId = !this.judgeEnvIsWechat ? this.$appInterface.getCreateId() || '782994890127572992' : this.$route.query.agentId || '782994890127572992';
      this.id = query?.id ? query.id : '833716936419311616';
      this.agentId = !this.isWeChart ? this.$appInterface.getCreateId() || '' : this.$route.query.agentId || '';
      console.log('this.agentId:', this.agentId);
      this.id = query?.id ? query.id : '';
      console.log('this.id:', this.id);
      console.log('(this.isWeChart || !this.isAppOpne:', this.judgeEnvIsWechat || !this.isAppOpne);
      if (this.judgeEnvIsWechat && !this.isAppOpne) {
        // if (this.isWeChart) {
        console.log('微信环境', this.judgeEnvIsWechat);
        this.checkAuthProcess();
      } else {
        console.log('非微信环境');
        this.$nextTick(() => {
          this.pageType = 1;
          document.title = '养老金测算器';
          this.getExhibitionList(2);
        });
      }
    },
    async checkAuthProcess() {
      console.log('初始化微信活动主流程-query', this.$route.query);
      const { agentId = '', id = '', organLevel = '', code = '', shareId = '', name = '' } = this.$route.query;
      this.params = { agentId, id, organLevel, shareId, name };
      console.log('初始化微信活动主流程-params', this.params);
      if (!code) {
        console.log('初始化微信活动主流程-!code', code, !code);
        await redirectWeChatByAppId(this.params);
      }
      // 初始化微信活动主流程
      this.wxUserInfo = await initWeChatActivity(code);
      console.log('初始化微信活动主流程-this.wxUserInfo ', this.wxUserInfo);
      this.pageType = 1;
      document.title = '养老金测算器';
      // this.openId = this.wxUserInfo ? this.wxUserInfo.openid : 'oi-jG5y_2FS7BDiPW-PV2nvnHlds';
      this.openId = this.wxUserInfo ? this.wxUserInfo.openid : '';
      console.log('初始化微信活动主流程-this.openId ', this.openId);
      // await this.isFirst();
      await this.getExhibitionList(2);
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
      console.log({
        title: '养老金测算器',
        desc: '蛮牛伙伴帮助您测算养老金',
        imgUrl: process.env.VUE_APP_OSS_CS_URL + '/h5-agent-business/annuity.png',
        link: process.env.VUE_APP_SERVICE_URL + '/h5-agent-business/annuity' + serialize({ agentId: this.agentId, id: this.id } || ''),
      });
      return {
        title: '养老金测算器',
        desc: '蛮牛伙伴帮助您测算养老金',
        imgUrl: process.env.VUE_APP_OSS_CS_URL + '/h5-agent-business/annuity.png',
        link: process.env.VUE_APP_SERVICE_URL + '/h5-agent-business/annuity' + serialize({ agentId: this.agentId, id: this.id } || ''),
      };
    },
    // 获取填写注册的手机号
    getMobile(params) {
      console.log('获取填写注册的手机号', params);
      this.mobile = params;
    },
    // 判断用户是否是第一次测试
    async isFirst() {
      const param = {
        openId: this.openId,
        agentId: this.agentId,
        type: this.type,
        // mobile: this.mobile || '',
      };
      console.log('判断用户是否是第一次测试-param:', param);
      await this.$store.dispatch('character/selectIsSignUp', param).then((res) => {
        console.log('res判断用户是否是第一次测试-----', res);
        if (res.code === 200) {
          this.isFirstSignUp = res.data.isFirst ? res.data.isFirst : false;
          if (res.data.isFirst) {
            console.log('未报名-第一次答题', res.data.isFirst);
            // this.mobile = res.data.mobile;
          } else {
            console.log('已经答题了');
          }
        }
      });
    },
    // 界面显示处理 处理答题数据
    dealData(param, from) {
      // 继续答题
      if (param.status === '2') {
        console.log('请继续答题--', this);
        this.pageType = 2;
        document.title = '测算结果';
      }
      if (param.status === '3') {
        this.currentNum = 1;
        console.log('首页', this.questionArr); // 默认页面
        this.questionArr.forEach((ele) => {
          ele.answer = '';
        });
        this.pageType = 1;
        document.title = '养老金测算器';
      }
      if (param.status === '3' && from === 'signUp') {
        this.currentNum = 1;
        console.log('首页-清楚答题数据（answer）-进入答题页', this.questionArr); // 默认页面
        this.questionArr.forEach((ele) => {
          ele.answer = '';
        });
        this.pageType = 2;
        document.title = '测算结果';
      }
      // 再次答题
      if (param.status === '3' && from === 'nextText') {
        this.currentNum = 1;
        console.log('首页', this.questionArr); // 默认页面
        this.questionArr.forEach((ele) => {
          ele.answer = '';
        });
        this.pageType = 1;
        document.title = '养老金测算器';
      }
    },
    // 保存转发/浏览次数
    getExhibitionList(type) {
      const params = {
        id: this.id,
        type: type, // 浏览2，转发1
        agentId: this.agentId,
        openId: this.openId || '',
      };
      console.log('保存展业的转发/浏览次数params', params);
      this.$store.dispatch('challenge/saveRecord', params);
    },
    // 跳转组件
    updateType(data) {
      /**
       * data : { page: '跳转的组件', params: { key:value } }
       */
      this.pageType = parseInt(data.type);
      this.getResult = data.getResult ? data.getResult : this.getResult;
      console.log('主页-报名', data);
      const { type, params } = data;
      this.pageType = parseInt(type);
      if (this.pageType == 0 || this.pageType == 1) {
        this.htmlTitle = '养老金测算器';
        document.title = '养老金测算器';
      } else {
        this.htmlTitle = '测算结果';
        document.title = '测算结果';
      }
      const userId = params ? params.userId : this.userId;
      console.log('主页-报名-pageType', this.pageType);
      console.log('主页-报名--getResult', this.getResult);
      console.log('主页-报名--userId', userId);
      if (type) {
        // this.pageType = parseInt(pageType);
        console.log('主页-报名-params-isFirst', { ...params, agentId: this.agentId, id: this.id, userId: userId });
        if (params) {
          if (params.isFirst) {
            this.$refs.home.isGuide = true;
          }
        }
      }
    },
    goBack() {
      console.log('pageType:', this.pageType);
      // if (this.pageType != 1) {
      //   this.pageType = 1;
      //   // 深拷贝赋值
      //   this.appModelDate = Object.assign({}, this.$store.state.oldAgePensionState);
      // } else {
      //   this.$appInterface.goBack();
      // }
      this.$appInterface.goBack();
    },
    async changeAppFormData(key, val) {
      console.log(key, val, 'changeAppFormData-index');
      if (key == 'recordID') {
        this.recordID = val;
      } else if (key == 'resultText') {
        this.resultlist = val;
      }
    },
    changeResult(date) {
      console.log(date, 'changeResult-index');
    },
    recordIDValue(childValue) {
      // childValue就是子组件传过来的值
      console.log('recordID', childValue, this.recordID);
      this.recordID = childValue;
    },
    // 获取名片信息
    getBusinessCard() {
      console.info('名片传参=====>:', this.agentId);
      const parm = {
        userId: this.agentId, // 微信内agentId  app内createdId
      };
      console.info('展业名片-入参=====>parm', parm);
      if (parm.userId) {
        this.$store.dispatch('acquisition/wtSelectAgentBusinessCard', parm).then((res) => {
          const data = res.data;
          console.log('展业名片-信息====>res', res);
          if (res.data) {
            this.cardDate = { ...res.data };
            this.cardDate.baseInfo.portrait = data.baseInfo.portrait.replace(/^http:\/\//i, 'https://');
          }
        });
      }
    },
    getBusinessCardII() {
      console.info('养老金-名片传参=====>:', this.agentId);
      const parm = {
        userId: this.agentId, // 微信内agentId  app内createdId
      };
      console.info('养老金-展业名片-入参=====>parm', parm);
      if (parm.userId) {
        this.$store.dispatch('annuity/wtSelectAgentBusinessCard', parm).then((res) => {
          console.log('养老金-展业名片-信息====>res', res);
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
  background: #f7f8f9;
  position: fixed;
  overflow: hidden;
  &-scroll {
    height: 76%;
    max-height: 76%;
    overflow-y: auto;
  }
  .weChart-scroll {
    height: 100%;
    max-height: 100%;
    .home_container {
      padding-bottom: 90px;
    }
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
  .isShowBack {
    /deep/ .van-icon-arrow-left::before {
      content: '' !important;
    }
  }
}

@media (min-height: 790px) {
  .container {
    .container-scroll {
      height: 80%;
      max-height: 80%;
      overflow: hidden;
    }
    .weChart-scroll {
      height: 100%;
      max-height: 100%;
      overflow-y: auto;
      .home_container {
        padding-bottom: 0px;
      }
    }
  }
}
</style>
