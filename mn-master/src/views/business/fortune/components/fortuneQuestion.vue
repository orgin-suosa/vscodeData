<template>
  <div>
    <div class="fortune_question_wrapper" v-if="!showFortuneTestResult">
      <div style="height:100%;overflow-y:auto">
        <div class="fortune_question_list">
          <div class="fortune_question-tip">*以下都是必填项哦！</div>
          <div class="fortune_question_item">
            <div class="fortune_question_item__label">1、个人手机/微信通讯录总人数？</div>
            <van-field v-model="form.addressBookNumber" maxlength="5" type="digit" placeholder="(人)" />
          </div>
          <div class="fortune_question_item">
            <div class="fortune_question_item__label">2、朋友是企业主，大概的雇佣（个体户） 员工数？</div>
            <van-field v-model="form.employeeNumber" maxlength="5" type="digit" placeholder="(人)" />
          </div>
          <div class="fortune_question_item">
            <div class="fortune_question_item__label">3、朋友有正在建设的工程项目，大概拥 有地产㎡</div>
            <van-field v-model="form.realEstateArea" maxlength="5" type="digit" placeholder="(M²)" />
          </div>
          <div class="fortune_question_item">
            <div class="fortune_question_item__label">4、您身边朋友，5万以下年收入的家庭数？</div>
            <van-field v-model="form.fiftyThousand" maxlength="5" type="digit" placeholder="(人)" />
          </div>
          <div class="fortune_question_item">
            <div class="fortune_question_item__label">5、您身边朋友，5万-10万以下年收入的 家庭数？</div>
            <van-field v-model="form.fiftyToHundredThousand" maxlength="5" type="digit" placeholder="(人)" />
          </div>
          <div class="fortune_question_item">
            <div class="fortune_question_item__label">6、您身边朋友，10万-30万以下年收入 的家庭数？</div>
            <van-field v-model="form.hundredToThreeHundredThousand" maxlength="5" type="digit" placeholder="(人)" />
          </div>
          <div class="fortune_question_item">
            <div class="fortune_question_item__label">7、您身边朋友，30万以上年收入的家庭数？</div>
            <van-field v-model="form.threeHundredThousand" maxlength="5" type="digit" placeholder="(人)" />
          </div>
          <div class="fortune_question_item">
            <div class="fortune_question_item__label">8、经简单了解，身边想换工作，或者对 目前工作不是特别满意的朋友数？</div>
            <van-field v-model="form.changeJob" maxlength="5" type="digit" placeholder="(人)" />
          </div>
        </div>
        <div class="fortune_submit_btn_wrapper">
          <div class="fortune_submit_btn" @click="submitReview()"></div>
        </div>
      </div>
    </div>
    <FortuneTestResult v-if="showFortuneTestResult" :fortuneTestResultData="fortuneTestResultData"></FortuneTestResult>
  </div>
</template>

<script>
import { postReviewAndGetResult } from '@/api/fortune.js';
import { serialize } from '@/utils/wechatAuthUtil.js';
import FortuneTestResult from './fortuneTestResult';
export default {
  name: 'FortuneQuestion',
  components: {
    FortuneTestResult,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: {
        agentId: '', // 代理人id
        id: '', // 测评id
        userId: '', // 报名人id,仅微信中有
        addressBookNumber: '',
        employeeNumber: '',
        realEstateArea: '',
        fiftyThousand: '',
        fiftyToHundredThousand: '',
        hundredToThreeHundredThousand: '',
        threeHundredThousand: '',
        changeJob: '',
        uesrInfo: this.data,
      },
      showFortuneTestResult: false,
      fortuneTestResultData: {},
    };
  },
  watch: {
    data(val) {
      console.log('测评结果展示问卷调查', val);
    },
  },
  created() {
    this.uesrInfo = this.data;
    console.info('父组件传值-data', this.data);
    console.info('父组件传值-uesrInfo', this.uesrInfo);
    const { userId, agentId, id } = this.uesrInfo;
    this.form.userId = userId;
    this.form.agentId = agentId;
    this.form.id = id;
  },
  mounted() {},
  methods: {
    async submitReview() {
      console.log(this.form);
      const keys = ['addressBookNumber', 'employeeNumber', 'realEstateArea', 'fiftyThousand', 'fiftyToHundredThousand', 'hundredToThreeHundredThousand', 'threeHundredThousand', 'changeJob'];
      const validate = keys.every((item) => {
        if (!this.form[item]) {
          return false;
        }
        return true;
      });
      if (!validate) {
        return this.$toast('有必填项未填！');
      }
      const nonnegative = keys.every((item) => {
        if (Number(this.form[item]) < 0) {
          return false;
        }
        return true;
      });
      if (!nonnegative) {
        return this.$toast('请输入正整数！');
      }
      try {
        console.log(this.form, '财富金矿提交问卷form');
        const res = await postReviewAndGetResult(this.form);
        if (res.code == 200 && res.data) {
          this.$toast('提交成功！');
          console.log({ ...res.data, agentId: this.form.agentId, id: this.form.id }, '问卷跳转至结果传参');
          this.showFortuneTestResult = true;
          this.fortuneTestResultData = { ...res.data, agentId: this.form.agentId, id: this.form.id };
          console.log(this.fortuneTestResultData, '问卷跳转至结果传参-fortuneTestResultData');
          this.$emit('clickFortuneResult', { ...res.data, agentId: this.form.agentId, id: this.form.id });
          // this.$emit('clickFortuneResult', { page: 'result', params: { ...res.data, agentId: this.form.agentId, id: this.form.id } });
          // setTimeout(() => {
          //   this.$router.replace({
          //     name: 'FortuneTestResult',
          //     query: { ...res.data, agentId: this.form.agentId, id: this.form.id },
          //   });
          // }, 1500);
        }
        console.log(res);
      } catch (error) {
        console.log(error, '提交财富金矿问卷报错');
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    console.log(to, 'fortuneQuestionTo');
    console.log(from, 'fortuneQuestionFrom');
    const ua = window.navigator.userAgent.toLowerCase();
    if (from.name == 'FortuneTestResult') {
      // 微信中，结果页左上角直接关闭
      if (ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i)[0] === 'micromessenger') {
        // eslint-disable-next-line no-undef
        WeixinJSBridge.call('closeWindow');
      } else {
        next({ path: '/business' });
      }
    } else if (from.path == '/fortunequestion' && to.path == '/fortunequestion') {
      // 修复iOS分享bug
      if (window.performance.navigation.type == 1) {
        next();
      } else {
        window.location.replace(process.env.VUE_APP_SERVICE_URL + '/h5-agent-business/fortune' + serialize(from.query));
      }
    } else {
      next();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../style/fortuneQuestion';
::v-deep .van-cell {
  padding: 0;
  margin-top: 20px;
  height: 32px;
  width: 100%;
  border-radius: 5px;
  font-size: 16px;
  padding-left: 10px;
  line-height: 32px;
  .van-field__control {
    &::-webkit-input-placeholder {
      text-align: right;
      padding-right: 25px;
    }
  }
}
</style>
