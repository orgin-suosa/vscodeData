<template>
  <div>
    <van-popup class="van-popup-results" v-model="showFortuneEvaluation">
      <div class="fortune_question_list">
        <div class="titleLabel titleLabel-tip">测评人：{{ form.name }} 的测评情况</div>
        <div class="fortune_question_item">
          <div class="titleLabel">1、个人手机/微信通讯录总人数？</div>

          <van-field readonly class="fortuneField" v-model="form.addressBookNumber" type="text" input-align="right" placeholder="(人)" />
          <!-- <p class="unit" v-if="form.addressBookNumber">(人)</p> -->
        </div>
        <div class="fortune_question_item">
          <div class="titleLabel">2、朋友是企业主，大概的雇佣（个体户） 员工数？</div>
          <van-field readonly class="fortuneField" v-model="form.employeeNumber" type="text" input-align="right" placeholder="(人)" />
        </div>
        <div class="fortune_question_item">
          <div class="titleLabel">3、朋友有正在建设的工程项目，大概拥 有地产㎡</div>
          <van-field readonly class="fortuneField" v-model="form.realEstateArea" type="text" input-align="right" placeholder="(M²)" />
        </div>
        <div class="fortune_question_item">
          <div class="titleLabel">4、您身边朋友，5万以下年收入的家庭数？</div>
          <van-field readonly class="fortuneField" v-model="form.fiftyThousand" type="text" input-align="right" placeholder="(人)" />
        </div>
        <div class="fortune_question_item">
          <div class="titleLabel">5、您身边朋友，5万-10万以下年收入的 家庭数？</div>
          <van-field readonly class="fortuneField" v-model="form.fiftyToHundredThousand" type="text" input-align="right" placeholder="(人)" />
        </div>
        <div class="fortune_question_item">
          <div class="titleLabel">6、您身边朋友，10万-30万以下年收入 的家庭数？</div>
          <van-field readonly class="fortuneField" v-model="form.hundredToThreeHundredThousand" type="text" input-align="right" placeholder="(人)" />
        </div>
        <div class="fortune_question_item">
          <div class="titleLabel">7、您身边朋友，30万以上年收入的家庭数？</div>
          <van-field readonly class="fortuneField" v-model="form.threeHundredThousand" type="text" input-align="right" placeholder="(人)" />
        </div>
        <div class="fortune_question_item">
          <div class="titleLabel">8、经简单了解，身边想换工作，或者对 目前工作不是特别满意的朋友数？</div>
          <van-field readonly class="fortuneField" v-model="form.changeJob" type="text" input-align="right" placeholder="(人)" />
        </div>
      </div>
    </van-popup>
    <div class="closeBox" v-if="showFortuneEvaluation" @click="closeClick">
      <!-- <img class="icon-delete" :src="iconDelete" alt="" /> -->
      <i class="icon-delete"></i>
      <p class="icon-react"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupEvaluation',
  props: {
    form: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showFortuneEvaluation: false,
      iconDelete: require('@/assets/images/delete.png'),
    };
  },
  methods: {
    closeClick() {
      this.showFortuneEvaluation = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.van-popup-results {
  max-height: 88%;
  top: 53.4%;
  background-color: transparent;
  border-radius: 10px;
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
