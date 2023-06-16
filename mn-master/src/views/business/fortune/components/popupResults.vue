<template>
  <div>
    <!-- <van-popup class="van-popup-Evaluation" v-model="showFortuneResults" closeable close-icon="close"> -->
    <van-popup class="van-popup-Evaluation" v-model="showFortuneResults">
      <div class="fortune-result-body">
        <div class="fortune-result-card__total">
          <div class="fortune-result-card__total__title">测评人：{{ result.name }} 的测评结果</div>
          <div class="fortune-result-card__total-bottom">
            <div class="fortune-result-card__total-bottom__gold"></div>
            <div class="fortune-result-card__total-bottom__text">
              <div class="fortune-result-card__total-bottom__text__title">
                小计个人：<span class="highlight-money">{{ result.incomePersonage }}</span>元
              </div>
              <div class="fortune-result-card__total-bottom__text__title">
                公司小计：<span class="highlight-money">{{ result.incomeCompany }}</span>元
              </div>
            </div>
          </div>
        </div>
        <div class="fortune-result-card__detail">
          <div class="fortune-result-card__detail__title">详情分析如下：</div>
          <div class="fortune-result-card__detail__text">
            A：根据汽车拥有率50%，成交率30%，按你提供的数据可以算出收入为：<span class="highlight-money">{{ result.a }}</span>元
          </div>
          <div class="fortune-result-card__detail__text">
            B：人群中拥有员工总人数得出的收入为：<span class="highlight-money">{{ result.b }}</span>元
          </div>
          <div class="fortune-result-card__detail__text">
            C：人群中拥有建筑平方得出的收入为：<span class="highlight-money">{{ result.c }}</span>元
          </div>
          <div class="fortune-result-card__detail__text">
            D：人群中不同家庭收入的结果得出收入为：
          </div>
          <div class="fortune-result-card__detail__text">
            个人平台：<span class="highlight-money">{{ result.dpersonage }}</span>元
          </div>
          <div class="fortune-result-card__detail__text">
            公司平台：<span class="highlight-money">{{ result.dcompany }}</span>元
          </div>
          <div class="fortune-result-card__detail__text">
            E：人群中根据想找工作的人数得出的收入为：
            <span class="highlight-money">{{ result.e }}</span>元
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
            计入津贴及奖励测算收入： <span class="highlight-money">{{ result.allowanceAward }}</span> 元
          </div>
        </div>
      </div>
    </van-popup>
    <div class="closeBox" v-if="showFortuneResults" @click="closeClick">
      <!-- <img class="icon-delete" :src="iconDelete" alt="" /> -->
      <i class="icon-delete"></i>
      <p class="icon-react"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupResults',
  props: {
    result: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showFortuneResults: false,
      iconDelete: require('@/assets/images/delete.png'),
    };
  },
  created() {
    console.log('测评结果组件-PopupResults', this.result);
  },
  methods: {
    closeClick() {
      this.showFortuneResults = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.van-popup-Evaluation {
  max-height: 88%;
  top: 53.4%;
  background-color: transparent;
  border-radius: 0.3rem;
  z-index: 9999999;
}
.fortune-result-body {
  .fortune-result-card__total {
    opacity: 0.9;
    background: #ffffff;
    border-radius: 10px;
    padding: 0.5rem 0.7rem 0.16rem 0.5rem;
    &__title {
      font-size: 16px;
      color: #373b3e;
      white-space: nowrap;
      padding-bottom: 0.1rem;
      border-bottom: 1px solid rgba(155, 155, 155, 1);
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
        height: 50px;
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
          white-space: nowrap;
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
    &__title {
      border-bottom: 1px solid rgba(155, 155, 155, 1);
    }
  }
  .fortune-result-bottom {
    @extend .fortune-result-card__total;
    padding: 0.3rem;
    margin-top: 15px;
    color: rgba(55, 59, 62, 1);
    font-size: 13px;
    line-height: 23px;
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
.highlight-money {
  font-size: 16px;
  font-weight: bold;
  color: #4cb1da;
  margin: 0 5px;
  border-bottom: 1px solid #525658;
}
</style>
