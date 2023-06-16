<template>
  <div class="bg">
    <div :class="isWeChart ? 'bg-scroll weChart' : 'bg-scroll'" ref="bg-scroll">
      <ResultText ref="resultText" :resultlist="resultlist" />
      <div class="evaluate-report-bottom">
        <!-- <div :class="infoDetail.allowShare === 1 ? 'question-btns' : 'question-btns btn-center'"> -->
        <div class="question-btns">
          <div class="question-btn previous" @click="onTest">再测一次</div>
          <div class="question-btn next" v-if="isWeChart" @click="onShare">立刻分享</div>
          <div class="question-btn next" v-else @click="goBack">退出</div>
        </div>
      </div>
      <!-- 名片标题 -->
      <business-card v-if="isWeChart" :basic-info="agentInfo.baseInfo" @checkBusinessaCard="checkBusinessaCard" />
    </div>
    <Guide v-if="isGuide" @onHide="onHide" />
  </div>
</template>
<script>
import { shareClick } from '@/utils/wechatAuth';
import ResultText from './resultText';
import Guide from '@/components/guide';
import sharePic from '@/assets/FPAptitude/character.png';
import businessCard from '../../components/businessCard/index.vue';
export default {
  name: 'Result',
  filters: {},
  components: {
    ResultText,
    Guide,
    businessCard,
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
    resultlist: {
      type: Array,
      default: () => [],
    },
    cardDate: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      resultLlist: [],
      isGuide: false,
      sharePic,
      agentInfo: {
        baseInfo: {userId: "782994890127572992", userName: "蛮牛"},
        completionPercentage: 60,
        isComplete: false,

      }, // 名片信息
      scrollHeight: {
        height: "",
        maxHeight: ''
      }
    };
  },
  created() {
    this.agentInfo = this.cardDate;
    console.log("展业名片-cardDate：", this.cardDate);
  },
  mounted() {
    console.log("result-resultlist", this.resultlist);
    this.barHeight = this.$appInterface.getStatusBar();
    if (this.isWeChart) {
      this.scrollMaxH();
    }
    // const baseInfoId = this.$route.query.id || '';

    // if (this.isWeChart) {
    //   console.log('微信环境this.openId, this.agentId, baseInfoId', this.openId, this.agentId, baseInfoId);
    //   this.$refs.resultText.getResult(this.openId, this.agentId, baseInfoId);
    // } else {
    //   console.log('非微信环境-recordID', this.recordID);
    //   this.$refs.resultText.getAppResult(this.recordID);
    // }
  },
  methods: {
    // 再次测评
    onTest() {
      // const getParams = { status: '3' };
      // this.$parent.dealData(getParams);
      this.$store.dispatch('actionsRecordDate', {});
      const getParams = { status: '3' };
      this.dealData(getParams, 'nextText');
    },
    // 立即分享
    onShare() {
      this.$gdp('acquisition_tools_quick_share', {tabName: document.title });
      console.log('点击立即分享isWeChart', this.isWeChart);
      if (this.isWeChart) {
        this.onGuide();
        return;
      }
      this.$emit('getExhibitionList', 1);
      const param = {
        title: '养老金测算器',
        content: '蛮牛伙伴帮助您测算养老金',
        picture: process.env.VUE_APP_OSS_CS_URL + '/h5-agent-business/annuity.png',
        url: shareClick('/annuity', { agentId: this.agentId, id: this.$route.query.id }) || '',
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
    goBack() {
      this.$appInterface.goBack();
    },
    // 点击跳转名片
    checkBusinessaCard() {
      // 微信页面
      const userId = this.agentInfo.userId || this.$route.query.agentId;
      window.location.href = `${process.env.VUE_APP_SERVICE_URL}/h5-bizcard/wx/home?userId=${userId}&comeType=3`;
    },
    scrollMaxH() {
      this.scrollHeight.height = document.documentElement.clientHeight + 'px';
      this.scrollHeight.maxHeight = document.documentElement.clientHeight + 'px';
      console.log("重新计算高度-scrollHeight:", this.scrollHeight);
    }
  },
};
</script>
<style lang="scss" scoped>
$navbar-height: 84px;
$appModel-title-height: 55px;
$bottom-height: 95px;
* {
  li {
    list-style: none;
  }
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
.bg {
  width: 375px;
  height: 100%;
  background: #f7f8f9;
  .weChart{
    height: 91%;
    max-height: 91%;
    padding-bottom: 50px;
    .evaluate-report-bottom{
      height: 61px;
      position: relative;
      background: #f7f8f9;;
      padding: 0 30px;
      box-shadow:none;
    }
    .businessCard{
      padding: 0 15px 50px 15px;
    }
  }
}
</style>
