<template>
  <div class="salary">
    <img v-if="!isWeChart" class="test" src="@/assets/images/test_case.png" alt="" @click="pkDetail" />
    <img class="tip" src="@/assets/images/salary_tip.png" alt="" />
    <img class="title" src="@/assets/images/salary_text.png" alt="" />
    <div class="button" v-if="!firstPk && buttonType">
      <img class="share_btn" src="@/assets/images/share_pk_btn.png" alt="" @click="onShare" />
      <img class="pk_btn" src="@/assets/images/next_pk_btn.png" alt="" @click="jumpTest" />
    </div>
    <div class="button" v-if="firstPk && buttonType">
      <img class="share_btn" src="@/assets/images/test_button.png" alt="" @click="jumpTest" />
    </div>
    <Guide v-if="isGuide" @onHide="onHide" />
  </div>
</template>

<script>
import { shareClick } from '@/utils/wechatAuth';
import Guide from './guide';
export default {
  name: 'EvaluationHome',
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
  },
  data() {
    return {
      firstPk: true,
      buttonType: false,
      isGuide: false,
    };
  },
  computed: {},
  methods: {
    // 判断是否是第一次PK
    getFirstPk(params) {
      this.$store.dispatch('acquisition/isFirstPk', params).then((res) => {
        if (res.code === 200) {
          console.log(res, 'res============>');
          this.firstPk = res.data;
          this.buttonType = true;
        }
      });
    },
    // 测评情况
    pkDetail() {
      console.log('测评情况');
      this.$router.push({
        path: '/evaluationDetail',
      });
    },
    // 去测试
    jumpTest() {
      console.log("document.title", document.title);
      this.$gdp('acquisition_tools_start_evaluation', {tabName: document.title });
      console.log('openid', this.openId);
      if (!this.openId && this.isWeChart) {
        return;
      }
      console.log('去测试');
      this.$emit('updateType', { type: '2' });
    },
    // 邀请好友PK
    onShare() {
      console.log("document.title", document.title);
      this.$gdp('acquisition_tools_quick_share', {tabName: document.title });
      console.log(this.isWeChart, 'this.isWeChart');
      if (this.isWeChart) {
        this.onGuide();
        return;
      }
      this.$emit('getExhibitionList', 1);
      const param = {
        title: '每秒薪资大pk',
        content: '快来比一比，看看谁是朋友圈里的秒薪大佬',
        picture: process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/salary.png',
        url: shareClick('/salary', { agentId: this.agentId, id: this.$route.query.id }) || '',
      };
      this.$appInterface.shareUrl(param);
    },
    // 引导用户用微信的转发
    onGuide() {
      this.isGuide = true;
      console.log('去点击微信的转发');
    },
    onHide() {
      this.isGuide = false;
    },
  },
};
</script>

<style scoped lang="scss">
.salary {
  width: 100%;
  height: 810px;
  background: url('~@/assets/images/pk_bg.png') center/100% 100% no-repeat;
  overflow-y: scroll;
  position: relative;
  .test {
    width: 87px;
    height: 37px;
    position: absolute;
    right: 0;
    top: 1.8vh;
  }
  .tip {
    width: 333px;
    height: 133px;
    padding-top: 5.4vh;
    margin-left: 22px;
  }
  .title {
    width: 305px;
    height: 54px;
    margin-top: 23px;
    margin-left: 35px;
  }
  .button {
    position: fixed;
    bottom: 50px;
    left: 67px;
  }
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
</style>
