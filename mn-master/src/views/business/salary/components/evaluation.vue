<template>
  <div class="evaluation">
    <div class="title">“放心选题，我们会保密哦！”</div>
    <div class="topic">
      <div class="topic_tip">*根据您的真实情况选择</div>
      <div class="topic_title">{{ testData[currentIndex].question }}</div>
      <van-radio-group v-model="currentRadio[currentIndex]">
        <div v-if="currentIndex !== 2">
          <div class="topic_bg" v-for="(item, index) in testData[currentIndex].content" :key="index">
            <van-radio :name="itm.answer" v-for="(itm, ind) in item" :key="ind" @click="choseAnswer(itm)">
              {{ itm.text }}
              <template #icon="props">
                <img class="img-icon" :src="props.checked ? icon.activeIcon : icon.inactiveIcon" />
              </template>
            </van-radio>
          </div>
        </div>
        <div v-if="currentIndex === 2">
          <div class="topic_all">
            <van-radio :name="itm.answer" v-for="(itm, ind) in testData[currentIndex].content" :key="ind" @click="choseAnswer(itm)">
              {{ itm.text }}
              <template #icon="props">
                <img class="img-icon" :src="props.checked ? icon.activeIcon : icon.inactiveIcon" />
              </template>
            </van-radio>
          </div>
        </div>
      </van-radio-group>
    </div>
    <div class="button">
      <img v-if="currentIndex !== 0" class="next_button" src="@/assets/images/last_button.png" alt="" @click="lastTopic" />
      <img v-if="currentIndex !== 2" class="next_button" src="@/assets/images/next_button.png" alt="" @click="addTopic" />
      <img v-if="currentIndex === 2" class="next_button" src="@/assets/images/result_button.png" alt="" @click="lookResult" />
    </div>
    <div class="num">第{{ currentIndex + 1 }}题 / 共3题</div>
  </div>
</template>

<script>
import { debounce } from '@/utils/util';
export default {
  name: 'Evaluation',
  props: {
    wxUserInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isWeChart: {
      type: Boolean,
      default: false,
    },
    agentId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentRadio: [], // 选中题目
      currentIndex: 0, // 当前题目
      icon: {
        activeIcon: require('../../../../assets/images/activeIcon.png'),
        inactiveIcon: require('../../../../assets/images/inactiveIcon.png'),
      },
      testData: [
        {
          question: '你每月工作多少天?',
          content: [
            [
              { chose: 'A', answer: 22, text: 'A. 打工族标准22天' },
              { chose: 'B', answer: 30, text: 'B. 公司就是我爹娘30天' },
            ],
            [
              { chose: 'C', answer: 15, text: 'C. 做一休一15天' },
              { chose: 'D', answer: 1, text: 'D. 继承家业，安心啃老0天' },
            ],
          ],
        },
        {
          question: '你每天工作多少小时?',
          content: [
            [
              { chose: 'A', answer: 24, text: 'A. 全年无休 (我与公司共存亡)' },
              { chose: 'B', answer: 8, text: 'B. 朝九晚五8小时 (准时上下班)' },
            ],
            [
              { chose: 'C', answer: 12, text: 'C. 每天12小时 (打工人的996)' },
              { chose: 'D', answer: 1, text: 'D. 全职家里蹲 (自由的灵魂)' },
            ],
          ],
        },
        {
          question: '你每月的税后收入是?',
          content: [
            { chose: 'A', answer: 2000, text: 'A. 2000~5000' },
            { chose: 'B', answer: 5000, text: 'B. 5000~8000' },
            { chose: 'C', answer: 8000, text: 'C. 8000~10000' },
            { chose: 'D', answer: 10000, text: 'D. 10000~15000' },
            { chose: 'E', answer: 15000, text: 'E. 15000~30000' },
            { chose: 'F', answer: 30000, text: 'F. 30000~100000' },
          ],
        },
      ],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    choseAnswer(val) {
      // console.log(val, '选中了');
      if (val) {
        debounce(() => {
          if (this.currentRadio[this.currentIndex]) {
            setTimeout(() => {
              if (this.currentRadio[this.currentIndex] && this.currentIndex < 2) {
                this.currentIndex = this.currentIndex + 1;
              } else {
                return;
              }
            }, 200);
          } else {
            this.$toast('请选择一个选项');
            return;
          }
        }, 500)();
      } else {
        this.$toast('请选择一个选项');
        return;
      }
    },
    // 点击上一题
    lastTopic() {
      this.currentIndex = this.currentIndex - 1;
    },
    // 点击下一题
    addTopic() {
      console.log(this.currentRadio, this.currentRadio[this.currentIndex], '111');
      if (!this.currentRadio[this.currentIndex]) {
        this.$toast('请选择一个选项');
        return;
      }
      this.currentIndex = this.currentIndex + 1;
      console.log(this.currentIndex);
    },
    // 获取测试结果
    getEvaluationResult() {
      debounce(() => {
        console.log('this.$route.query--->', this.$route.query);
        const appParams = {
          id: this.$route.query.id,
          agentId: this.agentId,
          monthPay: this.currentRadio[2],
          workHours: this.currentRadio[1],
          workDay: this.currentRadio[0],
        };
        console.log('appParams', appParams);
        let params = {};
        if (this.isWeChart) {
          const wxParams = {
            nickName: this.wxUserInfo.nickname || '', // 微信昵称
            openId: this.wxUserInfo.openid || '', // 微信openId
            headImgUrl: this.wxUserInfo.headimgurl || '', // 微信头像
          };
          params = Object.assign(appParams, wxParams);
        } else {
          params = appParams;
        }
        console.log('params', params);
        this.$store.dispatch('acquisition/getEvaluationResult', params).then((res) => {
          console.log(res, 'res============>');
          if (res.code === 200) {
            res.data.itSecondPay = Number(res.data.itSecondPay);
            res.data.isecondPay = Number(res.data.isecondPay);
            this.$emit('updateType', { type: '3', getresult: res.data });
          }
        });
      }, 500)();
    },
    // 查看结果
    lookResult() {
      if (!this.currentRadio[this.currentIndex]) {
        this.$toast('请选择一个选项');
        return;
      }
      this.getEvaluationResult();
      console.log(this.currentRadio, 'PK结束，去查看结果');
    },
  },
};
</script>

