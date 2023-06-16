<template>
  <div>
    <van-popup class="van-popup-results" v-model="showPopupAnswers">
      <div class="fortune_question_list">
        <div class="titleLabel titleLabel-tip">测评人：{{ nickname }} 的测评情况</div>
        <div class="fortune_question_item" v-for="(item, index) in answerContentList" :key="index">
          <div class="titleLabel">{{ item.questionName }}</div>
          <div v-for="(key, i) in item.options" :key="i">
            <p v-if="key.isChecked == 1" class="titleContent">{{ key.optionContent }}</p>
          </div>

          <!-- <van-field readonly class="fortuneField" v-model="item.optionContent" type="text" input-align="right" placeholder="" /> -->
          <!-- <p class="unit" v-if="form.addressBookNumber">(人)</p> -->
        </div>
      </div>
    </van-popup>
    <div class="closeBox" v-if="showPopupAnswers" @click="closeClick">
      <!-- <img class="icon-delete" :src="iconDelete" alt="" /> -->
      <i class="icon-delete"></i>
      <p class="icon-react"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupAnswers',
  data() {
    return {
      showPopupAnswers: false,
      iconDelete: require('@/assets/images/delete.png'),
      form: {
        name: '',
      },
      allOptionList: [], // 全部答案列表
      answerList: [], // 全部答案list
      selectAnswerIDList: [], // 正确答案id
      allAnswerList: [], // all正确答案id
      allAnswerContentList: [], // all 正确答案内容
      timer: 0,
      questionNameList: [],
      answerContentList: [],
      answerContentList1: [
        {
          id: '827585381640699904',
          baseInfoId: '827584892031205376',
          resultType: 1,
          questionType: 1,
          questionName: '问题1:',
          questionSequence: 1,
          nextQuesCode: 2,
          keyInfo: 1,
          options: [
            {
              classifyId: null,
              id: '827585382039158784',
              nextQuesCode: 0,
              optionContent: 'A 选项一',
              optionScore: 10,
              optionSequence: 1,
              optionValue: 0,
              questionId: '827585381640699904',
              isChecked: 0,
            },
            {
              classifyId: null,
              id: '827585382039158784',
              nextQuesCode: 0,
              optionContent: 'B 选项二',
              optionScore: 10,
              optionSequence: 1,
              optionValue: 0,
              questionId: '827585381640699904',
              isChecked: 1,
            },
            {
              classifyId: null,
              id: '827585382039158784',
              nextQuesCode: 0,
              optionContent: 'C 选项三',
              optionScore: 10,
              optionSequence: 1,
              optionValue: 0,
              questionId: '827585381640699904',
              isChecked: 0,
            },
            {
              classifyId: null,
              id: '827585382039158784',
              nextQuesCode: 0,
              optionContent: 'D 选项四',
              optionScore: 10,
              optionSequence: 1,
              optionValue: 0,
              questionId: '827585381640699904',
              isChecked: 0,
            },
          ],
        },
        {
          id: '827585381640699904',
          baseInfoId: '827584892031205376',
          resultType: 1,
          questionType: 1,
          questionName: '问题1:',
          questionSequence: 1,
          nextQuesCode: 2,
          keyInfo: 1,
          options: [
            {
              classifyId: null,
              id: '827585382039158784',
              nextQuesCode: 0,
              optionContent: 'A 选项一',
              optionScore: 10,
              optionSequence: 1,
              optionValue: 0,
              questionId: '827585381640699904',
              isChecked: true,
            },
            {
              classifyId: null,
              id: '827585382039158784',
              nextQuesCode: 0,
              optionContent: 'B 选项二',
              optionScore: 10,
              optionSequence: 1,
              optionValue: 0,
              questionId: '827585381640699904',
              isChecked: false,
            },
            {
              classifyId: null,
              id: '827585382039158784',
              nextQuesCode: 0,
              optionContent: 'C 选项三',
              optionScore: 10,
              optionSequence: 1,
              optionValue: 0,
              questionId: '827585381640699904',
              isChecked: false,
            },
            {
              classifyId: null,
              id: '827585382039158784',
              nextQuesCode: 0,
              optionContent: 'D 选项四',
              optionScore: 10,
              optionSequence: 1,
              optionValue: 0,
              questionId: '827585381640699904',
              isChecked: false,
            },
          ],
        },
      ], // 正确答案内容
    };
  },
  props: {
    nickname: {
      typr: Object,
      default: () => {},
    },
  },
  created() {
    console.log('测评结果-dataAnswers:', this.dataAnswers);
  },
  // 销毁前清除定时器
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    closeClick() {
      this.showPopupAnswers = false;
      this.answerContentList.splice(0, this.answerContentList.length);
    },
    async initCreated(id) {
      await this.selectPersonOptionAnswerFinishList(id);
      // await this.selectPersonOptionAnswerFinishList(agentId, baseInfoId, openId);
    },
    selectQuestionList(id) {
      this.allOptionList.splice(0, this.allOptionList.length);
      this.selectAnswerIDList.splice(0, this.selectAnswerIDList.length);
      this.questionNameList.splice(0, this.questionNameList.length);

      const _this = this;
      console.log('id:', id);
      const params = {
        id: id,
      };
      this.$store
        .dispatch('challenge/selectQuestionList', params)
        .then((res) => {
          if (res.code === 200) {
            console.log(res, 'res============>展业工具题目列表查询');
            this.form = res.data;
            res.data.forEach(function(value, index, array) {
              console.log('value.options', value.options);
              _this.allOptionList.push(value.options);
              _this.questionNameList.push({
                questionName: value.questionName,
              });
              console.log('所有题:', _this.allOptionList);
            });
          }
        })
        .finally(() => {
          // this.selectPersonOptionAnswerFinishList(agentId, baseInfoId, openId);
        })
        .catch((e) => {
          console.log('查询异常', e);
        });
    },
    selectPersonOptionAnswerFinishList(id) {
      const _this = this;
      this.answerList.splice(0, this.answerList.length);
      const params = {
        id: id,
      };
      this.$store
        .dispatch('challenge/selectPersonOptionAnswerFinishList', params)
        .then((res) => {
          if (res.code === 200) {
            console.log(res, 'res============>已完成测评答题情况查询');
            _this.answerContentList = res.data;
            // res.data.forEach(function(value, index, array) {
            //   _this.answerList.push(value.questionOptionsId);
            //   console.log('答案ID:', _this.answerList);
            // });
            // _this.answerContent();
            // this.timer = setTimeout(() => {
            //   _this.answerContent();
            // }, 0);
            // this.form = res.data?.total ? res.data.total : 1;
          }
        })
        .finally(() => {})
        .catch((e) => {
          console.log('查询异常', e);
        });
    },
    answerContent() {
      const _this = this;
      this.answerContentList.splice(0, this.answerContentList.length);
      _this.allOptionList.forEach((key, i) => {
        console.log('所选答案内容-序号---key', key, i);
        // const optionText = Object.values(key);
        const optionKey = Object.keys(key);
        console.log('所选答案内容---optionKey', optionKey);
        const answerContentList = optionKey.filter((item) => {
          console.log('========所选答案内容-item', key[item].id);
          console.log('========所选答案内容-筛选正确答案-列表-正确答案ID', _this.answerList, _this.answerList[item]);
          if (_this.answerList.includes(key[item].id)) {
            _this.answerContentList.push({
              id: key[item].id,
              questionName: _this.questionNameList[i].questionName,
              optionContent: key[item].optionContent,
            });
          }
        });
        console.log('========所选答案内容-answerContentList', answerContentList);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.van-popup-results {
  min-height: 70%;
  max-height: 70%;
  top: 10%;
  background-color: #ffffff;
  transform: translate3d(-50%, 0%, 0);
  border-radius: 0.3rem;
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
  padding-bottom: 0.4rem;
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
  }
  .titleContent {
    font-size: 0.28rem;
    font-family: PingFang SC Light, PingFang SC Light-Light;
    font-weight: bold;
    text-align: left;
    color: #52575b;
    background: #ffffff;
    border: 0.02rem solid #348bd9;
    padding: 0.3rem;
    text-align: left;
    border-radius: 0.1rem;
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
    padding-top: 0.48rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid rgba(164, 164, 164, 1);
  }
  .fortune_question_item:last-child {
    border-bottom: 0;
  }
}

/deep/.closeBox {
  position: fixed;
  right: 12%;
  top: 0%;
  text-align: center;
  z-index: 9999;
  text-align: center;
  .icon-delete {
    width: 0.45rem;
    height: 0.45rem;
    display: inline-block;
    background-image: url('~@/assets/images/delete.png');
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
</style>
