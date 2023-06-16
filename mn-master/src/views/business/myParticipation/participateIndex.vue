<template>
  <div class="ParticipateIndex">
    <div v-if="isLoading" class="customer-list__loading">
      <van-loading size="24px" vertical color="#009c64">
        加载中...
      </van-loading>
    </div>
    <div v-else>
      <div class="content" v-if="list.length > 0">
        <van-list v-model="loading" :finished="finished" finished-text="" @load="getAgentParticipate">
          <div class="list" v-for="(item, index) in list" :key="index">
            <div class="topContent">
              <div class="imgContent">
                <img class="listImg" :src="item.listImg" alt="" />
                <!-- <p class="evaluationLabel" v-if="item.type == 2">测评</p>
                <p class="questionnaireLabel" v-if="item.type == 3">问卷</p> -->
              </div>

              <div class="textContent">
                <p class="titleText">{{ item.name }}</p>
                <p class="shareTime">参与时间:{{ item.updatedTime }}</p>
              </div>
            </div>

            <div class="bottomContent">
              <div class="buttonList">
                <div class="button-answers" v-if="item.url != 'annuity'" @click="showResults(item)">答题情况</div>
                <div v-if="item.questionResultId !== '0'" class="button-evaluation" @click="showEvaluation(item)">测评结果</div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
      <popupEvaluation :getResult="getResult" :isParticipate="true" ref="popupEvaluation" />
      <popupAnnuity :getResult="getResult" :isParticipate="true" ref="popupAnnuity" />
      <popupAnswer :result="result" :isParticipate="true" ref="popupResults" />
      <Ndata v-if="list.length === 0" />
    </div>
  </div>
</template>

<script>
import Ndata from '@/components/ndata.vue';
import { handleHideSkeletonRouter } from '@/skeleton/utils';
import popupEvaluation from '../components/popupEvaluation.vue';
import popupAnnuity from '../components/popupAnnuity.vue';
import popupAnswer from '../components/popupAnswer.vue';
export default {
  name: 'IndexChild',
  components: {
    Ndata,
    popupEvaluation,
    popupAnswer,
    popupAnnuity,
  },
  filters: {
    convertNum(num) {
      const standard = 10000;
      if (num >= standard) {
        const convertedNum = (num / standard).toFixed(1);
        const numArr = String.prototype.split.call(convertedNum, '.');
        if (Array.isArray(numArr) && numArr[1] != '0') {
          return convertedNum + 'w';
        } else {
          return numArr[0] + 'w';
        }
      } else {
        return num;
      }
    },
  },
  data() {
    return {
      data: [],
      agentId: '',
      loading: false,
      isLoading: false,
      finished: false,
      list: [],
      pageList: {
        pageIndex: 1,
        pageSize: 10,
      },
      height: '',
      shareTimes: 0, // 分享次数
      NumberParticipants: 0, // 参与次数
      getResult: {}, // 测试结果
      result: { name: '', questionList: [] },
    };
  },
  computed: {},
  watch: {
    result(val) {
      console.log('测评结果 数据处理', val);
    },
    getResult(val) {
      console.log('测评情况 数据处理', val);
    },
  },
  created() {
    this.height = this.$appInterface.getNavBarHeight() || '34';
    this.agentId = this.$appInterface.getCreateId() || '782994890127572992';
    this.baseInfoId = this.$route.query.baseInfoId;
    this.getAgentParticipate();
    console.log('路由：', this.$route.query);
  },
  mounted() {},
  methods: {
    // 代理人参与情况列表信息
    getAgentParticipate() {
      this.loading = true;
      this.finished = false;
      this.pageList.agentId = this.agentId;
      const params = this.pageList;
      this.$store
        .dispatch('challenge/getAgentParticipate', params)
        .then((res) => {
          console.log('getAgentParticipate--', res);
          if (res.code === 200) {
            this.loading = false;
            const data = res.data?.list?.length > 0 ? res.data.list : [];
            this.list = this.list.concat(data);
            if (this.pageList.pageIndex * this.pageList.pageSize >= res.data.total) {
              this.finished = true;
            }
            if (this.pageList.pageIndex * this.pageList.pageSize < res.data.total) {
              this.pageList.pageIndex += 1;
            }
          }
        })
        .finally(() => {
          handleHideSkeletonRouter(this.$route.name);
        });
    },
    // 跳转到测试页面
    jumpTest(params) {
      console.log('params11---->', params);
      let url = '';
      if (params.type === 2) {
        url = params.url + '?id=' + params.id + '&agentId=' + this.agentId;
      } else if (params.type === 1) {
        url = process.env.VUE_APP_SERVICE_URL + '/h5-agent-business/challenge?id=' + params.id + '&agentId=' + this.agentId;
      } else if (params.type === 3) {
        url = params.url;
      }
      console.log(url);
      // 需要传图片和ID
      this.$appInterface.goToH5Page({
        urlPath: url,
        navigation: true,
      });
    },
    showResults(item) {
      console.log('item:', item);
      const params = { id: item.id };
      this.$store
        .dispatch('challenge/selectPersonOptionAnswerFinishList', params)
        .then((res) => {
          if (res.code == 200) {
            this.result.questionList = res.data;
            this.result.name = item.name;
            this.$refs.popupResults.showFortuneResults = true;
          }
        })
        .catch((err) => {
          console.log(err, '测评情况');
          this.$toast('请求错误！');
        });
    },
    showEvaluation(params) {
      console.log('showEvaluation-params:', params, this.$store.getters.gettersRecordID);
      if (params.url == "annuity") {
        this.$refs.popupAnnuity.showPopup = true;
        this.getAppResult(params.id);
      } else {
        const param = {
          id: params.id,
          agentId: this.agentId,
          baseInfoId: params.baseInfoId,
        };
        this.$store
          .dispatch('challenge/selectPersonRecordDetail', param)
          .then((res) => {
            if (res.code == 200) {
              this.getResult = res.data;
              this.getResult.name = params.name;
              this.$refs.popupEvaluation.showFortuneEvaluation = true;

              console.log(this.getResult);
            }
          })
          .catch((err) => {
            console.log(err, '测评结果');
            this.$toast('请求错误！');
          });
      }
    },
    getAppResult(recordID) {
      const param = {
        id: recordID
      };
      console.log('getAppResult-param', param);
      this.$store.dispatch('annuity/getAppPensionResult', param).then((res) => {
        console.log('getAppResult', res);
        this.getResult = res.data;
        // this.$store.commit('mutationsRecordDate', res.data);
        this.$store.dispatch('actionsRecordDate', res.data);
      });
    },
  },
};
</script>

