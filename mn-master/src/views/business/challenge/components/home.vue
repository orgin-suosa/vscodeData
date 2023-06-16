<template>
  <div class="challenge" :style="{ backgroundImage: homePageImg ? 'url(' + homePageImg + ')' : '' }">
    <img v-if="!isWeChart" class="test" src="@/assets/challenge/test_case.png" alt="" @click="pkDetail" />
    <div class="button">
      <img class="share_btn" src="@/assets/challenge/share_button.png" alt="" @click="onShare" />
      <img class="pk_btn" src="@/assets/challenge/experience_button.png" alt="" @click="jumpTest" />
    </div>
    <Guide v-if="isGuide" @onHide="onHide" />
  </div>
</template>

<script>
import { shareClick } from '@/utils/wechatAuth';
import Guide from '@/components/guide';
export default {
  name: 'Home',
  components: {
    Guide,
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
  },
  data() {
    return {
      firstPk: true,
      buttonType: false,
      isGuide: false,
      infoDetail: {},
    };
  },
  computed: {},
  created() {},
  methods: {
    // 参与情况
    pkDetail() {
      console.log('参与情况-this.id ', this.id);
      this.$router.push({
        path: '/participateList',
        query: { baseInfoId: this.id },
      });
    },
    // 去测试
    jumpTest() {
      console.log("document.title", document.title);
      this.$gdp('acquisition_tools_start_evaluation', {tabName: document.title });
      console.log('点击去测试获取openid', this.openId);
      if (!this.openId && this.isWeChart) {
        return;
      }
      if (!this.isWeChart) {
        this.$parent.dealData({ status: '3' }, 'signUp');
      }
      this.$emit('updateType', { type: 2 });
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
        title: this.infoShare.title || '',
        content: this.infoShare.subheading || '',
        picture: this.infoShare.coverImg || process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/salary.png',
        url: shareClick('/challenge', { agentId: this.agentId, id: this.$route.query.id }) || '',
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
  },
};
</script>

<style scoped lang="scss">
.challenge {
  width: 100%;
  // height: 810px;
  min-height: 100vh;
  background-repeat: no-repeat;
  background-size: 100%;
  overflow-y: scroll;
  position: relative;
  .test {
    width: 84px;
    height: 31px;
    position: absolute;
    right: 0;
    top: 38px;
  }
  .button {
    position: fixed;
    bottom: 50px;
    left: 67px;
    .share_btn {
      width: 240px;
      height: 53px;
    }
    .pk_btn {
      width: 234px;
      height: 53px;
      margin-top: 7px;
    }
  }
}
</style>
