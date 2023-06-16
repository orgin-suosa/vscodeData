<template>
  <div class="challenge wx_container" :style="{ backgroundImage: homePageImg ? 'url(' + homePageImg + ')' : '' }">
    <div class="text_contentScroll">
      <van-image :src="require('@/assets/FPAptitude/qs-bg.jpg')" fit="contain" />
      <div class="bg_react"></div>
      <div class="text_content">
        <div class="text_card">
          <div class="titleText_box">
            <van-image class="icon_title" :src="require('@/assets/FPAptitude/titleLeft.jpg')" fit="contain" />
            <p class="titleText">FPA性格色彩测试</p>
            <van-image class="icon_title" :src="require('@/assets/FPAptitude/titleRight.jpg')" fit="contain" />
          </div>
          <div class="text_card_conent">
            <p>
              每个问题的答案都不存在好坏对错，不同的选项只是表明不同性格对同一种情况的不同反应，答案只是帮助你思考你是否认识真正的自己。请选择最符合你的句子。每组只可选一个答案。
              <br />
              注意： <br />
              1．你回答的问题是“我是谁”，而非“我应该是谁”或“我想是谁”。 <br />
              2. 当你做判断出现犹豫时，以你最自然和未经训练的本能反应为准。
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="tag" v-if="!isWeChart" @click="pkDetail">
      参与情况
    </div>
    <!-- <div class="button">
      <img class="share_btn" src="@/assets/challenge/share_button.png" alt="" @click="onShare" />
      <img class="pk_btn" src="@/assets/challenge/experience_button.png" alt="" @click="jumpTest" />
    </div> -->
    <div class="footer">
      <div class="button_box">
        <div class="button share_btn" @click="onShare">
          立即邀请
        </div>
        <div class="button pk_btn" @click="onTest">
          开始评估
        </div>
      </div>

      <div class="book">
        <!-- <div class="img">
          <van-image :src="require('@/assets/images/book-icon.png')" width="17" height="17" />
        </div> -->
        <i class="book-icon"></i>
        <p class="text">
          参考文献：《跟乐嘉学性格色彩》性格色彩简易测试
          <a :href="url" target="_blank" @click="blank">
            {{ url }}
          </a>
        </p>
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
export default {
  name: 'Home',
  components: {
    Guide,
    SignupDialog,
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
    };
  },
  computed: {},
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
    // 开始评估
    onTest() {
      console.log("document.title", document.title);
      this.$gdp('acquisition_tools_start_evaluation', {tabName: document.title });
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
.wx_container {
  background-color: #ffffff;
  position: relative;
  height: 100vh;
  .text_contentScroll {
    padding-bottom: 1rem;
    overflow-y: auto;
    background-color: #ffffff;
  }
  .bg_react {
    width: 7.5rem;
    height: 1.5rem;
    background: rgba(214, 239, 246, 0.5);
    background: linear-gradient(rgba(214, 239, 246, 1), #ffffff);
    position: absolute;
    margin-top: -0.35rem;
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
    position: relative;
    top: -0.6rem;
    background-color: #ffffff;
    width: 7.02rem;
    background: #ffffff;
    border-radius: 0.24rem;
    box-shadow: 0 -0.08rem 0.08rem 0 rgba(0, 0, 0, 0.03);
    overflow: hidden;
    margin: 0 auto;
    .titleText_box {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 0.4rem;
      padding-bottom: 0.3rem;
      .icon_title {
        width: 0.36rem;
      }
      .titleText {
        font-size: 0.4rem;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 700;
        text-align: center;
        color: #00c5cd;
      }
    }
    .text_card_conent {
      width: 6.44rem;
      height: 5.4rem;
      opacity: 1;
      margin: 0 auto;
      padding-bottom: 0.5rem;
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
