<template>
  <div class="challenge wx_container" :style="{ backgroundImage: homePageImg ? 'url(' + homePageImg + ')' : '' }">
    <div class="text_contentScroll">
      <van-image :src="topImg" alt="" fit="contain" onerror="this.src='@/assets/questionnaire/defaultImg.png';this.onerror=null" />
      <div class="text_content">
        <div class="text_card">
          <div class="text_card_conent">
            <p class="titleText">
              感谢您能抽出几分钟时间来参加本次答题，现在我们就马上开始吧！
            </p>
            <Questions :agentId="agentId" :id="id" :current="currentNum" :questionArr="questionArr" :backgroundColor="backgroundColor" :wxUserInfo="wxUserInfo" @updateType="updateType" />
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="button">
      <img class="share_btn" src="@/assets/challenge/share_button.png" alt="" @click="onShare" />
      <img class="pk_btn" src="@/assets/challenge/experience_button.png" alt="" @click="jumpTest" />
    </div> -->
    <div class="footer">
      <div class="button_box">
        <!-- <div class="button Submit_btn" @click="onShare">
          立即邀请
        </div>
        <div class="button pk_btn" @click="onTest">
          开始评估
        </div> -->
        <!-- <div class="button submit_btn" @click="onShare">
          提交问卷
        </div> -->
      </div>
    </div>
    <!-- 填写报名信息 -->
    <van-overlay :show="showDialog">
      <signup-dialog :user-id="agentId" :wx-user-info="wxUserInfo" :type="type" @onConfirm="signUp" @onCancel="onCancel" />
    </van-overlay>
    <Guide v-if="isGuide" @onHide="onHide" />
  </div>
</template>

