<template>
  <div class="container">
    <div class="title_no">
      <div class="current">
        {{ currentNum }}
      </div>
      <div class="total">/{{ questionArr.length }}</div>
    </div>
    <div class="content">
      <div class="answer">
        <cell-item :current-item="questionArr[currentNum - 1]" :currentNum="currentNum" :mobile="mobile" :agentId="agentId" :id="id" @autoJump="afterAnswerQuestion('auto')" />
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
      <div v-show="currentNum === questionArr.length" class="click_button submit_button" @click="viewResult">
        生成报告
      </div>
    </div>
  </div>
</template>
<script>
import CellItem from './cellItem';
export default {
  name: 'WxQuestionnaire',
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
    mobile: {
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
  },
  data() {
    return {
      currentNum: 1,
      answerArr: [],
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
      if (!this.questionArr[this.currentNum - 1].answer) {
        this.$toast('请选择一个选项');
        return;
      }
      if (this.currentNum < this.questionArr.length) {
        // 跳到下一题
        if (param === 'auto') {
          if (this.currentNum < this.questionArr.length) {
            this.currentNum = this.currentNum + 1;
          }
        } else {
          this.currentNum = this.currentNum + 1;
        }
      }
    },
    // 查看报告
    viewResult() {
      if (this.currentNum !== this.questionArr.length || !this.questionArr[this.currentNum - 1].answer) {
        this.$toast('请选择一个选项');
        return;
      }
      if (this.$appInterface.getCreateId()) {
        const questionObject = {};
        questionObject.id = this.id || '813369448571338712';
        questionObject.list = [];
        this.questionArr.forEach((ele) => {
          console.log(this.questionArr);
          questionObject.list.push({
            questionSequence: Number(ele.id),
            optionResult: Number(ele.answer),
          });
        });
        console.log('APP答题信息---', questionObject);
        this.$store.dispatch('sexual/getAnswerResult', questionObject).then((res) => {
          if (res.data.resultLlist) {
            this.$emit('getResult', { params: res.data.resultLlist });
          }
        });
      } else {
        const param = {
          agentId: this.agentId,
          mobile: this.mobile,
          id: this.id,
        };
        this.$store.dispatch('sexual/generateAptitudeTestResult', param).then((res) => {
          if (res.code === 200 && res.data.resultLlist) {
            this.$emit('getResult', { params: res.data.resultLlist });
          }
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  background-color: #ffffff;
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
    padding-bottom: 110px;
  }
  .footer {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    bottom: 0px;
    height: 110px;
    width: 100%;
    // background-color: #ffffff;
    // box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.05);
    font-size: 15px;
    .default_button {
      border: 1px solid #00dddd;
      border-radius: 24px;
      height: 46px;
      line-height: 46px;
      width: 140px;
      color: #b3b3b3;
      margin-left: 20px;
      margin-right: 20px;
      background-color: #ffffff;
    }
    .click_button {
      @extend .default_button;
    }
    .submit_button {
      background: linear-gradient(90deg, #00dddd, #00c5cd);
      color: white;
      border-color: transparent;
    }
    .click_button.active,
    .click_button:active {
      background: linear-gradient(90deg, #00dddd, #00c5cd);
      color: white;
      border-color: transparent;
    }
  }
}
</style>
