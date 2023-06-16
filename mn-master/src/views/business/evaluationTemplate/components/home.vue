<template>
  <div
    class="evaluate-home wx_container"
    :class="infoDetail.templateType === 100 ? 'evaluate-home wx_container imgFill' : 'evaluate-home wx_container imageText'"
    :style="{ backgroundImage: infoDetail.backgroundImg && infoDetail.templateType === 300 ? 'url(' + infoDetail.backgroundImg + ')' : '' }"
  >
    <van-image class="defaultImage" :src="infoDetail.homePageImg" fit="fill" />
    <div v-if="infoDetail.templateType !== 100">
      <div class="evaluate-card-wrapper">
        <HomeCard :infoDetail="infoDetail" :openId="openId" :templateType="infoDetail.templateType" />
      </div>
    </div>

    <div :class="[infoDetail.allowShare === 1 ? 'btn-wrapper' : 'btn-wrapper btn-center', infoDetail.bibliographyCommon && infoDetail.bibliographyHost ? '' : 'btn-btm']">
      <div v-if="infoDetail.allowShare === 1" class="share-btn btn" @click="onShare">立刻分享</div>
      <div class="start-btn btn" @click="onTest">开始测评</div>
    </div>

    <div class="text" v-if="infoDetail.templateType === 100 && infoDetail.bibliographyHost && infoDetail.bibliographyCommon">
      <p>
        <img src="@/assets/evaluationTemplate/text1.png" />
        参考文献：{{ infoDetail.bibliographyCommon }}
      </p>
      <span @click="blank">{{ infoDetail.bibliographyHost }}</span>
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
// import noBackground from '@/assets/questionnaire/defaultImg.png';
import HomeCard from '../components/homeCard.vue';
export default {
  name: 'Home',
  components: {
    Guide,
    SignupDialog,
    HomeCard,
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
    dealData: {
      type: Function,
      default: null,
    },
    getQuestionList: {
      type: Function,
      default: null,
    },
    checkStatus: {
      type: Function,
      default: null,
    },
    infoDetail: {
      type: Object,
      default: () => {},
    },
    homePageImg: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      firstPk: true,
      showDialog: false, // 是否显示填写报名信息 -
      buttonType: false,
      isGuide: false,
      wxUserId: '',
      type: 400, // 测评类型（100：财富金矿；200：性向测试；300：性格色彩测试；400：展业工具测评；500：展业工具问卷）
      sharePic,
      sharePicture: process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/salary.png',
    };
  },
  computed: {},
  created() {
    console.log("提前加载分享图：", this.sharePicture);
  },
  mounted() {},
  methods: {
    // 开始评估
    onTest() {
      console.log("document.title", document.title);
      this.$gdp('acquisition_tools_start_evaluation', {tabName: document.title });
      if (this.$appInterface.getCreateId()) {
        const getParams = { status: '3' };
        console.log('开始评估-调用父组件-dealData-1111:', getParams);
        this.dealData(getParams, 'signUp');
        return;
      }
      if (!this.$appInterface.getCreateId() && this._props.hasMobile) {
        const getParams = { status: '2' };
        console.log('开始评估-调用父组件-dealData-22222:', getParams);
        this.dealData(getParams, 'signUp');
      } else {
        console.log('开始评估-是否第一次登录-isFirstSignUp:', this.isFirstSignUp);
        // 本地需要登录
        if (this.isFirstSignUp) {
          this.showDialog = true;
          console.log('开始评估++++++++第一次答题:');
        } else {
          const getParams = { status: '3' };
          console.log('开始评估-------非第一次答题:', getParams);
          this.$parent.dealData(getParams, 'signUp');
        }
        // 避免本地需要登录
        // const getParams = { status: '3' };
        // console.log('开始评估-------非第一次答题:', getParams);
        // this.dealData(getParams, 'signUp');
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
        this.getQuestionList(getParams, 'signUp');
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
        this.dealData({ status: '3' }, 'signUp');
        // return this.$emit('updateType', { type: '1', params: { userId: this.userId, agentId: this.agentId, id: this.id } });
        return this.$emit('updateType', { type: '1', params: { userId: this.userId, openId: this.openId, agentId: this.agentId, type: this.type } });
      }
      console.log('开始测评-点击去测试获取openid', this.openId);
      if (!this.openId && this.isWeChart && this.isWeChart != null) {
        return;
      }
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
        this.checkStatus();
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
      if (this.isWeChart) {
        this.onGuide();
        return;
      }
      this.$emit('getExhibitionList', 1);
      const param = {
        title: this.infoShare.title || '',
        content: this.infoShare.subheading || '',
        picture: this.infoShare.coverImg || process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/salary.png',
        url: shareClick('/evaluationTemplate', { agentId: this.agentId, id: this.$route.query.id, name: this.$route.query.name }) || '',
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
          urlPath: this.infoDetail.bibliographyHost,
          navigation: true,
        });
      } else {
        window.location.href = this.infoDetail.bibliographyHost;
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
}
.imgFill {
  .defaultImage {
    width: 7.5rem;
    height: 100%;
  }
}
.imageText {
  .defaultImage {
    width: 7.5rem;
    height: 5.64rem;
  }
  .evaluate-card-wrapper {
    top: 5.26rem;
  }
}
.evaluate-card-wrapper {
  position: absolute;
  z-index: 1;
  left: 0;
  bottom: 0;
  height: 461px;
  width: 100%;
  overflow-y: scroll;
}
.btn-wrapper {
  position: fixed;
  bottom: 2rem;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  z-index: 2;
  .share-btn {
    background: linear-gradient(315deg, #009c64, #29c38c);
  }
  .start-btn {
    background: linear-gradient(0deg, #ff1919, #ff5119, #ff8c2f);
  }
  .btn {
    width: 154px;
    height: 50px;
    border-radius: 25px;
    font-size: 18px;
    font-weight: 500;
    color: #ffffff;
    line-height: 50px;
    display: flex;
    justify-content: center;
    align-content: center;
  }
}
.btn-center {
  justify-content: center;
}
.btn-btm {
  bottom: 34px;
}
.text {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 7.5rem;
  height: 2rem;
  opacity: 1;
  background: linear-gradient(0deg,rgba(0,0,0,0.73) 21%, rgba(0,0,0,0.00) 100%);
  padding-left: 15px;
  display: flex;
  flex-direction: column;
  p {
    font-size: 12px;
    text-align: left;
    color: #ffffff;
    line-height: 17px;
    margin-top: 8px;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    img {
      width: 15px;
      height: 13px;
      margin-right: 4px;
    }
  }
  span {
    font-size: 12px;
    text-align: left;
    color: #ffffff;
    line-height: 17px;
    text-decoration: underline;
  }
}
::v-deep .van-overlay {
  z-index: 9;
}
</style>