<script>
import { shareClick } from '@/utils/wechatAuth';
import Guide from '@/components/guide';
// import { getFirstMainId } from '@/api/acquisition';
import { selectIsSignUp } from '@/api/character';
import sharePic from '@/assets/FPAptitude/character.png';
import SignupDialog from '@/components/signupDialog';
import Questions from './questions';
export default {
  name: 'Home',
  components: {
    Guide,
    SignupDialog,
    Questions,
  },
  props: {
    openId: {
      type: String,
      default: '',
    },
    agentId: {
      type: String,
      default: '',
    },
    isWeChart: {
      type: Boolean,
      default: false,
    },
    homePageImg: {
      type: String,
      default: '',
    },
    infoShare: {
      type: Object,
      default: () => {},
    },
    id: {
      type: String,
      default: '',
    },
    wxUserInfo: {
      type: Object,
      default: () => {},
    },
    userId: {
      type: String,
      default: '',
    },
    baseInfoId: {
      type: String,
      default: '',
    },
    hasMobile: {
      type: String,
      default: '',
    },
    isFirstSignUp: {
      type: Boolean,
    },
    current: {
      type: Number,
      default: 1,
    },
    questionArr: {
      type: Array,
      default: () => [],
    },
    backgroundColor: {
      type: String,
      default: '',
    },
    currentNum: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      firstPk: true,
      showDialog: false, // 是否显示填写报名信息 -
      buttonType: false,
      isGuide: false,
      infoDetail: {},
      wxUserId: '',
      type: 300, // 测评类型（100：财富金矿；200：性向测试，性格色彩测试）
      sharePic,
      url: 'https://jinshuju.net/f/MWyKgR',
      topImg: require('@/assets/questionnaire/defaultImg.png'),
    };
  },
  computed: {
    judgeEnvIsWechat() {
      return this.$appInterface.judgingIsWeChart();
    },
  },
  created() {},
  methods: {
    // 参与情况
    pkDetail() {
      console.log('参与情况-this.id ', this.id);
      this.$router.push({
        path: '/fPAparticipateList',
        query: { baseInfoId: this.id, openId: this.openId },
      });
    },
    updateType(data) {
      this.$parent.updateType(data);
    },
    // 开始评估
    onTest() {
      console.log('开始评估-,wxUserInfo', this._props.wxUserInfo, this.wxUserInfo);
      console.log('开始评估-userId', this._props.userId, this.userId);
      console.log('开始评估-hasMobile,agentId', this._props.hasMobile, this._props.agentId);
      console.log(this.$appInterface.getCreateId(), 'this.$appInterface');
      if (this.$appInterface.getCreateId()) {
        const getParams = { status: '3' };
        console.log('开始评估-调用父组件-dealData-1111:', getParams);
        this.$parent.dealData(getParams, 'signUp');
        return;
      }

      console.log('开始评估-!this.$appInterface.getCreateId() && this._props.hasMobile', !this.$appInterface.getCreateId() && this._props.hasMobile);
      if (!this.$appInterface.getCreateId() && this._props.hasMobile) {
        const getParams = { status: '2' };
        console.log('开始评估-调用父组件-dealData-22222:', getParams);
        this.$parent.dealData(getParams, 'signUp');
      } else {
        console.log('开始评估-是否第一次登录-isFirstSignUp:', this.isFirstSignUp);
        if (this.isFirstSignUp) {
          // 微信环境，第一次答题报名登录
          this.showDialog = true;
          console.log('开始评估++++++++第一次答题:');
        } else {
          const getParams = { status: '3' };
          console.log('开始评估-------非第一次答题:', getParams);
          this.$parent.dealData(getParams, 'signUp');
        }
      }
    },
    // 提交报名信息
    signUp(data, mobile) {
      console.log('提交报名信息');
      this.$emit('getMobile', mobile);
      this.mobile = mobile;
      if (data) {
        console.log('提交报名信息-data', data);
        this.showDialog = false;
        const getParams = { status: '3' };
        console.log('提交报名信息-getParams', getParams);
        this.$parent.getQuestionList(getParams, 'signUp');
        // const getParams = { status: '3' };
        // this.$parent.dealData(getParams, 'signUp');
      }
    },
    // 取消
    onCancel() {
      this.showDialog = false;
    },
    // 去测试
    async jumpTest() {
      console.log('开始测评-params', { userId: this.userId, agentId: this.agentId, id: this.id });
      console.log('开始测评- this.wxUserInfo', this.wxUserInfo);
      if (!this.isWeChart) {
        console.log('app答题', !this.isWeChart);
        this.$parent.dealData({ status: '3' }, 'signUp');
        // return this.$emit('updateType', { type: '1', params: { userId: this.userId, agentId: this.agentId, id: this.id } });
        return this.$emit('updateType', { type: '1', params: { userId: this.userId, openId: this.openId, agentId: this.agentId, type: this.type } });
      }
      console.log('开始测评-点击去测试获取openid', this.openId);
      if (!this.openId && this.isWeChart && this.isWeChart != null) {
        return;
      }
      // if (!this.isWeChart) {
      //   this.$parent.dealData({ status: '3' }, 'signUp');
      // }
      // this.$emit('updateType', { type: 2 });
      console.log('开始测评-是否报名-isFirstTest-入参', { openId: this.openId, agentId: this.agentId, type: this.type });
      const data = await this.isFirstTest({ openId: this.openId, agentId: this.agentId, type: this.type });
      console.log('开始测评-是否报名-isFirstTest-出参:', data);
      console.log('开始测评-是否报名:', data.isFirst);
      this.wxUserId = data.userId;
      if (data.isFirst) {
        // this.showDialog = true;
        // 第一次填问卷,跳转报名弹框
        console.log('开始测评-是否报名-第一次填问卷,跳转报名弹框');
        this.$emit('updateType', { type: '1', params: { isFirst: data.isFirst, userId: this.userId, openId: this.openId, agentId: this.agentId, type: this.type } });
      } else {
        // this.signUp(data.userId);
        // 填过问卷，跳转到答题页
        console.log('开始测评-是否报名- 填过问卷，跳转到答题页');
        this.$parent.checkStatus();
        this.$emit('updateType', { type: '2', params: { userId: this.userId, openId: this.openId, agentId: this.agentId, type: this.type } });
      }
    },
    // 微信用户是否是第一次答题
    isFirstTest(params) {
      console.log(params, '微信用户是否是第一次答题-params');
      return new Promise((resolve, reject) => {
        selectIsSignUp(params)
          .then((res) => {
            console.log(res, '微信用户第一次答题');
            resolve(res.data);
          })
          .catch((err) => {
            console.log(err, '微信用户答过题报错');
          });
      });
    },
    // 邀请好友测试
    onShare() {
      console.log("document.title", document.title);
      this.$gdp('acquisition_tools_quick_share', {tabName: document.title });
      console.log('邀请好友测试isWeChart', this.isWeChart);
      if (this.isWeChart) {
        this.onGuide();
        return;
      }
      this.$emit('getExhibitionList', 1);
      const param = {
        title: 'FPA性格色彩测试',
        content: '每个问题的答案都不存在好坏对错，不同的选项只是表明不同性格对同一种情况的不同反应',
        picture: this.sharePic || process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/character.png',
        url: shareClick('/character', { agentId: this.agentId, id: this.$route.query.id }) || '',
      };
      this.$appInterface.shareUrl(param);
    },
    // 引导用户用微信的转发
    onGuide() {
      this.isGuide = true;
    },
    onHide() {
      this.isGuide = false;
    },
    blank() {
      if (!this.wxUserInfo.openid) {
        this.$appInterface.goToH5Page({
          urlPath: this.url,
          navigation: true,
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.challenge {
  background-color: rgba(247, 248, 249, 1);
}
.wx_container {
  background-color: rgba(247, 248, 249, 1);
  position: relative;
  height: 100vh;
  .text_contentScroll {
    padding-bottom: 1rem;
    overflow-y: auto;
  }
  .tag {
    width: 1.14rem;
    height: 0.46rem;
    opacity: 1;
    background: linear-gradient(180deg, #ff936e 29%, #ab3905 100%);
    border-radius: 0.24rem 0 0 0.24rem;
    opacity: 1;
    font-size: 0.24rem;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: center;
    color: #ffffff;
    line-height: 0.46rem;
    letter-spacing: 0px;
    position: fixed;
    top: 0.8rem;
    right: 0;
  }
  .text_content {
    overflow: hidden;
    margin: 0 auto;
    .text_card_conent {
      width: 7.5rem;
      // min-height: 5.4rem;
      opacity: 1;
      margin: 0 auto;
      padding-bottom: 0.5rem;
      overflow-y: auto;
      .titleText {
        display: inline-block;
        width: 6.9rem;
        font-size: 0.3rem;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #666666;
        padding: 0.3rem;
      }
      p {
        font-size: 0.28rem;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #333333;
        line-height: 0.5rem;
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    bottom: 0px;
    width: 100%;
    overflow-x: hidden;
    padding-bottom: 0.35rem;
    background-color: transparent;
    .button_box {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      width: 100%;
      padding-top: 0.7rem;
      z-index: 9;
      // padding-bottom: 0.2rem;
    }
    .button {
      margin-bottom: 65px;
      color: #ffffff;
      font-size: 0.3rem;
      width: 2.56rem;
      height: 0.74rem;
      line-height: 0.74rem;
      background: linear-gradient(90deg, #00dddd, #00c5cd);
      border-radius: 0.48rem;
    }
    .submit_btn {
      width: 3.98rem;
      height: 0.82rem;
      margin: 0 auto;
      background: linear-gradient(315deg, #009c64, #29c38c);
      border-radius: 0.48rem;
      box-shadow: 0px 0.04rem 0.2rem 0px rgba(0, 156, 100, 0.3);
      font-size: 0.3rem;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: center;
      color: #ffffff;
    }
    .oneButton {
      width: 5.1rem;
      height: 0.96rem;
      line-height: 0.96rem;
      opacity: 1;
      background: linear-gradient(90deg, #00dddd, #00c5cd);
      border-radius: 0.48rem;
    }
    .book {
      width: 100%;
      position: absolute;
      display: flex;
      flex-direction: row;
      bottom: 0;
      padding-left: 35px;
      // line-height: 52px;
      background-color: #f5f6f7;
      text-align: left;
      font-size: 12px;
      color: #333333;
      vertical-align: baseline;
      padding-top: 0.3rem;
      padding-bottom: 0.55rem;
      .book-icon {
        display: inline-block;
        width: 0.34rem;
        height: 0.34rem;
        background: url('~@/assets/images/book-icon.png') no-repeat;
        background-size: contain;
        margin-right: 0.15rem;
      }
      .img {
        margin-right: 4px;
      }
      .text {
        white-space: break;
        // word-break: break-all;
        a {
          cursor: pointer;
          color: #00c5cd;
        }
      }
    }
  }
}
</style>
