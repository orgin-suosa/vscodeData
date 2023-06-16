<template>
  <div>
    <van-popup class="van-popup-results" v-model="showFortuneEvaluation">
      <ResultText ref="resultText" :result="getResult" :type="type" :isPopup="true" :isParticipate="isParticipate" />
    </van-popup>
    <div class="closeBox" v-if="showFortuneEvaluation" @click="closeClick">
      <!-- <img class="icon-delete" :src="iconDelete" alt="" /> -->
      <i class="icon-delete"></i>
    </div>
  </div>
</template>

<script>
import ResultText from '../evaluationTemplate/components/resultText.vue';
export default {
  name: 'PopupEvaluation',
  components: {
    ResultText,
  },
  props: {
    getResult: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isParticipate: {
      type: Boolean,
      default: () => {},
    },
  },
  computed: {
    judgeEnvIsWechat() {
      return this.$appInterface.judgingIsWeChart();
    },
  },
  data() {
    return {
      showFortuneEvaluation: false,
      iconDelete: require('@/assets/images/delete.png'),
      type: '1',
      // resultLlist: {
      //   createdTime: '2021-06-25 14:48:26',
      //   result: '蓝色',
      //   resultAnalyse:
      //     '<p class="MsoNormal"><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">思想深邃</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;">&nbsp;</span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">情感脆弱</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">默默关怀他人</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;">&nbsp;</span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">喜好批判和挑剔</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">敏感而细腻</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;">&nbsp;</span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">不主动与人沟通</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">计划性强</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;">&nbsp;</span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">患得患失<br /><br /></span></span><span style="color: #33cccc;"><strong><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">性格优势:</span></span></strong></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">作为个体：严肃的生活哲学。思想深邃，独立思考而不盲目从众。沉默寡言，老成持重。注重承诺，可靠安全。谨慎而深藏不露。坚守原则，责任心强。遵守规则，井井有条。深沉有目标的理想主义。敏感细腻。高标准，追求完美。谦和稳健。善于分析，富有条理。待人忠诚，富有自我牺牲精神。深思熟虑，三思而后行。坚韧执着。</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">沟通特点：享受敏感而有深度的交流。设身处地地体会他人。能记住谈话时共鸣的感情和思想。喜欢小群体交流的思想碰撞。关注谈话的细节。</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">作为朋友：默默地为他人付出以表示关切和爱。对友谊忠诚不渝。真诚关怀朋友的境遇，善于体贴他人。能够记得特殊的日子。遭遇难关时，极力给予鼓舞安慰。很少向他人表达内心的看法。经常扮演解决分析问题的角色。</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">对待工作和事业：强调制度、程序、规范、细节和流程。做事之前首先计划且严格按照计划去执行。喜欢探究及根据事实行事。尽忠职守，追求卓越。高度自律。喜欢用表格、数字的管理来验证效果。注重承诺。一丝不苟地执行工作。</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;"><br /><strong><span style="color: #33cccc;">性格过当:</span></strong></span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">作为个体：高度负面的情绪化。猜忌心重，不信任他人。太在意别人的看法和评价，容易被负面评价中伤。容易沮丧，悲观消极。陷于低落的情绪无法自拔。情感脆弱抑郁，有自怜倾向。杞人忧天，庸人自扰。最容易的抑郁症患者。当别人轻易成功时，会因自己的努力付出却不如他人而心生嫉妒。过于阴沉的面孔，让人感觉压抑，不易接近。</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">沟通特点：不知不觉地说教和上纲上线。原则性强，不易妥协。强烈期待别人具有敏感度和深度能够理解自己。以为别人能够读懂自己的心思。不太主动与人沟通。不喜欢制造困扰麻烦给别人，也讨厌别人制造困扰麻烦给自己。要真诚开放心胸与人互动会比较难。习惯以防卫的状态面对别人。</span></span><span style="mso-spacerun: \'yes\'; font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><br /></span><span style="mso-spacerun: \'yes\'; font-family: 宋体; mso-ascii-font-family: Arial; mso-hansi-font-family: Arial; mso-bidi-font-family: Arial; font-size: 10.5000pt; mso-font-kerning: 1.0000pt;"><span style="font-family: 宋体;">作为朋友：过度敏感，有时很难相处。强烈的不安全感。远离人群。喜好批判和挑剔。吝于宽恕。经常怀疑别人的话，不容易相信他人。对待工作和事业对自己和他人常寄予过高而且不切实际的期望。过度计划和过度绸缪。患得患失，行动缓慢。较真，挑剔他人及自己的表现。专注于小细节，因小失大。吝啬表扬，强烈的形式主义。容易被不理想的成绩击垮斗志。墨守成规，死板教条不懂变通。为了维护原则缺乏妥协精神。</span></span></p>',
      // }, // 测试结果
    };
  },
  mounted() {
    // const baseInfoId = this.$route.query.id || '';
    // if (this.judgeEnvIsWechat && this.$refs.resultText) {
    //   console.log('微信环境this.openId, this.agentId, baseInfoId', this.openId, this.agentId, baseInfoId);
    //   this.$refs.resultText?.getResult(this.openId, this.agentId, baseInfoId);
    // } else {
    //   console.log('非微信环境-getResult', this.getResult);
    //   this.$refs.resultText?.getAppResult(this.getResult);
    // }
  },
  methods: {
    closeClick() {
      this.showFortuneEvaluation = false;
    },
  },
};
</script>
<style lang="scss" scoped>
$top-bg-height: 266px;
$bottom-height: 95px;
.van-popup-results {
  width: 100%;
  height: 100vh;
  top: 57.4%;
  background-color: transparent;
  border-radius: 10px;
  border-radius: 0.3rem;
  overflow: hidden;
  .unit {
    font-size: 0.28rem;
    font-family: PingFang SC Light, PingFang SC Light-Light;
    font-weight: bold;
    text-align: left;
    color: #70787e;
  }
}
.fortune_question_list {
  width: 6.7rem;
  opacity: 0.9;
  background: #ffffff;
  margin: 0 auto;
  padding: 0 0.37rem;
  box-sizing: border-box;
  border-radius: 0.3rem;
  .titleLabel {
    font-size: 0.32rem;
    font-family: PingFang SC Regular, PingFang SC Regular-Regular;
    font-weight: bold;
    text-align: left;
    color: #232529;
    padding-bottom: 0.16rem;
  }
  .titleLabel-tip {
    padding-top: 0.4rem;
    padding-bottom: 0.7rem;
  }
  .fortuneField {
    width: 5.96rem;
    height: 0.64rem;
    background: #ffffff;
    border: 0.02rem solid #348bd9;
    // margin-bottom: 0.62rem;
    /deep/.van-field__control {
      color: #70787e;
    }
    /deep/.van-field__value {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .fortune_question_item {
    padding-bottom: 0.4rem;
  }
}
.evaluate-report {
  width: 90%;
  height: 80vh;
  margin: 0 auto;
  position: relative;
  top: 0.4rem;
  border-radius: 0.3rem;
}

::v-deep.evaluate-report {
  .evaluate-report-content {
    width: 101.1%;
    height: 56%;
    transform: translateX(-50%);
    top: -0.62rem;
    padding-top: 0.65rem;
  }
  .content_text {
    width: 245px;
    padding-bottom: 0.65rem;
  }
  .evaluate-report-title-wrapper {
    .evaluate-report-result-wrapper {
      .evaluate-report-result {
        max-width: 5.3rem;
      }
    }
  }
  .evaluate-report-body-bg{
    top: 210px;
  }
}
/deep/.closeBox {
  position: fixed;
  right: 0.3rem;
  top: 1%;
  text-align: center;
  z-index: 9999;
  text-align: center;
  .icon-delete {
    width: 0.66rem;
    height: 0.66rem;
    display: inline-block;
    background-image: url('~@/assets/images/iconClose.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
  .icon-react {
    width: 0.02rem;
    height: 0.5rem;
    background-color: #ffffff;
    position: absolute;
    top: 78%;
    left: 50%;
    transform: translateX(-50%);
  }
}
 @media only screen and (min-height: 768px) {
  ::v-deep.evaluate-report {
    .evaluate-report-content {
      height: 64%;

    }
  }
}
</style>
