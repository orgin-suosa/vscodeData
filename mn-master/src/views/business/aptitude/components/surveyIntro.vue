<template>
  <div class="wx_container">
    <van-image :src="require('@/assets/images/qs-bg.png')" fit="contain" />
    <div class="tag" v-if="!wxUserInfo.openid" @click="jumpList">
      参与情况
    </div>
    <div class="footer">
      <div class="btn">
        <div class="button" @click="onShare">
          立即分享
        </div>
        <div class="button" @click="onTest">
          开始评估
        </div>
      </div>
      <div class="book">
        <div class="img">
          <van-image :src="require('@/assets/images/book-icon.png')" width="17" height="17" />
        </div>
        <div class="text">
          参考文献：《性向测试问卷》
          <a :href="url" target="_blank" @click="blank">
            {{ url }}
          </a>
        </div>
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
import SignupDialog from '@/components/signupDialog.vue';
import { shareClick } from '@/utils/wechatAuth';
import Guide from '@/components/guide';
export default {
  name: 'WxSurveyIntro',
  components: {
    SignupDialog,
    Guide,
  },
  props: {
    wxUserInfo: {
      type: Object,
      default: () => {},
    },
    agentId: {
      type: String,
      default: '',
    },
    hasMobile: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showDialog: false,
      questionArr: [],
      url: 'http://dwz.date/e4CR',
      mobile: '',
      type: 200,
      isGuide: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 立即分享
    onShare() {
      console.log("document.title", document.title);
      this.$gdp('acquisition_tools_quick_share', {tabName: document.title });
      console.log(this.wxUserInfo, 'this.wxUserInfo');
      this.$emit('getExhibitionList', 1);
      if (this.wxUserInfo.openid) {
        this.onGuide();
        return;
      }
      const param = {
        title: '带你了解更真实的自己',
        content: '测一测最真实的自己，或许可以了解到一个不为人知的你',
        picture: process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/aptitude.png',
        url: shareClick('/aptitude', { agentId: this.agentId, id: this.$route.query.id }) || '',
      };
      this.$appInterface.shareUrl(param);
    },
    // 开始评估
    onTest() {
      console.log("document.title", document.title);
      this.$gdp('acquisition_tools_start_evaluation', {tabName: document.title });
      console.log(this, this._props.hasMobile, this._props.agentId, this._props.wxUserInfo, '22');
      if (this.$appInterface.getCreateId()) {
        const getParams = { status: '3' };
        this.$parent.dealData(getParams, 'signUp');
        return;
      }
      if (!this.$appInterface.getCreateId() && this._props.hasMobile) {
        const getParams = { status: '3' };
        this.$parent.dealData(getParams, 'signUp');
      } else {
        this.showDialog = true;
      }
    },
    // 跳到参与列表
    jumpList() {
      this.$router.push({
        path: '/customerList',
      });
    },
    // 提交报名信息
    signUp(data, mobile) {
      this.$emit('getMobile', mobile);
      this.mobile = mobile;
      if (data) {
        this.showDialog = false;
        // const getParams = { status: '3' };
        // this.$parent.handleFunc(getParams, 'signUp');
        this.$parent.checkStatus();
      }
    },
    // 引导用户用微信的转发
    onGuide() {
      this.isGuide = true;
      console.log('去点击微信的转发');
    },
    onHide() {
      this.isGuide = false;
    },
    // 取消
    onCancel() {
      this.showDialog = false;
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
<style lang="scss" scoped>
.wx_container {
  background-color: #ffffff;
  height: 100vh;
  .tag {
    position: absolute;
    font-size: 12px;
    top: 29px;
    right: 0;
    background: linear-gradient(180deg, #92ece2, #63ddd0);
    color: #ffffff;
    padding: 2px 4px;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }
  .footer {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    bottom: 0px;
    width: 100%;
    overflow-x: hidden;
    padding-top: 11px;
    // background-color: #ffffff;
    .btn {
      width: 328px;
      display: flex;
      justify-content: space-between;
      .button {
        margin-bottom: 62px;
        color: #ffffff;
        font-size: 15px;
        background: linear-gradient(90deg, #00dddd, #00c5cd);
        width: 148px;
        height: 45px;
        line-height: 45px;
        border-radius: 24px;
      }
    }
    .book {
      width: 100%;
      position: absolute;
      display: flex;
      flex-direction: row;
      bottom: 0;
      padding-left: 35px;
      background-color: #f5f6f7;
      text-align: left;
      font-size: 12px;
      color: #333333;
      padding-top: 10px;
      padding-bottom: 24px;
      .img {
        height: 17px;
        margin-right: 5px;
      }
      .text {
        white-space: break;
        a {
          color: #00c5cd;
        }
      }
    }
  }
}
</style>
