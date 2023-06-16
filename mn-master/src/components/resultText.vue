<template>
  <div class="evaluate-report" v-if="Object.keys(resultLlist).length != 0">
    <div class="result_header">
      <div class="evaluate-report-top-bg"></div>
      <div class="evaluate-report-body-bg"></div>
      <div class="evaluate-report-rightbottom-bg"></div>
      <div class="evaluate-report-title-wrapper">
        <div class="evaluate-report-title">根据<span> FPA性格色彩测试 </span>得出你属于</div>
        <div class="evaluate-report-result-wrapper">
          <div class="evaluate-report-result">{{ resultLlist.result }}</div>
          <img src="@/assets/evaluate/evaluate-report-quotation.png" alt="" />
        </div>
      </div>
    </div>
    <div class="evaluate-report-content">
      <div class="evaluate-report-content-title">
        <i class="evaluate-report-content-title-icon"></i>
        <div class="evaluate-report-content-title-text">测评结果：</div>
      </div>
      <div class="content_text" v-html="resultLlist.resultAnalyse"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ResultText',
  filters: {},
  props: {
    agentId: {
      type: String,
      default: '',
    },
    openId: {
      type: String,
      default: '',
    },
    resultLlist: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  mounted() {
    console.log('ResultText');
  },
  methods: {
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
// .result-container {
//   width: 343px;
//   min-height: calc(100vh - 80px);
//   margin: 0 auto;
//   padding-bottom: 80px;
//   .result_header {
//     width: 100%;
//     padding-top: 9px;
//     padding-bottom: 30px;
//     border-bottom: 1px dashed #d8d8d8;
//     .top {
//       display: flex;
//       justify-content: space-between;
//       .text {
//         .text_tip {
//           display: flex;
//           align-items: center;
//           img {
//             width: 11px;
//             height: 13px;
//           }
//           span {
//             font-size: 15px;
//             font-weight: 500;
//             color: #ffaf1a;
//             margin-left: 5px;
//           }
//         }
//         .text_title {
//           width: 185px;
//           font-size: 15px;
//           font-weight: 400;
//           color: #333333;
//           margin-top: 14px;
//         }
//       }
//       .cow-img {
//         width: 72px;
//         height: 72px;
//       }
//     }
//     .test-time {
//       font-size: 11px;
//       font-weight: 400;
//       color: #b3b3b3;
//       margin-top: 19px;
//     }
//   }
//   .result_content {
//     margin-top: 24px;
//     .content_title {
//       display: flex;
//       align-items: center;
//       padding-bottom: 5px;
//       img {
//         width: 14px;
//         height: 14px;
//       }
//       span {
//         font-size: 15px;
//         font-weight: 500;
//         color: #00c5cd;
//         margin-left: 5px;
//       }
//     }
//     .content_text {
//       font-size: 14px;
//       font-weight: 400;
//       text-align: justify;
//       color: #333333;
//       line-height: 24px;
//     }
//   }
// }
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
      font-size: 15px;
      font-weight: 400;
      color: #999999;
      line-height: 21px;
      margin-left: 40px;
      span {
        color: #333333;
      }
    }
    .evaluate-report-result-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 10px;
      .evaluate-report-result {
        font-size: 25px;
        font-weight: 500;
        text-align: center;
        color: #009c64;
        line-height: 36px;
        margin-right: 7px;
        margin-left: 23px;
      }
      img {
        width: 16px;
        height: 16px;
      }
    }
  }
  .test-time {
    font-size: 11px;
    font-weight: 400;
    color: #b3b3b3;
    margin-top: 19px;
  }
  &-content {
    width: 100%;
    height: calc(100% - #{$top-bg-height} - #{$bottom-height} - 15px);
    overflow-y: auto;
    background: #fff;
    padding: 0 15px 10px;
    box-sizing: border-box;
    &-title {
      font-size: 15px;
      font-weight: 500;
      color: #999999;
      display: flex;
      align-items: center;
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
  &-body-bg {
    width: 100%;
    height: 139px;
    position: absolute;
    top: 215px;
    left: 0;
    background: url('~@/assets/evaluate/evaluate-report-body-bg.png') no-repeat center;
    background-size: 100% 100%;
    z-index: 99;
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
    max-height: 90%;
    overflow-y: scroll;
    width: 84%;
  }
}
</style>