<style scoped lang="scss">
.evaluation {
  width: 100%;
  height: 100vh;
  background: url('~@/assets/images/result_bg.png') center/100% 100% no-repeat;
  overflow-y: scroll;
  position: relative;
  .title {
    font-size: 16px;
    color: #ffffff;
    line-height: 21px;
    margin-top: 11vh;
    text-align: center;
  }
  ::v-deep .topic {
    width: 346px;
    height: 350px;
    background: url('~@/assets/images/answer_bg.png') center/100% 100% no-repeat;
    position: relative;
    margin: 0 auto;
    margin-top: 3.6vh;
    &_tip {
      color: #fde663;
      font-size: 13px;
      text-align: center;
      padding-top: 4.1vh;
      letter-spacing: 1px;
    }
    &_title {
      font-size: 20px;
      font-weight: 500;
      color: #ffffff;
      margin: 2vh 0 1.9vh 23px;
    }
    &_bg {
      width: 321px;
      height: 106px;
      background: #6918c1;
      margin-left: 16px;
      .img-icon {
        width: 17px;
        height: 17px;
      }
      .van-radio__label {
        color: #fff;
        font-size: 16px;
      }
      .van-radio {
        padding-left: 8px;
        height: 50%;
      }
    }
    &_bg:nth-child(2) {
      margin-top: 8px;
    }
    &_all {
      width: 321px;
      height: 220px;
      background: #6918c1;
      margin-left: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .img-icon {
        width: 17px;
        height: 17px;
      }
      .van-radio__label {
        color: #fff;
        font-size: 16px;
      }
      .van-radio {
        padding-left: 8px;
      }
    }
  }
  .button {
    display: flex;
    justify-content: space-around;
    .next_button {
      width: 155px;
      height: 50px;
      margin: 0 auto;
      margin-top: 10vh;
      margin-bottom: 3.6vh;
    }
  }
  .num {
    text-align: center;
    color: #712d15;
    font-size: 13px;
  }
}
</style>
