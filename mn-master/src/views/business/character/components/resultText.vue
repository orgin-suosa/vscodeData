<template>
  <div class="result-container">
    <div v-if="Object.keys(resultLlist).length != 0">
      <div class="result_header">
        <div class="top">
          <div class="text">
            <div class="text_tip">
              <img class="tip-icon" src="@/assets/images/result-tip-icon.png" alt="" />
              <span>根据你的回答得出你属于：</span>
            </div>
            <div class="text_title">
              <p>{{ resultLlist.result }}</p>
            </div>
            <div class="test-time">评估时间：{{ resultLlist.updatedTime ? resultLlist.updatedTime : resultLlist.createdTime }}</div>
          </div>
          <img class="cow-img" src="@/assets/images/cow-icon.png" alt />
        </div>
      </div>
      <div class="result_content">
        <div class="content_title">
          <img class="title-icon" src="@/assets/images/result-icon.png" alt="" />
          <span>结果分析：</span>
        </div>
        <div class="content_text" v-html="resultLlist.resultAnalyse"></div>
      </div>
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
  },
  data() {
    return {
      resultLlist: {},
    };
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
      this.$store.dispatch('character/selectPersonRecordDetail', param).then((res) => {
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
.result-container {
  width: 343px;
  min-height: calc(100vh - 80px);
  margin: 0 auto;
  padding-bottom: 80px;
  .result_header {
    width: 100%;
    padding-top: 9px;
    padding-bottom: 30px;
    border-bottom: 1px dashed #d8d8d8;
    .top {
      display: flex;
      justify-content: space-between;
      .text {
        .text_tip {
          display: flex;
          align-items: center;
          img {
            width: 11px;
            height: 13px;
          }
          span {
            font-size: 15px;
            font-weight: 500;
            color: #ffaf1a;
            margin-left: 5px;
          }
        }
        .text_title {
          width: 185px;
          font-size: 15px;
          font-weight: 400;
          color: #333333;
          margin-top: 14px;
        }
      }
      .cow-img {
        width: 72px;
        height: 72px;
      }
    }
    .test-time {
      font-size: 11px;
      font-weight: 400;
      color: #b3b3b3;
      margin-top: 19px;
    }
  }
  .result_content {
    margin-top: 24px;
    .content_title {
      display: flex;
      align-items: center;
      padding-bottom: 5px;
      img {
        width: 14px;
        height: 14px;
      }
      span {
        font-size: 15px;
        font-weight: 500;
        color: #00c5cd;
        margin-left: 5px;
      }
    }
    .content_text {
      font-size: 14px;
      font-weight: 400;
      text-align: justify;
      color: #333333;
      line-height: 24px;
    }
  }
}
</style>
