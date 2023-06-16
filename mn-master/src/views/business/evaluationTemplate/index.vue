<template>
  <div class="container">
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
      :baseInfoId="baseInfoId"
      :hasMobile="mobile"
      :wxUserInfo="wxUserInfo"
      :isFirstSignUp="isFirstSignUp"
      :dealData="dealData"
      :getQuestionList="getQuestionList"
      :checkStatus="checkStatus"
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
      :infoDetail="infoDetail"
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
      :dealData="dealData"
      :infoDetail="infoDetail"
      @updateType="updateType"
      @getExhibitionList="getExhibitionList"
    />
    <div class="wait" v-if="pageType === 0">
      <img class="wait_img" src="@/assets/challenge/wait.gif" alt="" />
    </div>
  </div>
</template>

<script>
import { serialize, transFullPath, redirectWeChatByAppId, initWeChatActivity, addListenWeChatForward } from '@/utils/wechatAuthUtil';
import Home from './components/home';
import Questions from './components/questions';
import Result from './components/result';
import sharePic from '@/assets/FPAptitude/character.png';
export default {
  name: 'EvaluationTemplate',
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
      getResult: {
        createdTime: '2021-06-25 14:48:26',
        result: '本地数据',
        resultAnalyse:
          '<p class="MsoNormal"><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">思想深邃</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;">&nbsp;</span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">情感脆弱</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">默默关怀他人</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;">&nbsp;</span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">喜好批判和挑剔</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">敏感而细腻</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;">&nbsp;</span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">不主动与人沟通</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">计划性强</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;">&nbsp;</span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">患得患失<br /><br /></span></span><span style="color: #33cccc;"><strong><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">性格优势:</span></span></strong></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">作为个体：严肃的生活哲学。思想深邃，独立思考而不盲目从众。沉默寡言，老成持重。注重承诺，可靠安全。谨慎而深藏不露。坚守原则，责任心强。遵守规则，井井有条。深沉有目标的理想主义。敏感细腻。高标准，追求完美。谦和稳健。善于分析，富有条理。待人忠诚，富有自我牺牲精神。深思熟虑，三思而后行。坚韧执着。</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">沟通特点：享受敏感而有深度的交流。设身处地地体会他人。能记住谈话时共鸣的感情和思想。喜欢小群体交流的思想碰撞。关注谈话的细节。</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">作为朋友：默默地为他人付出以表示关切和爱。对友谊忠诚不渝。真诚关怀朋友的境遇，善于体贴他人。能够记得特殊的日子。遭遇难关时，极力给予鼓舞安慰。很少向他人表达内心的看法。经常扮演解决分析问题的角色。</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">对待工作和事业：强调制度、程序、规范、细节和流程。做事之前首先计划且严格按照计划去执行。喜欢探究及根据事实行事。尽忠职守，追求卓越。高度自律。喜欢用表格、数字的管理来验证效果。注重承诺。一丝不苟地执行工作。</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;"><br /><strong><span style="color: #33cccc;">性格过当:</span></strong></span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">作为个体：高度负面的情绪化。猜忌心重，不信任他人。太在意别人的看法和评价，容易被负面评价中伤。容易沮丧，悲观消极。陷于低落的情绪无法自拔。情感脆弱抑郁，有自怜倾向。杞人忧天，庸人自扰。最容易的抑郁症患者。当别人轻易成功时，会因自己的努力付出却不如他人而心生嫉妒。过于阴沉的面孔，让人感觉压抑，不易接近。</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">沟通特点：不知不觉地说教和上纲上线。原则性强，不易妥协。强烈期待别人具有敏感度和深度能够理解自己。以为别人能够读懂自己的心思。不太主动与人沟通。不喜欢制造困扰麻烦给别人，也讨厌别人制造困扰麻烦给自己。要真诚开放心胸与人互动会比较难。习惯以防卫的状态面对别人。</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">作为朋友：过度敏感，有时很难相处。强烈的不安全感。远离人群。喜好批判和挑剔。吝于宽恕。经常怀疑别人的话，不容易相信他人。对待工作和事业对自己和他人常寄予过高而且不切实际的期望。过度计划和过度绸缪。患得患失，行动缓慢。较真，挑剔他人及自己的表现。专注于小细节，因小失大。吝啬表扬，强烈的形式主义。容易被不理想的成绩击垮斗志。墨守成规，死板教条不懂变通。为了维护原则缺乏妥协精神。</span></span></p>',
      }, // 测试结果
      wxUserInfo: {},
      mobile: '',
      getParams: {}, // 获取答题情况
      allTopic: [],
      currentNum: 1, // 已答的最大题号
      questionArr: [],
      infoDetail: {}, // 展业工具首页信息查询
      infoShare: {}, // 展业工具分享设置查询

      type: 400, // 测评类型（100：财富金矿；200：性向测试，性格色彩测试）
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
    document.title = this.$route.query.name;
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
      console.log('query', query, transFullPath(), process.env.VUE_APP_SERVICE_URL + '/h5-agent-business/evaluationTemplate' + serialize(encodeURIComponent({ name: query.name })) || '');
      this.agentId = !this.judgeEnvIsWechat ? this.$appInterface.getCreateId() || '782994890127572992' : this.$route.query.agentId || '782994890127572992';
      this.id = query?.id ? query.id : '833716936419311616';
      // this.agentId = !this.isWeChart ? this.$appInterface.getCreateId() || '' : this.$route.query.agentId || '';
      // console.log('this.agentId:', this.agentId);
      // this.id = query?.id ? query.id : '';
      // console.log('this.id:', this.id);
      this.getBaseinfoDetail();
      this.getBaseinfoShare();
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
      const { agentId = '', id = '', organLevel = '', code = '', shareId = '', name = '' } = this.$route.query;
      this.params = { agentId, id, organLevel, shareId, name };
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
      console.log({
        title: this.infoShare.title || '',
        desc: this.infoShare.subheading || '',
        imgUrl: this.infoShare.coverImg || process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/aptitude.png',
        link:
          process.env.VUE_APP_SERVICE_URL +
          '/h5-agent-business/evaluationTemplate' +
          serialize({ agentId: this.agentId, id: this.id, name: encodeURIComponent(this.$route.query.name) } || ''),
      });
      return {
        title: this.infoShare.title || '',
        desc: this.infoShare.subheading || '',
        imgUrl: this.infoShare.coverImg || process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/aptitude.png',
        link:
          process.env.VUE_APP_SERVICE_URL +
          '/h5-agent-business/evaluationTemplate' +
          serialize({ agentId: this.agentId, id: this.id, name: encodeURIComponent(this.$route.query.name) } || ''),
      };
    },
    // 获取展业工具首页信息查询
    getBaseinfoDetail() {
      this.$store.dispatch('challenge/selectBaseinfoDetail', { id: this.id }).then((res) => {
        if (res.code === 200) {
          console.log(res, 'selectBaseinfoDetail============>获取展业工具首页信息查询');
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
      this.$store.dispatch('challenge/selectPersonOptionList', param).then((res) => {
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
      console.info('展业工具题目列表查询-1-getParams, from', getParams, from);
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
      console.log('处理答题数据-param-from:', param, from);
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
  width: 7.5rem;
  height: 100%;
  overflow: hidden;
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
