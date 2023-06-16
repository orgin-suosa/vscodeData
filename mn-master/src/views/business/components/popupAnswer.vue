<template>
  <div>
    <!-- <van-popup class="van-popup-Evaluation" v-model="showFortuneResults" closeable close-icon="close"> -->
    <van-popup class="van-popup-default" v-model="showFortuneResults">
      <div class="default-body">
        <div class="default-card__total">
          <div class="default-card__total__title">
            <p>{{ result.name }}的答题情况</p>
          </div>
          <ul class="answerList">
            <li v-for="(key, i) in result.questionList" :key="i">
              <div class="title">
                <span>{{ i + 1 }}、</span>
                <span> {{ key.questionName }}</span>
                <span class="topicType">(单选)</span>
              </div>
              <div class="answerOptionList" v-if="key.type != 3">
                <div v-for="(item, index) in key.options" :key="index">
                  <div class="answerOption" v-if="item.isChecked === 1">{{ item.optionContent }}</div>
                </div>
              </div>
              <div class="listImgContent" v-if="key.type == 3">
                <div class="imgOption" v-for="(item, index) in key.options" :key="index">
                  <div class="imgContent">
                    <img class="listImg" :src="item.listImg" alt="" srcset="" />
                  </div>

                  <p class="custom-title">{{ item.content }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
    <div class="closeBox" v-if="showFortuneResults" @click="closeClick">
      <!-- <img class="icon-delete" :src="iconDelete" alt="" /> -->
      <i class="icon-delete"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupAnswer',
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
    console.log('测评结果组件-result', this.result);
  },
  methods: {
    closeClick() {
      this.showFortuneResults = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.van-popup-default {
  max-height: 79%;
  top: 1.2rem;
  background-color: transparent;
  border-radius: 0.3rem;
  z-index: 9999999;
  transform: translateX(-50%);
}
.default-body {
  .default-card__total {
    background: #ffffff;
    border-radius: 10px;
    padding: 0.3rem;
    &__title {
      font-size: 0.38rem;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      p {
        position: relative;
        display: inline-block;
      }
    }
  }
  .answerList {
    .title {
      font-size: 0.3rem;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #333333;
      padding-top: 0.4rem;
      padding-bottom: 0.2rem;
      .topicType {
        color: #999999;
        padding-left: 0.15rem;
      }
    }
    .answerOptionList {
      .answerOption {
        width: 6.3rem;
        padding: 0.1rem 0;
        background: rgba(153, 153, 153, 0.14);
        border-radius: 0.08rem;
        font-size: 0.3rem;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #333333;
        text-indent: 0.1em;
        margin-bottom: 0.1rem;
        padding-left: 0.3rem;
      }
    }
    .listImgContent {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      .imgOption {
        position: relative;
      }
      .custom-title {
        font-size: 0.3rem;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #333333;
        // position: absolute;
        // bottom: 0;
        padding-top: 0.2rem;
      }
      .imgContent {
        width: 2.8rem;
        height: 2.8rem;
        border-radius: 0.25rem;
        overflow: hidden;
        .listImg {
          width: 2.8rem;
          height: 2.8rem;
          object-fit: cover;
          border-radius: 0.25rem;
          overflow: hidden;
        }
      }
    }
  }
}

/deep/.closeBox {
  position: fixed;
  right: 0.3rem;
  top: 0.09rem;
  text-align: center;
  z-index: 9999;
  text-align: center;
  .icon-delete {
    width: 0.66rem;
    height: 0.66rem;
    display: inline-block;
    background-image: url('~@/assets/images/iconClose.png');
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
