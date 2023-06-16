<template>
  <div class="bg">
    <ResultText ref="resultText" />
    <!-- <div class="result_footer">
      <div class="share_btn" @click="onShare">立即分享</div>
      <div class="text_btn" @click="onTest">再测一次</div>
    </div> -->
    <div class="evaluate-report-bottom">
      <div :class="infoDetail.allowShare === 1 ? 'question-btns' : 'question-btns btn-center'">
        <div class="question-btn previous" @click="onTest">再测一次</div>
        <div v-if="infoDetail.allowShare === 1" class="question-btn next" @click="onShare">立刻分享</div>
      </div>
    </div>
    <Guide v-if="isGuide" @onHide="onHide" />
  </div>
</template>
<script>
import { shareClick } from '@/utils/wechatAuth';
import ResultText from './resultText';
import Guide from '@/components/guide';
import sharePic from '@/assets/FPAptitude/character.png';
export default {
  name: 'Result',
  filters: {},
  components: {
    ResultText,
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
    dealData: {
      type: Function,
      default: null,
    },
    infoDetail: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      resultLlist: [],
      isGuide: false,
      sharePic,
    };
  },
  mounted() {
    const baseInfoId = this.$route.query.id || '';

    if (this.isWeChart) {
      console.log('微信环境this.openId, this.agentId, baseInfoId', this.openId, this.agentId, baseInfoId);
      this.$refs.resultText.getResult(this.openId, this.agentId, baseInfoId);
    } else {
      console.log('非微信环境-getResult', this.getResult);
      this.$refs.resultText.getAppResult(this.getResult);
    }
  },
  methods: {
    // 再次测评
    onTest() {
      // const getParams = { status: '3' };
      // this.$parent.dealData(getParams);
      const getParams = { status: '3' };
      this.dealData(getParams, 'nextText');
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
  background: #fff;
}
.result_footer {
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  .text_btn,
  .share_btn {
    width: 2.56rem;
    height: 0.74rem;
    line-height: 0.74rem;
    opacity: 1;
    background: linear-gradient(90deg, #00dddd, #00c5cd);
    border-radius: 0.48rem;
    text-align: center;
    color: #ffffff;
    font-size: 0.3rem;
  }
}
.evaluate-report-bottom {
  height: 95px;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #ffffff;
  box-shadow: 0px -3px 20px 0px #f1f1f1;
  padding: 10px 33px 0;
  box-sizing: border-box;
  z-index: 3;
  .question-btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .question-btn {
      height: 40px;
      width: 143px;
      border-radius: 20px;
      font-size: 15px;
      font-weight: 600;
      border: 1px solid #009c64;
      display: flex;
      justify-content: center;
      align-items: center;
      &.previous {
        border: 1px solid #009c64;
        color: #009c64;
      }
      &.next {
        background: linear-gradient(315deg, #009c64, #29c38c);
        box-shadow: 0px 2px 10px 0px rgba(0, 156, 100, 0.3);
        color: #fff;
        border: none;
      }
    }
  }
  .btn-center {
    justify-content: center;
  }
}
</style>
