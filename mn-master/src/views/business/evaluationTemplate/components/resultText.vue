<template>
  <div class="evaluate-report" v-if="Object.keys(resultLlist).length != 0">
    <div class="result_header">
      <div class="evaluate-report-top-bg"></div>
      <div class="evaluate-report-body-bg"></div>
      <!-- <div class="evaluate-report-rightbottom-bg"></div> -->
      <div class="evaluate-report-top-tip">
        <!-- <p class="evaluate-report-top-tip-react"></p> -->
        <p class="evaluate-report-top-tip-text" v-if="isPopup">
          <span class="tip-text-name" v-if="isParticipate">{{ resultLlist.name }}</span>
          <span class="tip-text-name" v-else>{{ resultLlist.nickName }}</span>
          <span>的测评结果</span>
        </p>
      </div>
      <div class="evaluate-report-title-wrapper">
        <div class="evaluate-report-title">
          <span class="nameTextBox">
            根据<span class="nameText"> {{ resultLlist.name }} </span>
          </span>
          <span>得出你属于</span>
        </div>
        <div class="evaluate-report-result-wrapper">
          <div class="evaluate-report-result">
            <span class="evaluate-report-result-text">{{ resultLlist.result }}</span>
            <span class="evaluate-report-result-icon"></span>
          </div>
          <!-- <img src="@/assets/evaluate/evaluate-report-quotation.png" alt="" /> -->
        </div>
      </div>
    </div>
    <div class="evaluate-report-content">
      <div class="evaluate-report-content-scroll">
        <div class="evaluate-report-content-title">
          <i class="evaluate-report-content-title-icon"></i>
          <div class="evaluate-report-content-title-text">测评结果：</div>
        </div>
        <div class="content_text">
          {{ resultLlist.resultAnalyse }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ResultText',
  filters: {},
  props: {
    type: {
      type: String,
      default: '',
    },
    result: {
      type: Object,
      default: () => {},
    },
    isPopup: {
      type: Boolean,
      default: () => {},
    },
    isParticipate: {
      type: Boolean,
      default: () => {},
    },
  },
  watch: {
    result(val) {
      this.results();
      console.log('result_header', val);
    },
  },
  data() {
    return {
      resultLlist: {}, // 测试结果
    };
  },
  mounted() {
    this.results();
  },
  methods: {
    results() {
      if (this.type === '1') {
        this.resultLlist = this.result;
      }
      console.log('ResultText', this.result, this.resultLlist);
    },
    getResult(openId, agentId, baseInfoId, id) {
      const param = {
        id: id,
        agentId: agentId,
        baseInfoId: baseInfoId,
        openId: openId,
      };
      this.$store.dispatch('challenge/selectPersonRecordDetail', param).then((res) => {
        this.resultLlist = res.data;
        console.log(res);
      });
    },
    getAppResult(result) {
      console.log('getAppResult-result', result);
      this.resultLlist = result;
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  li {
    list-style: none;
  }
}
$top-bg-height: 266px;
$bottom-height: 95px;
.evaluate-report {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #11ac74;
  padding: 0 15px;
  box-sizing: border-box;
  &-title-wrapper {
    position: absolute;
    top: 157px;
    left: 0;
    width: 100%;
    .evaluate-report-title {
      width: 80%;
      font-size: 15px;
      font-weight: 400;
      color: #999999;
      line-height: 21px;
      margin-left: 40px;
      .nameTextBox {
        // display: inline-flex;
        color: #999999;
        .nameText {
          color: #333333;
          // display: -webkit-box;
          // -webkit-box-orient: vertical;
          // -webkit-line-clamp: 2;
          // overflow: hidden;
        }
      }
    }
    .evaluate-report-result-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 0rem;
      .evaluate-report-result {
        font-size: 0.46rem;
        font-weight: 500;
        text-align: left;
        color: #009c64;
        line-height: 46px;
        margin-right: 7px;
        margin-left: 0;
        display: flex;
        align-items: center;
      }
      .evaluate-report-result-text {
        max-width: 5.6rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      .evaluate-report-result-icon {
        display: inline-block;
        width: 15px;
        height: 15px;
        background: url('~@/assets/evaluate/evaluate-report-quotation.png') no-repeat center;
        background-size: contain;
        margin-left: 0.12rem;
        position: relative;
        top: -0.05rem;
      }
      img {
        width: 15px;
        height: 15px;
      }
    }
  }
  // &::before {
  //   content: '';
  //   position: absolute;
  //   left: 50%;
  //   bottom: 0;
  //   width: 91%;
  //   height: 65%;
  //   background: url('~@/assets/evaluate/evaluate-report-rightbottom-bg.png'), #ffffff;
  //   background-size: 3.6rem 4.18rem;
  //   background-repeat: no-repeat;
  //   background-position: right bottom;
  //   transform: translateX(-50%);
  // }
  .test-time {
    font-size: 11px;
    font-weight: 400;
    color: #b3b3b3;
    margin-top: 19px;
  }
  &-content {
    width: 100%;
    height: calc(100% - #{$top-bg-height} - 33px);
    overflow-y: auto;
    background: #fff;
    padding: 0 15px 10px;
    box-sizing: border-box;
    padding-bottom: 0;
    position: relative;
    top: -0.62rem;
    padding-top: 0.7rem;
    left: 50%;
    transform: translateX(-49.8%);
    background: url('~@/assets/evaluate/evaluate-report-rightbottom-bg.png'), #ffffff;
    background-size: 3.6rem 4.18rem;
    background-repeat: no-repeat;
    background-position: right bottom;
    overflow: hidden;
    &-scroll {
      max-height: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      -webkit-transform: translate3d(0, 0, 0);
      cursor: pointer;
    }
    &-title {
      width: 245px;
      font-size: 15px;
      font-weight: 500;
      color: #999999;
      display: flex;
      align-items: center;
      margin-bottom: 13px;
      i {
        display: inline-block;
        background: url('~@/assets/evaluate/evaluate-tip-light.png') no-repeat center;
        background-size: 100% 100%;
        width: 13px;
        height: 13px;
      }
      &-text {
        margin-left: 5px;
      }
    }
    &-box {
      margin-top: 15px;
      margin-bottom: 5px;
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      &-title {
        margin-bottom: 5px;
      }
      &-item {
        margin-top: 15px;
      }
    }
  }
  &-top-bg {
    width: calc(100% + 30px);
    box-sizing: border-box;
    margin-left: -15px;
    height: $top-bg-height;
    background: url('~@/assets/evaluate/evaluate-report-top-bg.png') no-repeat center;
    background-size: 100% 100%;
  }
  &-top-tip {
    font-size: 0.38rem;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: left;
    color: #ffffff;
    position: absolute;
    top: 2%;
    left: 0.2rem;
    &-text {
      z-index: 9;
      position: relative;
      padding: 0.1rem;
      padding-bottom: 0;
      max-width: 6.5rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
    &-react {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 50%;
      background: rgba(0, 156, 100, 1);
    }
  }
  &-body-bg {
    width: 100%;
    height: 139px;
    position: absolute;
    top: 215px;
    left: 0;
    background: url('~@/assets/evaluate/evaluate-report-body-bg.png') no-repeat center;
    background-size: contain;
    z-index: 1;
  }
  &-rightbottom-bg {
    position: absolute;
    z-index: 2;
    right: 15px;
    bottom: 47px;
    width: 180px;
    height: 209px;
    background: url('~@/assets/evaluate/evaluate-report-rightbottom-bg.png') no-repeat center;
    background-size: 100% 100%;
  }
  &-bottom {
    height: $bottom-height;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background: #ffffff;
    box-shadow: 0px -3px 20px 0px #f1f1f1;
    padding: 10px 33px 0;
    box-sizing: border-box;
    z-index: 3;
    .question-btns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .question-btn {
        height: 40px;
        width: 143px;
        border-radius: 20px;
        font-size: 15px;
        font-weight: 600;
        border: 1px solid #009c64;
        display: flex;
        justify-content: center;
        align-items: center;
        &.previous {
          border: 1px solid #009c64;
          color: #009c64;
        }
        &.next {
          background: linear-gradient(315deg, #009c64, #29c38c);
          box-shadow: 0px 2px 10px 0px rgba(0, 156, 100, 0.3);
          color: #fff;
          border: none;
        }
      }
    }
  }
  .content_text {
    width: 265px;
    height: 100%;
    font-size: 14px;
    color: #333;
    padding-bottom: 0.8rem;
    line-height: 0.48rem;
    white-space: pre-line;
    ::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
