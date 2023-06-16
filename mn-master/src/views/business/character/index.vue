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
      :userId="userId"
      :baseInfoId="baseInfoId"
      :hasMobile="mobile"
      :wxUserInfo="wxUserInfo"
      :isFirstSignUp="isFirstSignUp"
      @getMobile="getMobile"
      @updateType="updateType"
      @getExhibitionList="getExhibitionList"
    />
    <!-- 挑战页面 -->
    <Questions
      v-if="pageType === 2"
      :agentId="agentId"
      :id="id"
      :current="currentNum"
      :mobile="mobile"
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
      :mobile="mobile"
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
// import SignupDialog from '@/components/signupDialog';
// import { selectQuestionList } from '@/api/challenge';
import sharePic from '@/assets/FPAptitude/character.png';
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
      params: {
        agentId: '',
        id: '',
        type: '',
        shareId: '',
      },
      getResult: {}, // 测试结果
      wxUserInfo: {},
      mobile: '',
      getParams: {}, // 获取答题情况
      allTopic: [],
      currentNum: 1, // 已答的最大题号
      questionArr: [],
      infoDetail: {}, // 展业工具首页信息查询
      infoShare: {}, // 展业工具分享设置查询

      type: 300, // 测评类型（100：财富金矿；200：性向测试，性格色彩测试）
      userId: '',
      baseInfoId: '', //  测评信息ID
      isFirstSignUp: true, // 是否第一次答题
      sharePic,
    };
  },
  computed: {
    judgeEnvIsWechat() {
      return this.$appInterface.judgingIsWeChart();
    },
  },
  created() {
    this.getQuery();
    console.info('FPA性格色彩测试0.55');
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
      console.log('query', query);
      this.agentId = !this.judgeEnvIsWechat ? this.$appInterface.getCreateId() || '782994890127572992' : this.$route.query.agentId || '782994890127572992';
      this.id = query?.id ? query.id : '833716936419311616';
      // this.agentId = !this.isWeChart ? this.$appInterface.getCreateId() || '' : this.$route.query.agentId || '';
      // console.log('this.agentId:', this.agentId);
      // this.id = query?.id ? query.id : '';
      // console.log('this.id:', this.id);
      this.getBaseinfoDetail();
      console.log('(this.isWeChart || !this.isAppOpne:', this.judgeEnvIsWechat || !this.isAppOpne);
      if (this.judgeEnvIsWechat && !this.isAppOpne) {
        // if (this.isWeChart) {
        console.log('微信环境', this.judgeEnvIsWechat);
        this.checkAuthProcess();
      } else {
        console.log('非微信环境');
        this.getQuestionList();
        this.$nextTick(() => {
          this.getExhibitionList(2);
        });
      }
    },
    async checkAuthProcess() {
      console.log('初始化微信活动主流程-query', this.$route.query);
      const { agentId = '', id = '', organLevel = '', code = '', shareId = '' } = this.$route.query;
      this.params = { agentId, id, organLevel, shareId };
      console.log('初始化微信活动主流程-params', this.params);
      if (!code) {
        console.log('初始化微信活动主流程-!code', !code);
        await redirectWeChatByAppId(this.params);
      }
      // 初始化微信活动主流程
      this.wxUserInfo = await initWeChatActivity(code);
      console.log('初始化微信活动主流程-this.wxUserInfo ', this.wxUserInfo);
      // this.openId = this.wxUserInfo ? this.wxUserInfo.openid : 'oi-jG5y_2FS7BDiPW-PV2nvnHlds';
      this.openId = this.wxUserInfo ? this.wxUserInfo.openid : '';
      console.log('初始化微信活动主流程-this.openId ', this.openId);
      await this.isFirst();
      // await this.getQuestionList();
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
      const customerShareTitle = 'FPA性格色彩测试';
      const customerShareDesc = '每个问题的答案都不存在好坏对错，不同的选项只是表明不同性格对同一种情况的不同反应';
      console.log({
        title: customerShareTitle,
        desc: customerShareDesc,
        imgUrl: this.sharePic || process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/character.png',
        link: process.env.VUE_APP_SERVICE_URL + '/h5-agent-business/character?agentId=' + this.agentId + '&id=' + this.id,
      });
      return {
        title: customerShareTitle,
        desc: customerShareDesc,
        imgUrl: this.sharePic || process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/character.png',
        // link: transFullPath() + serialize(this.params),
        link: process.env.VUE_APP_SERVICE_URL + '/h5-agent-business/character?agentId=' + this.agentId + '&id=' + this.id,
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
            this.pageType = 1;
            console.log('未报名-第一次答题', res.data.isFirst);
            // this.mobile = res.data.mobile;
          } else {
            // this.checkStatus();
            this.getQuestionList();
            console.log('已经答题了');
          }
        }
      });
    },
    // 获取答题情况以及题库
    checkStatus(getParams, from) {
      if (!this.judgeEnvIsWechat) {
        console.log('获取答题情况以及题库--显示首页');
        this.pageType = 1;
        return;
      }
      const param = {
        agentId: this.agentId,
        baseInfoId: this.id,
        openId: this.openId,
      };
      this.$store.dispatch('character/selectPersonOptionList', param).then((res) => {
        console.log('获取答题情况-----', res);
        console.log('获取答题情况-----.personOptionRecords.length', res.data.personOptionRecords.length);
        console.log('获取答题情况-----personRecordId, !personRecordId', res.data.personRecordId, !res.data.personRecordId);
        if (res.code === 200) {
          if (res.data.personOptionRecords.length === 0 && !res.data.personRecordId) {
            // 用户没有参加过测评
            this.getParams.status = '3'; // 进入答题页未选择，再次进入为结果页
            // this.getParams.status = '2'; // 进入答题页未选择，再次仍未答题页
            console.log('获取答题情况以及题库-用户没有参加过测评-getParams', this.getParams, from);
            this.handleFunc(this.getParams, from);
          }
          if (res.data.personOptionRecords.length !== 0) {
            // 用户已经测试过了,并未完成测试
            this.getParams.status = '2';
            this.getParams.list = res.data.personOptionRecords;
            console.log('获取答题情况以及题库-用户已经测试过了,并未完成测试--getParams', this.getParams);
            this.handleFunc(this.getParams, 'openLink');
          }
          if (res.data.personOptionRecords.length === 0 && res.data.personRecordId) {
            // 用户已经测试过了,并完成测试了
            this.getParams.status = '1';
            console.log('获取答题情况以及题库-用户已经测试过了,并完成测试了--getParams', this.getParams);
            this.handleFunc(this.getParams, 'openLink');
          }
        }
      });
    },
    // 根据答题情况，做不同处理
    handleFunc(param, from) {
      console.log('根据答题情况，做不同处理-param', param);
      if (param.status === '1') {
        console.log('已参与性向测试,显示答题结果页面');
        this.pageType = 3;
      } else {
        console.log('未参与性向测试-param', param);
        console.log('未参与性向测试-from', from);
        this.dealData(param, from);
      }
    },

    // 展业工具题目列表查询
    getQuestionList(getParams, from) {
      console.info('展业工具题目列表查询-1');
      this.$store.dispatch('challenge/selectQuestionList', { baseInfoId: this.id }).then((res) => {
        console.log('展业工具题目列表数据', res);
        if (res.code === 200) {
          this.allTopic = res.data;
          console.log('展业工具题目列表数据-code:200', this.allTopic);
          this.checkStatus(getParams, from);
          // console.log('题目列表查询-判断是否微信环境-judgeEnvIsWechat', this.judgeEnvIsWechat);
          // if (this.judgeEnvIsWechat) {
          //   console.log('题目列表查询-微信环境');
          //   if (!this.isFirstSignUp) {
          //     console.log('处理答题数据-checkStatus调用');
          //     this.checkStatus();
          //   }
          // } else {
          //   console.log('题目列表查询-非微信环境');
          //   this.checkStatus();
          // }
        }
      });
    },
    // 处理答题数据
    dealData(param, from) {
      console.log('处理答题数据-allTopic:', this.allTopic);
      console.log('处理答题数据-param:', param);
      console.log('处理答题数据-from:', from);
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
        console.log('处理答题数据questionArr-list', this.questionArr.length, param.list.length, this.questionArr.length == param.list.length);
        if (this.questionArr.length == param.list.length) {
          console.log('处理答题数据-题目已经全部作答');
          this.currentNum = param.list.length;
        } else {
          console.log('处理答题数据-继续作答');
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
      if (param.status === '3') {
        this.currentNum = 1;
        console.log('首页', this.questionArr); // 默认页面
        this.questionArr.forEach((ele) => {
          ele.answer = '';
        });
        this.pageType = 1;
      }
      if (param.status === '3' && from === 'signUp') {
        this.currentNum = 1;
        console.log('首页-清楚答题数据（answer）-进入答题页', this.questionArr); // 默认页面
        this.questionArr.forEach((ele) => {
          ele.answer = '';
        });
        this.pageType = 2;
      }
      // 再次答题
      if (param.status === '3' && from === 'nextText') {
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
    updateType(data) {
      /**
       * data : { page: '跳转的组件', params: { key:value } }
       */
      this.pageType = parseInt(data.type);
      this.getResult = data.getResult ? data.getResult : this.getResult;
      console.log('主页-报名', data);
      const { type, params } = data;
      this.pageType = parseInt(type);
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
