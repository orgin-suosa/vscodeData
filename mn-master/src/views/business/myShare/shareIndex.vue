<template>
  <div class="ParticipateIndex">
    <div v-if="isLoading" class="customer-list__loading">
      <van-loading size="24px" vertical color="#009c64">
        加载中...
      </van-loading>
    </div>
    <div v-else>
      <div class="content" v-if="list.length > 0">
        <van-list v-model="loading" :finished="finished" finished-text="" @load="getShareInfoList">
          <div class="list" v-for="(item, index) in list" :key="index" @click="jumpDetails(item)">
            <div class="topContent">
              <div class="imgContent">
                <img class="listImg" :src="item.listImg" alt="" />
                <p class="evaluationLabel" v-if="item.type == 2">测评</p>
                <p class="questionnaireLabel" v-if="item.type == 3">问卷</p>
              </div>

              <div class="textContent">
                <p class="titleText">{{ item.name }}</p>
                <p class="shareTime">分享时间:{{ item.createdTime }}</p>
              </div>
            </div>

            <div class="bottomContent">
              <div class="data">
                <p>
                  <!-- <img src="@/assets/images/business_look.png" alt="" /> -->
                  <span><span class="dataNum">{{ item.visitNum | convertNum }}</span>人浏览</span>
                </p>
                <p>
                  <!-- <img src="@/assets/images/business_people.png" alt="" /> -->
                  <span><span class="dataNum">{{ item.participantNum | convertNum }}</span>人参与</span>
                </p>
                <p>
                  <!-- <img src="@/assets/images/business_share.png" alt="" /> -->
                  <span><span class="dataNum">{{ item.relayNum | convertNum }}</span>人转发</span>
                </p>
              </div>
            </div>
          </div>
        </van-list>
      </div>
      <Ndata v-if="list.length === 0" />
    </div>
  </div>
</template>

<script>
import Ndata from '@/components/ndata.vue';
import { handleHideSkeletonRouter } from '@/skeleton/utils';
export default {
  name: 'IndexChild',
  components: {
    Ndata,
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
    };
  },
  computed: {},
  created() {
    this.height = this.$appInterface.getNavBarHeight() || '34';
    this.agentId = this.$appInterface.getCreateId() || '782994890127572992';
    this.getShareInfoList();
    console.log('路由：', this.$route.query);
  },
  mounted() {},
  methods: {
    // 获取分享信息列表
    getShareInfoList() {
      this.loading = true;
      this.finished = false;
      this.pageList.agentId = this.agentId;
      const params = this.pageList;
      this.$store
        .dispatch('challenge/getShareInfoList', params)
        .then((res) => {
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
    // 跳转到详情
    jumpDetails(params) {
      this.$router.push({
        path: '/participationDetails',
        query: { baseInfoId: params.baseInfoId },
      });
    },
    // back() {
    //   this.$router.back();
    // },
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
            color: #999999;
          }
          .dataNum {
            color: #666666;
            padding-right: 0.1rem;
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
      align-items: flex-start;
      justify-content: flex-start;
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
@media (min-height: 790px) {
}
</style>
