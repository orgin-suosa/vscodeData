<template>
  <div class="evaluate-report">
      <div class="evaluate-report-top-tip">
        <p>预计退休后每月可领养老金 (元)</p>
        <p class="evaluate-report-top-tip-number">{{ recordDatelist.monthRetireMoneyByResult }}</p>
      </div>
      <div class="evaluate-report-box">
        <ul class="evaluate-report-list">
          <li>
            <div class="evaluate-report-list-left">
              <p>目前年龄 (岁)</p>
              <p>{{ recordDatelist.age }}</p>
            </div>
            <div class="evaluate-report-list-right">
              <img src="@/assets/oldAgePension/icon01.png" alt="" srcset="">
              <div class="numberText">
                <p>预计退休年龄 (岁)</p>
                <p>{{ recordDatelist.retirementAge }}</p>
              </div>
            </div>
          </li>
          <li>
            <div class="evaluate-report-list-left">
              <p>目前薪资 (元)</p>
              <p>{{ recordDatelist.monthSalaryByPreTax }}</p>
            </div>
            <div class="evaluate-report-list-right">
              <img src="@/assets/oldAgePension/icon02.png" alt="" srcset="">
              <div class="numberText">
                <p>期望养老金 (元)</p>
                <p>{{ recordDatelist.monthRetireMoneyByExpect }}</p>
              </div>
            </div>
          </li>
          <li v-if="recordDatelist.type == 100">
            <div class="evaluate-report-list-left">
              <p>养老金缺口/月 (元)</p>
              <p>{{ recordDatelist.pensionGapMonth }}</p>
            </div>
            <div class="evaluate-report-list-right">
            <img src="@/assets/oldAgePension/icon03.png" alt="" srcset="">
              <div class="numberText">
                <p>养老金缺口/年 (元)</p>
                <p>{{ recordDatelist.pensionGapYear }}</p>
              </div>
          </div>
          </li>
        </ul>
      <div class="evaluate-report-content">
        <p class="evaluate-report-content-top">
          <span class="circle"></span>
          <span>养老规划</span>
        </p>
        <div class="evaluate-report-content-scroll">
          <!-- <div class="content_text" v-html=" resultLlist.resultAnalyse">
            {{ resultLlist.resultAnalyse }}
          </div> -->
          <div class="content_text" v-if="recordDatelist.type == 100">
            根据测算结果，<span class="content_text_key">不能满足</span>您期望的退休后生活水平，您需要<span class="content_text_key">逐步积累财富或者每个月额外增加养老金</span><span class="content_text_number"> {{ recordDatelist.pensionGapMonth }}</span><span class="content_text_key">元，</span>或者<span class="content_text_key">每年额外增加养老金</span> <span class="content_text_number">{{ recordDatelist.pensionGapYear }}</span><span class="content_text_key">元</span>
          </div>
          <div class="content_text" v-else>
            您目前的工资水平一直保持下去的话，完全<span class="content_text_key">可以满足</span>您期望的退休生活。您可以把<span class="content_text_key">每月盈余的</span> <span class="content_text_number"> {{ recordDatelist.pensionGapMonth }} </span><span class="content_text_key">元进行其他投资</span>，以获取更高的回报
          </div>
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
    resultlist: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      resultLlist: null, // 测试结果
      isGap: false,
    };
  },
  computed: {
    recordDatelist: function() {
      return this.$store.getters.gettersRecordDate;
    },
    getRecordID: function() {
      return this.$store.getters.gettersRecordID;
    }
  },
  watch: {
    result(val) {
      this.results();
      console.log('result_header', val);
    },
    // resultLlist: {
    //   handler(newName, oldName) {
    //     this.resultLlist = this.$store.state.recordDate;
    //     console.log("养老金测算结果：newName -", newName);
    //     console.log("养老金测算结果-oldName -", oldName);
    //     this.$forceUpdate();
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },
  created() {
    this.resultLlist = this.resultlist;
    console.log("resultLlist:", this.resultlist);
  },
  mounted() {
    this.results();
    console.log("测评报告-resultText-recordDate-:", this.$store.getters.gettersRecordDate);
  },
  methods: {
    results() {
      if (this.type === '1') {
        this.resultLlist = this.result;
      }
      console.log('ResultText', this.result, this.resultLlist);
    },
    getRecordDate() {
      this.resultLlist = this.$store.state.recordDate;
    },
    getResult(openId, agentId, baseInfoId, id) {
      const param = {
        id: id,
        agentId: agentId,
        baseInfoId: baseInfoId,
        openId: openId,
      };
      console.log('getAppResult-result', param);
      this.$store.dispatch('annuity/getAppPensionResult', param).then((res) => {
        this.resultLlist = res.data;
        console.log(res);
      });
    },
    getAppResult() {
      const param = {
        id: this.getRecordID
      };
      console.log('getAppResult-result', param);
      this.$store.dispatch('annuity/getAppPensionResult', param).then((res) => {
        this.resultLlist = res.data;
        console.log("resultText-getAppResult-res", res);
      });
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
$navbar-height: 44px;
$appModel-title-height: 55px;
$bottom-height: 95px;
@font-face {
  font-family:'D-DINExp';
  src: url('~@/assets/font/D-DINExp.ttf');
}
@font-face {
  font-family: 'D-DINExp-Bold';
  src:url('~@/assets/font/D-DINExp-Bold.ttf');
}
.evaluate-report {
  position: relative;
  width: 100%;
  // height: calc(100% - #{$navbar-height} -  #{$bottom-height});
  overflow-x: hidden;
  overflow-y: scroll;
  background: #f7f8f9;
  box-sizing: border-box;
  &-title-wrapper {
    position: absolute;
    top: 157px;
    left: 0;
    width: 100%;

  }
  &-box{
    position: relative;
    top:-20px;
  }
  &-content {
    // height: calc(100% - #{$top-bg-height} - 33px);
    width: 92%;
    // height: 177px;
    overflow-y: scroll;
    margin: 0 auto;
    opacity: 1;
    border-radius: 8px;
    box-shadow: 0px 5px 20px 0px rgba(130,137,151,0.31);
    overflow-y: auto;
    box-sizing: border-box;
    background: #71e4bc;
    background-image: url('~@/assets/oldAgePension/icon05.png');
    background-size: 135px 46px;
    background-position: right top;
    background-repeat: no-repeat;
    overflow: hidden;
   &-top{
     color: #05734b;
     padding: 0 0 2px 10px;
     font-size: 18px;
     font-family: PingFangSC, PingFangSC-Semibold;
     font-weight: 600;
     text-align: left;
     color: #04935f;
     .circle{
       display: inline-block;
       width: 10px;
       height: 10px;
       background: #ffffff;
       border-radius: 50%;
       margin-right: 10px;
     }
    }
    &-scroll {
      width:max-content;
      // height: 104px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 8px;
      // overflow-y: scroll;
       overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      -webkit-transform: translate3d(0, 0, 0);
      cursor: pointer;
      margin-bottom: 10px;
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
  &-top-tip {
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    color: #666666;
    text-align:center;
    height: 118px;
    background: url('~@/assets/oldAgePension/icon04.png') no-repeat center;
    background-size: contain;
    overflow: hidden;
    p:first-child{
      padding-top: 16px;
      padding-bottom: 5px;
    }
    &-number{
      font-size: 30px;
      font-family: 'D-DINExp-Bold';
      font-weight: 700;
      text-align: center;
      color: #333333;
      max-width: 355px;
      height: 40px;
      overflow: hidden;
      overflow-x: auto;
     padding-left: 10px;
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 1;
      // -webkit-box-orient: vertical;
      // word-break: break-all;
    }
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
  }
 &-list{
   font-size: 16px;
    width: 92%;
    margin: 0 auto;
   li{
     width: 100%;
     height: 80px;
     line-height: 25px;
     margin-bottom: 10px;
     background: #ffffff;
     border-radius: 8px;
     position: relative;
     display: flex;
     align-items: center;
     justify-content: center;
     background: #ffffff;
     overflow: hidden;
   }
   &-left, &-right{
      width: 50%;
      height: 100%;
      p{
        font-size: 15px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        padding-top: 10px;
        padding-left: 10px;
        white-space: nowrap;
      }
      p:last-child{
         padding-top: 8px;
        font-size: 22px;
        font-family: D, D-Bold;
        font-weight: 700;
        max-width: 135px;
        height: 23px;
        overflow: hidden;
        overflow-x: auto;
        margin: 0 auto;
        padding-left: 10px;
        // text-overflow: ellipsis;
      }
      img{
        width: 28px;
        height: 28px;
        padding-top: 10px;
        padding-left: 10px;
      }
    }
    &-left{
      width: 43%;
      p{
        color: #999999;
      }
      p:last-child{
        font-size: 22px;
        font-family: 'D-DINExp';
        font-weight: 400;
        text-align: justify;
        color: #333333;
      }
     }
    &-right{
      width: 57%;
      border-radius: 8px;
      box-shadow: 0px 5px 20px 0px rgba(130,137,151,0.31);
      position: relative;
      display: flex;
      .numberText{
        z-index: 9;
      }
      &::after{
        content: "";
        width: 100%;
        height: 130%;
        position: absolute;
        left: 55%;
        top: 50%;
        border-radius: 50%;
      }
      p:last-child{
        max-width: 145px;
        font-family: 'D-DINExp-Bold';
      }
    }
   li:nth-child(1){
    .evaluate-report-list-right{
        color: #01BC79;
        background: #dcfff3;
        white-space: nowrap;
        &-title{
          display: flex;
          height: auto;
        }
        &::after{
          background: linear-gradient(225deg,rgba(222,255,245,0.00) 11%, rgba(155,255,221,0.46) 57%);
        }
    }
   }
   li:nth-child(2){
    .evaluate-report-list-right{
      color: #FF8E00;
      background: #fff6ea;
      &::after{
        background: linear-gradient(239deg,#fff6ea 12%, #ffeacf 81%);
      }
    }
   }
  li:nth-child(3){
    .evaluate-report-list-right{
      color: #00a4ff;
      background: #e0f4ff;
      &::after{
        background: linear-gradient(239deg,#e0f4ff 12%, #b2e4ff 81%);
      }
    }
   }
   .list-left{
     display: inline-block;
     width: 50%;
     text-align: left;
   }
   .list-right{
    width: 50%;
   }
  }
  .content_text {
    width:305px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: justify;
    color: #666666;
    padding: 10px;
    line-height: 24px;
    white-space: pre-line;
    background: #ffffff;
    border-radius: 5px;
    margin: 0 auto;
    &_key{
      color: #333333;
    }
   &_number{
     font-size: 17px;
      color: #FF6F00;
      padding:0  10px;
      font-family: 'D-DINExp-Bold';
    }
    ::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
