<template>
  <div class="container" :style="{ background: backgroundColor ? backgroundColor : '#ffffff' }">
    <!-- <div class="title_no">
      <div class="current">
        {{ currentNum }}
      </div>
      <div class="total">/{{ questionArr.length }}</div>
    </div> -->
    <div class="content">
      <div class="answer" v-for="(item, index) in questionArr" :key="index">
        <!-- <cell-item
          ref="cellItem"
          :current-item="questionArr[currentNum - 1]"
          :currentNum="currentNum"
          :questionArr="questionArr"
          :backgroundColor="backgroundColor"
          :agentId="agentId"
          :id="id"
          :wxUserInfo="wxUserInfo"
          @autoJump="afterAnswerQuestion"
        /> -->
        <cell-item
          ref="cellItem"
          :current-item="item"
          :currentNum="currentNum"
          :indexNumber="index"
          :questionArr="questionArr"
          :backgroundColor="backgroundColor"
          :agentId="agentId"
          :id="id"
          :wxUserInfo="wxUserInfo"
          @autoJump="afterAnswerQuestion(item, index)"
        />
      </div>
    </div>
    <div class="footer">
      <!-- <div v-if="currentNum === 1" class="default_button">
        上一题
      </div>
      <div v-show="currentNum > 1" class="click_button" @click="lastQuestion">
        上一题
      </div>
      <div v-show="currentNum !== questionArr.length" class="click_button" @click="afterAnswerQuestion">
        下一题
      </div> -->
      <div class="click_button submit_button" @click="viewResult">
        提交问卷
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
    indexNumber: {
      type: Number,
      default: 1,
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
    // console.log('题目列表-questionObj', this.questionObj);
    console.log('题目列表-questionArr', this.questionArr);
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
    afterAnswerQuestion(param, index) {
      this.$gdp('acquisition_tools_next');
      const that = this;
      const answer = that.questionArr[index].answer;
      const type = that.questionArr[index].type;
      console.log('已经答题-afterAnswerQuestion-currentNum', this.currentNum, 'index', index, 'answer:', this.questionArr[this.currentNum - 1].answer);
      console.log('已经答题-afterAnswerQuestion-param', param);
      console.log('已经答题-afterAnswerQuestion-questionArr', this.questionArr, this.questionArr[this.currentNum - 1]);
      if (answer == '' && type != 4) {
        that.questionArr[index].erroreMssage = '请选择选项';
      } else if (answer == '' && type == 4) {
        that.questionArr[index].erroreMssage = '请输入文字';
      } else if (answer != '') {
        that.questionArr[index].erroreMssage = '';
      }

      // if (!this.questionArr[this.currentNum - 1].answer) {
      //   this.$toast('请选择一个选项');
      //   console.log('5555555555');
      //   return;
      // }
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
      } else if (this.currentNum == this.questionArr.length) {
        // this.viewResult();
        console.log('答题完成-');
      }
    },
    // 生成报告
    viewResult() {
      console.log('生成报告-questionArr', this.questionArr);
      this.questionArr.forEach(function(value, index, arr) {
        console.log(value, arr[index].answer, index);
        console.log('answer:' + arr[index].answer);
        if (arr[index].answer == '' && arr[index].type != 4) {
          arr[index].erroreMssage = '请选择选项';
        } else if (arr[index].answer == '' && arr[index].type == 4) {
          arr[index].erroreMssage = '请输入文字';
        } else if (arr[index].answer != '') {
          arr[index].erroreMssage = '';
        }
        console.log('erroreMssage:' + arr[index].erroreMssage);
      });
      if (this.currentNum !== this.questionArr.length || !this.questionArr[this.currentNum - 1].answer) {
        this.$toast('请选择一个选项');
        return;
      }
      debounce(() => {
        console.log('生成报告-wxUserInfo', this.wxUserInfo);
        if (this.wxUserInfo.openid) {
          const param = {
            agentId: this.agentId,
            baseInfoId: this.id,
            openId: this.wxUserInfo.openid || '',
          };
          console.log('生成报告-param', param);
          this.$store.dispatch('character/generatePersonRecord', param).then((res) => {
            if (res.code === 200) {
              this.$emit('updateType', { type: 3, getResult: { ...res.data } });
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
          this.$store.dispatch('character/selectAnswerQuestionResultDetailForApp', questionObject).then((res) => {
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
  background-color: #ffffff;
  // height: 100vh;
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
    font-size: 15px;
    z-index: 999;
    cursor: pointer;
    .default_button {
      // border: 1px solid #b3b3b3;
      border: 1px solid #00dddd;
      border-radius: 24px;
      height: 46px;
      line-height: 46px;
      width: 140px;
      color: #b3b3b3;
      background: #ffffff;
      margin-left: 20px;
      margin-right: 20px;
    }
    .click_button {
      @extend .default_button;
    }
    .disabledSubmit {
      width: 3.98rem;
      height: 0.82rem;
      line-height: 0.82rem;
      margin: 0 auto;
      border-radius: 0.48rem;
      font-size: 0.3rem;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: center;
    }
    .submit_button {
      width: 3.98rem;
      height: 0.82rem;
      line-height: 0.82rem;
      margin: 0 auto;
      background: linear-gradient(315deg, #009c64, #29c38c);
      border-radius: 0.48rem;
      box-shadow: 0px 0.04rem 0.2rem 0px rgba(0, 156, 100, 0.3);
      font-size: 0.3rem;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: center;
      color: #ffffff;
      cursor: pointer;
    }
    .click_button:active {
      // background: linear-gradient(90deg, #00dddd, #00c5cd);
      background: #009c64;
      color: white;
      border-color: transparent;
    }
  }
}
</style>
