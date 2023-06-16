<template>
  <div class="bg">
    <ResultText ref="resultText" />
    <div class="result_footer">
      <div class="share_btn" @click="onShare">立即分享</div>
      <div class="text_btn" @click="onTest">再测一次</div>
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
</style>
