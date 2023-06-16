<template>
  <div :class="infoDetail.templateType == 100 ? 'container imgFill' : 'container'" :style="{ background: backgroundColor ? backgroundColor : 'rgba(247,248,249,1)' }">
    <van-image v-if="infoDetail.templateType == 100" class="defaultImage" :src="backgroundImages" fit="fill" />
    <div class="card">
      <div class="ProcessContent"><Process :currentNum="currentNum" :totalNum="totalNum" :questionArr="questionArr" /></div>
      <div class="content">
        <div class="answer">
          <cell-item
            ref="cellItem"
            :current-item="questionArr[currentNum - 1]"
            :currentNum="currentNum"
            :questionArr="questionArr"
            :backgroundColor="backgroundColor"
            :agentId="agentId"
            :id="id"
            :wxUserInfo="wxUserInfo"
            @autoJump="afterAnswerQuestion"
          />
        </div>
      </div>
      <div class="footer">
        <div v-if="currentNum === 1" class="default_button">
          上一题
        </div>
        <div v-show="currentNum > 1" class="default_button last_button" @click="lastQuestion">
          上一题
        </div>
        <div v-show="currentNum !== questionArr.length" class="click_button" @click="afterAnswerQuestion">
          下一题
        </div>
        <div v-show="currentNum === questionArr.length" class="click_button submit_button" @click="viewResult">
          生成报告
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CellItem from './cellItem';
import { debounce } from '@/utils/util';
import Process from './process.vue';
export default {
  name: 'Questions',
  components: {
    CellItem,
    Process,
  },
  props: {
    id: {
      type: String,
      default: '',
    },
    agentId: {
      type: String,
      default: '',
    },
    current: {
      type: Number,
      default: 1,
    },
    questionArr: {
      type: Array,
      default: () => [],
    },
    backgroundColor: {
      type: String,
      default: '',
    },
    wxUserInfo: {
      type: Object,
      default: () => {},
    },
    infoDetail: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentNum: 1,
      ProcessCurrentNum: 0,
      totalNum: 0,
      result: {},
      overtimer: null,
      backgroundImages: '',
    };
  },
  created() {},
  mounted() {
    this.currentNum = this.current;
    this.totalNum = this.questionArr.length;
    if (this.infoDetail.backgroundImg != '') {
      this.backgroundImages = this.infoDetail.backgroundImg;
      console.info('取backgroundImg背景图', this.backgroundImages);
    } else {
      this.backgroundImages = this.infoDetail.homePageImg;
      console.info('取homePageImg首页图', this.backgroundImages);
    }
    console.log('this.currentNum', this.currentNum, 'this.totalNum:', this.totalNum, 'backgroundImg:', this.backgroundImg);
    console.log('templateType', this.infoDetail.templateType);
    document.body.addEventListener('touchstart', function() {});
  },
  methods: {
    // 上一题
    lastQuestion() {
      if (this.currentNum > 1) {
        this.currentNum = this.currentNum - 1;
        this.ProcessCurrentNum = this.ProcessCurrentNum - 1;
      }
    },
    // 下一题
    afterAnswerQuestion(param) {
      this.$gdp('acquisition_tools_next');
      if (!this.questionArr[this.currentNum - 1].answer) {
        this.$toast('请选择一个选项');
        console.log('5555555555');
        return;
      }
      if (this.currentNum < this.questionArr.length) {
        // 跳到下一题
        this.currentNum = this.currentNum + 1;
        this.ProcessCurrentNum = this.ProcessCurrentNum + 1;
      } else if (this.currentNum === this.questionArr.length) {
        this.ProcessCurrentNum = this.ProcessCurrentNum + 1;
      }
    },
    // 下一题
    afterAnswerQuestionII(param) {
      console.log('afterAnswerQuestion, currentNum, questionArr.length', this.currentNum, this.questionArr.length);
      if (!this.questionArr[this.currentNum - 1].answer) {
        this.$toast('请选择一个选项');
        return;
      }
      // 跳到下一题
      const that = this;
      this.overtimer = null;
      this.overtimer = setTimeout(() => {
        console.log('跳到下一题-answer:', that.questionArr[that.currentNum - 1].answer);
        if (that.currentNum < that.questionArr.length) {
          that.currentNum = that.currentNum + 1;
          that.ProcessCurrentNum = that.ProcessCurrentNum + 1;
        } else if (that.currentNum === that.questionArr.length) {
          that.ProcessCurrentNum = that.ProcessCurrentNum + 1;
        }
        console.log('afterAnswerQuestion- 跳到下一题', that.currentNum, that.ProcessCurrentNum);
        return;
      }, 900);
      this.$once('hook:beforeDestroy', () => {
        clearInterval(this.overtimer);
        this.overtimer = null;
      });
      // const obj = this.questionArr[this.currentNum - 1];
      // obj.options.map((item, ind) => {
      //   if (item.id === obj.answer) {
      //     if (item.optionValue) {
      //       this.currentNum = this.currentNum + (item.nextQuesCode - this.currentNum);
      //     } else {
      //       this.currentNum = this.currentNum + 1;
      //     }
      //   }
      // });
    },
    // 生成报告
    viewResult() {
      if (this.currentNum !== this.questionArr.length || !this.questionArr[this.currentNum - 1].answer) {
        this.$toast('请选择一个选项');
        return;
      }
      debounce(() => {
        console.log('生成报告-wxUserInfo', this.wxUserInfo);
        const param = {
          agentId: this.agentId,
          baseInfoId: this.id,
          openId: this.wxUserInfo.openid || '',
          // openId: this.wxUserInfo.openid || 'openid',
        };
        console.log('生成报告-param', param);
        this.$store.dispatch('challenge/generatePersonRecord', param).then((res) => {
          if (res.code === 200) {
            this.$emit('updateType', { type: 3, getResult: { ...res.data } });
          }
        });
      }, 500)();
    },
    stoptime() {
      clearTimeout(this.overtimer);
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  background-color: #ffffff;
  height: 100vh;
  .ProcessContent {
    padding: 0.6rem 0.3rem;
  }
  .title_no {
    padding: 20px 20px;
    display: flex;
    letter-spacing: 2px;
    .current {
      height: 20px;
      line-height: 20px;
      font-size: 24px;
      color: #ffaf19;
    }
    .total {
      height: 22px;
      line-height: 22px;
      font-size: 14px;
      color: #999999;
    }
  }
  .content {
    margin-top: 10px;
    // padding-bottom: 90px;
  }
  .footer {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    // bottom: 2.54rem;
    bottom: 1rem;
    width: 100%;
    font-size: 15px;
    background: transparent;
    .default_button {
      width: 2.86rem;
      height: 0.82rem;
      line-height: 0.82rem;
      opacity: 0.6;
      border: 0.02rem solid #999999;
      border-radius: 0.44rem;
      font-size: 0.3rem;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: center;
      color: #999999;
      margin-left: 20px;
      margin-right: 20px;
    }
    .last_button {
      @extend .default_button;
      opacity: 1;
      border: 0.02rem solid #009c64;
      color: #009c64;
    }
    .click_button {
      @extend .default_button;
      background: linear-gradient(315deg, #009c64, #29c38c);
      border-radius: 0.48rem;
      box-shadow: 0px 0.04rem 0.2rem 0px rgba(0, 156, 100, 0.3);
      color: #ffffff;
      border: 0;
      opacity: 1;
    }
    .submit_button {
      background: linear-gradient(90deg, #009c64, #29c38c);
      color: white;
      border-color: transparent;
    }
    .click_button:active {
      background: linear-gradient(90deg, #009c64, #29c38c);
      color: white;
      border-color: transparent;
    }
  }
}
.imgFill {
  .defaultImage {
    width: 7.5rem;
    height: 100%;
    position: absolute;
  }
  .card {
    position: absolute;
    top: 0.3rem;
    left: 50%;
    width: calc(100% - 8vw);
    height: calc(100vh - 25.86667vw);
    background-color: #fff;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 0.2rem;
    backdrop-filter: blur(0.2rem);
    transform: translateX(-50%);
    box-sizing: border-box;
    ::v-deep .van-radio-group {
      width: 6.5rem;
      max-height: 6.75rem;
      margin: 0 auto;
      overflow-y: auto;
    }
  }
  ::v-deep .process {
    .process-info {
      .process-name {
        color: #333333;
      }
    }
  }
}
</style>