<style scoped lang="scss">
.ParticipateIndex {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  background: rgba(247, 248, 249, 1);
  .content {
    margin-bottom: 15px;
  }
  .list {
    width: 345px;
    // height: 290px;
    margin: 0 auto;
    margin-top: 15px;
    border-radius: 8px;
    background: #ffffff;
    overflow: hidden;
    .list-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.15rem 0;
      border-bottom: 0.01rem solid #999999;
      margin-bottom: 0.25rem;
    }
    .default-text {
      font-size: 0.16rem;
      color: #999999;
    }
    .bottomContent {
      // height: 68px;
      background: #fff;
      border-radius: 0px 0px 8px 8px;
      padding-bottom: 0.3rem;
      .text {
        font-size: 15px;
        font-weight: 600;
        color: #333333;
        padding-top: 10px;
        margin-left: 15px;
      }

      .data {
        display: flex;
        margin-top: 0.3rem;
        p {
          display: flex;
          margin-left: 15px;
          align-items: center;
          img {
            width: 12px;
            height: 12px;
            margin-right: 2px;
          }
          span {
            font-size: 13px;
            color: #666666;
          }
        }
      }
      .buttonList {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 0.3rem;
        .button-answers,
        .button-evaluation {
          width: 1.6rem;
          height: 0.54rem;
          line-height: 0.54rem;
          text-align: center;
          opacity: 1;
          background: linear-gradient(315deg, #009c64, #29c38c);
          border-radius: 0.48rem;
          font-size: 0.26rem;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: center;
          color: #ffffff;
          margin-right: 0.3rem;
        }
        .button-evaluation {
          background: linear-gradient(0deg, #ff7119, #ffab30);
        }
      }
    }
    .topContent {
      display: flex;
      align-items: center;
      padding: 0.3rem;
      padding-bottom: 0;
      .textContent {
        text-align: left;
        margin-left: 0.2rem;
        .shareTime {
          font-size: 0.26rem;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #999999;
          margin-top: 0.1rem;
        }
      }
    }
    .imgContent {
      width: 2.52rem;
      height: 1.26rem;
      border-radius: 0.08rem;
      position: relative;
      overflow: hidden;
      .listImg {
        width: 2.52rem;
        height: 1.26rem;
        object-fit: cover;
        border-radius: 0.08rem;
      }
      .evaluationLabel,
      .questionnaireLabel {
        display: inline-block;
        text-align: center;
        width: 0.8rem;
        height: 0.44rem;
        line-height: 0.44rem;
        font-size: 0.26rem;
        opacity: 1;
        background: linear-gradient(0deg, #ff7119, #ffab30);
        border-radius: 0px;
        color: #ffffff;
        position: absolute;
        right: 0;
        top: 0;
      }
      .questionnaireLabel {
        background: linear-gradient(315deg, #009c64, #29c38c);
      }
    }
    .titleText {
      max-width: 4.1rem;
      height: 0.8rem;
      font-size: 0.3rem;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      color: #333333;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }

}
  .closeBox {
    top: 1%;
  }
@media (min-height: 790px) {
}
</style>
