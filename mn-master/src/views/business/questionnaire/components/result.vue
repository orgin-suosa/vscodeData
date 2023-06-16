<template>
  <page-model :has-back="true" :title="pageModelTitle" :custom-back="true" page-bg-color="#fff" :header-style="{ fontSize: '14px' }" @back="back">
    <div class="bg">
      <!-- <ResultText ref="resultText" /> -->
      <div class="answerCompleted">
        <img src="@/assets/questionnaire/iconComplete.png" alt="" fit="contain" />
        <p class="answerText">感谢您的参与！</p>
      </div>
      <div class="result_footer">
        <div class="text_btn" @click="onTest">再测一次</div>
        <div class="share_btn" @click="onShare">立即分享</div>
      </div>
      <Guide v-if="isGuide" @onHide="onHide" />
    </div>
  </page-model>
</template>
<script>
import { shareClick } from '@/utils/wechatAuth';
// import ResultText from './resultText';
import Guide from '@/components/guide';
import sharePic from '@/assets/FPAptitude/character.png';
export default {
  name: 'Result',
  filters: {},
  components: {
    // ResultText,
    Guide,
  },
  props: {
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
    openId: {
      type: String,
      default: '',
    },
    getResult: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      resultLlist: [],
      isGuide: false,
      sharePic,
      pageModelTitle: '问卷调查',
    };
  },
  mounted() {
    const baseInfoId = this.$route.query.id || '';

    if (this.isWeChart) {
      console.log('微信环境this.openId, this.agentId, baseInfoId', this.openId, this.agentId, baseInfoId);
      // this.$refs.resultText.getResult(this.openId, this.agentId, baseInfoId);
    } else {
      console.log('非微信环境-getResult', this.getResult);
      // this.$refs.resultText.getAppResult(this.getResult);
    }
  },
  methods: {
    // 再次测评
    onTest() {
      // const getParams = { status: '3' };
      // this.$parent.dealData(getParams);
      const getParams = { status: '3' };
      this.$parent.dealData(getParams, 'nextText');
    },
    // 立即分享
    onShare() {
      console.log('点击立即分享isWeChart', this.isWeChart);
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
    back() {
      this.$router.back();
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  li {
    list-style: none;
  }
}
.bg {
  width: 100%;
  height: 100%;
}
.answerCompleted {
  font-size: 0.48rem;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: center;
  color: #333333;
  text-align: center;
  img {
    width: 3.42rem;
    height: auto;
    margin: 0 auto;
    margin-top: 1.4rem;
  }
  .answerText {
    padding-top: 0.4rem;
  }
}
.result_footer {
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .text_btn,
  .share_btn {
    width: 2.86rem;
    height: 0.82rem;
    line-height: 0.82rem;
    border-radius: 0.48rem;
    text-align: center;
    color: #ffffff;
    font-size: 0.3rem;
    font-weight: 500;
    text-align: center;
    color: #009c64;
    overflow: hidden;
  }
  .share_btn {
    background: linear-gradient(315deg, #009c64, #29c38c);
    box-shadow: 0px 0.04rem 0.2rem 0px rgba(0, 156, 100, 0.3);
    color: #ffffff;
  }
  .text_btn {
    border: 0.02rem solid #009c64;
    background: #ffffff;
  }
}
</style>
