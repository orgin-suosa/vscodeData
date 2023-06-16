<template>
  <div class="container" :style="{ background: backgroundColor ? backgroundColor : '#ffffff' }">
    <div class="title_no">
      <div class="current">
        {{ currentNum }}
      </div>
      <div class="total">/{{ questionArr.length }}</div>
    </div>
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
      <div v-show="currentNum > 1" class="click_button" @click="lastQuestion">
        上一题
      </div>
      <div v-show="currentNum !== questionArr.length" class="click_button" @click="afterAnswerQuestion">
        下一题
      </div>
      <div v-show="currentNum === questionArr.length" class="click_button" @click="viewResult">
        生成报告
      </div>
    </div>
  </div>
</template>
<script>
import CellItem from './cellItem';
import { debounce } from '@/utils/util';
export default {
  name: 'Questions',
  components: {
    CellItem,
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
  },
  data() {
    return {
      currentNum: 1,
      result: {},
    };
  },
  created() {},
  mounted() {
    this.currentNum = this.current;
    console.log('this.currentNum', this.currentNum);
    document.body.addEventListener('touchstart', function() {});
  },
  methods: {
    // 上一题
    lastQuestion() {
      if (this.currentNum > 1) {
        this.currentNum = this.currentNum - 1;
        console.log(this.currentNum);
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
      // else if (!this.$refs.cellItem.isChoseFlag) {
      //   this.$toast('提交失败');
      //   return;
      // }
      if (this.currentNum < this.questionArr.length) {
        // 跳到下一题
        this.currentNum = this.currentNum + 1;
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
      }
    },
    // 生成报告
    viewResult() {
      if (this.currentNum !== this.questionArr.length || !this.questionArr[this.currentNum - 1].answer) {
        this.$toast('请选择一个选项');
        return;
      }
      console.log('生成报告-this.wxUserInfo:', this.wxUserInfo);
      debounce(() => {
        if (this.wxUserInfo.openid) {
          const param = {
            agentId: this.agentId,
            baseInfoId: this.id,
            openId: this.wxUserInfo.openid || '',
          };
          this.$store.dispatch('challenge/generatePersonRecord', param).then((res) => {
            if (res.code === 200) {
              this.$emit('updateType', { type: 3 });
            }
          });
        } else {
          const questionObject = {};
          questionObject.agentId = this.agentId;
          questionObject.baseInfoId = this.id;
          questionObject.questionOptions = [];
          this.questionArr.forEach((ele) => {
            questionObject.questionOptions.push({
              questionId: ele.id,
              questionOptionsId: ele.answer,
            });
          });
          console.log('APP答题信息---', questionObject);
          this.$store.dispatch('challenge/selectAnswerQuestionResultDetailForApp', questionObject).then((res) => {
            this.$emit('updateType', { type: 3, getResult: res.data });
            this.questionArr.forEach((ele) => {
              ele.answer = '';
            });
          });
        }
      }, 500)();
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
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
    padding-bottom: 90px;
  }
  .footer {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    bottom: 0px;
    height: 90px;
    width: 100%;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.05);
    font-size: 15px;
    background: #fff;
    .default_button {
      border: 1px solid #b3b3b3;
      border-radius: 24px;
      height: 46px;
      line-height: 46px;
      width: 140px;
      color: #b3b3b3;
      margin-left: 20px;
      margin-right: 20px;
    }
    .click_button {
      @extend .default_button;
    }
    .click_button:active {
      background: linear-gradient(90deg, #00dddd, #00c5cd);
      color: white;
      border-color: transparent;
    }
  }
}
</style>
