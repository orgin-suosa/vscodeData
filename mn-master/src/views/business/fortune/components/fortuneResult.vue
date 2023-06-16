<template>
  <div class="fortune-result-wrapper">
    <div style="height:100%;overflow-y:auto">
      <div class="fortune-result-top">
        <div class="fortune-result-top__title">测试结果</div>
        <div class="fortune-result-top__line"></div>
        <div class="fortune-result-top__answerer">
          测试人：<span>{{ fortuneTestResultData.name }}</span>
        </div>
        <div v-if="fortuneTestResultData.referrerName" class="fortune-result-top__inviter">
          推荐人：<span>{{ fortuneTestResultData.referrerName }}</span>
        </div>
        <div class="fortune-result-top__gold"></div>
      </div>
      <div class="fortune-result-body">
        <div class="fortune-result-card__total">
          <div class="fortune-result-card__total__title">经过计算得出你的总收入为：</div>
          <div class="fortune-result-card__total-bottom">
            <div class="fortune-result-card__total-bottom__gold"></div>
            <div class="fortune-result-card__total-bottom__text">
              <div class="fortune-result-card__total-bottom__text__title">
                小计个人：<span class="highlight-money">{{ fortuneTestResultData.incomePersonage }}</span
                >元
              </div>
              <div class="fortune-result-card__total-bottom__text__title">
                公司小计：<span class="highlight-money">{{ fortuneTestResultData.incomeCompany }}</span
                >元
              </div>
            </div>
          </div>
        </div>
        <div class="fortune-result-card__detail">
          <div class="fortune-result-card__detail__title">详情分析如下：</div>
          <div class="fortune-result-card__detail__title">
            A：根据汽车拥有率50%，成交率30%，按你提供的数据可以算出收入为：<span class="highlight-money">{{ fortuneTestResultData.a }}</span
            >元
          </div>
          <div class="fortune-result-card__detail__title">
            B：人群中拥有员工总人数得出的收入为：<span class="highlight-money">{{ fortuneTestResultData.b }}</span
            >元
          </div>
          <div class="fortune-result-card__detail__title">
            C：人群中拥有建筑平方得出的收入为：<span class="highlight-money">{{ fortuneTestResultData.c }}</span
            >元
          </div>
          <div class="fortune-result-card__detail__title">
            D：人群中不同家庭收入的结果得出收入为：
          </div>
          <div class="fortune-result-card__detail__title">
            个人平台：<span class="highlight-money">{{ fortuneTestResultData.dpersonage }}</span
            >元
          </div>
          <div class="fortune-result-card__detail__title">
            公司平台：<span class="highlight-money">{{ fortuneTestResultData.dcompany }}</span
            >元
          </div>
          <div class="fortune-result-card__detail__title">
            E：人群中根据想找工作的人数得出的收入为：<span class="highlight-money">{{ fortuneTestResultData.e }}</span
            >元
          </div>
        </div>
      </div>
      <div class="fortune-result-bottom">
        <div>
          备注：本表中的测算收入只是根据经验值测算的人脉值带来的收入，不含公司基本法及奖励中包含的新人津贴、创业津贴、潜力新人奖、推荐新人奖、展业津贴、管理津贴及业务推动奖励等。公司第一年除佣金外，最高投入是：
        </div>
        <div>1、新人津贴最高：30600元</div>
        <div>2、晋升主管奖励：2200元</div>
        <div>3、晋组年终奖“1+30”:30000元</div>
        <div style="text-align:right;">
          计入津贴及奖励测算收入： <span>{{ fortuneTestResultData.allowanceAward }}</span> 元
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FortuneResult',
  props: {
    fortuneTestResultData: {
      type: Object,
      default: () => {
        return {
          name: '',
          referrerName: '',
          incomePersonage: '',
          incomeCompany: '',
          a: '',
          b: '',
          c: '',
          dpersonage: '',
          dcompany: '',
          e: '',
          allowanceAward: '',
        };
      },
    },
  },
  created() {
    console.log('测评结果页-问卷跳转至结果接收参-fortuneTestResultData:', this.fortuneTestResultData);
  },
  methods: {
    // clickFortuneResult() {
    //   this.$emit('clickFortuneResult', { page: 'result' });
    // },
  },
};
</script>
<style lang="scss" scoped>
.fortune-result-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  .fortune-result-top {
    height: 243px;
    background: url('~@/assets/images/fortune-result-top.png');
    background-size: 100% 100%;
    position: relative;
    &__title {
      position: absolute;
      top: 42px;
      left: 23px;
      font-size: 27px;
      font-weight: bold;
      color: #ffffff;
    }
    &__line {
      position: absolute;
      top: 92px;
      left: 23px;
      width: 19px;
      height: 3px;
      background: #a0d7ed;
    }
    &__answerer {
      position: absolute;
      top: 109px;
      left: 23px;
      color: #f8f8f8;
      font: {
        size: 16px;
        weight: bold;
      }
    }
    &__inviter {
      @extend .fortune-result-top__answerer;
      position: absolute;
      top: 134px;
      left: 23px;
    }
    &__gold {
      position: absolute;
      top: 15px;
      right: 0;
      width: 327px;
      height: 240px;
      background: url('~@/assets/images/fortune-result-goldtree.png');
      background-size: 100% 100%;
    }
  }
  .fortune-result-body {
    padding: 0 20px;
    margin-top: -52px;
    .fortune-result-card__total {
      opacity: 0.9;
      background: #ffffff;
      border-radius: 10px;
      padding: 29px 23px 8px;
      box-shadow: 2px 6px 5px #ccc;
      &__title {
        font-size: 16px;
        color: #373b3e;
        font-weight: bold;
      }
      &-bottom {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        &__gold {
          width: 111px;
          height: 75px;
          margin-top: 16px;
          background: url('~@/assets/images/fortune-result-wallet.png') no-repeat;
          background-size: 100% 100%;
        }
        &__text {
          width: 162px;
          min-height: 50px;
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 15px;
          font-family: PingFang SC Regular, PingFang SC Regular-Regular;
          font-weight: bold;
          text-align: left;
          color: #373b3e;
          &__title {
            font-size: 15px;
            font-weight: bold;
            color: #373b3e;
          }
        }
      }
    }
    .fortune-result-card__detail {
      @extend .fortune-result-card__total;
      padding: 19px 13px 9px 16px;
      color: #373b3e;
      font-size: 13px;
      line-height: 28px;
      margin-top: 15px;
    }
  }
  .fortune-result-bottom {
    padding: 27px 21px 20px;
    color: #9b9b9b;
    font-size: 13px;
    line-height: 23px;
  }
}
.highlight-money {
  font-size: 16px;
  font-weight: bold;
  color: #4cb1da;
  padding: 0 5px;
}
</style>
