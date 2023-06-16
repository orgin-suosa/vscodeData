<template>
  <div class="business">
    <div v-if="isLoading" class="customer-list__loading">
      <van-loading size="24px" vertical color="#009c64">
        加载中...
      </van-loading>
    </div>
    <div v-else>
      <div class="content" v-if="list.length > 0">
        <van-list v-model="loading" :finished="finished" finished-text="" @load="getExhibitionList">
          <div class="list" v-for="(item, index) in list" :key="index" @click="jumpTest(item)">
            <img :src="item.listImg" alt="" />
            <div class="content">
              <p class="text">{{ item.name }}</p>
              <div class="data">
                <p>
                  <!-- <img src="@/assets/images/business_look.png" alt="" /> -->
                  <span><span class="dataNum">{{ item.browseCount | convertNum }}</span>人浏览</span>
                </p>
                <p>
                  <!-- <img src="@/assets/images/business_people.png" alt="" /> -->
                  <span><span class="dataNum">{{ item.participatCount | convertNum }}</span>人参与</span>
                </p>
                <p>
                  <!-- <img src="@/assets/images/business_share.png" alt="" /> -->
                  <span><span class="dataNum">{{ item.transpondCount | convertNum }}</span>人转发</span>
                </p>
              </div>
            </div>
          </div>
        </van-list>
        <div class="bottom-button">
          <ul>
            <li @click="myShare">
              <!-- <p> -->
              <span class="text"><span class="iconShare"></span>我的分享</span><span class="numberText">{{ shareTimes }}</span>
              <!-- </p> -->
            </li>
            <li @click="myParticipate">
              <!-- <p> -->
              <span class="text"><span class="iconParticipants"></span>我的参与</span><span class="numberText">{{ NumberParticipants }}</span>
              <!-- </p> -->
            </li>
          </ul>
        </div>
      </div>
      <Ndata v-if="list.length === 0" />
    </div>
  </div>
</template>

<script>
import Ndata from '@/components/ndata.vue';
import { handleHideSkeletonRouter } from '@/skeleton/utils';
export default {
  name: 'Index',
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
    this.$gdp('acquisition_tools');
    this.height = this.$appInterface.getNavBarHeight() || '34';
    this.getExhibitionList();
    this.agentId = this.$appInterface.getCreateId() || '827195707701067776';
  },
  mounted() {},
  methods: {
    // 获取展业工具列表
    getExhibitionList() {
      this.loading = true;
      this.finished = false;
      this.$store
        .dispatch('business/getExhibitionList', this.pageList)
        .then((res) => {
          console.log('hello world');
          if (res.code === 200) {
            this.loading = false;
            this.shareTimes = res.data.shareNum;
            this.NumberParticipants = res.data.participationNum;
            const data = res.data.infoResp?.list?.length > 0 ? res.data.infoResp.list : [{}];
            this.list = this.list.concat(data);
            if (this.pageList.pageIndex * this.pageList.pageSize >= res.data.infoResp?.total) {
              this.finished = true;
            }
            if (this.pageList.pageIndex * this.pageList.pageSize < res.data.infoResp?.total) {
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
      console.log('params11---->', params, params.name);
      this.$gdp('acquisition_tools_list', {tabName: params.name});
      let url = '';
      if (params.type === 2) {
        url = params.url + '?id=' + params.id + '&agentId=' + this.agentId;
      } else if (params.type === 1) {
        url = process.env.VUE_APP_SERVICE_URL + '/h5-agent-business/evaluationTemplate?id=' + params.id + '&agentId=' + this.agentId + '&name=' + params.name;
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
    // 跳转我的分享
    myShare() {
      this.$gdp('acquisition_tools_share');
      this.$router.push({
        path: '/ShareIndex',
      });
    },
    myParticipate() {
      this.$gdp('acquisition_tools_join');
      this.$router.push({
        path: '/participateIndex',
      });
    },
  },
};
</script>

<style scoped lang="scss">
.business {
  width: 100%;
  height: 100vh;
  background: rgba(247, 248, 249, 1);
  overflow-y: scroll;
  .content {
    margin-bottom: 2rem;
  }
  .list {
    width: 345px;
    height: 244px;
    margin: 0 auto;
    margin-top: 15px;
    border-radius: 8px;

    overflow: hidden;
    img {
      width: 100%;
      height: 176px;
      border-radius: 8px 8px 0px 0px;
    }
    .content {
      height: 68px;
      background: #fff;
      border-radius: 0px 0px 8px 8px;
      font-family: PingFangSC, PingFangSC-Regular;
      .text {
        font-size: 15px;
        font-weight: 600;
        color: #333333;
        padding-top: 10px;
        margin-left: 15px;
      }
      .data {
        display: flex;
        margin-top: 9px;
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
    }
  }
  .bottom-button {
    width: 100%;
    height: 1.7rem;
    background: rgba(247, 248, 249, 1);
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    ul {
      width: 345px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      li {
        width: 3.3rem;
        height: 1.1rem;
        opacity: 1;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0px 0px 20px 0px #f1f1f1;
        display: flex;
        align-items: center;
        // justify-content: space-between;
        font-size: 0.32rem;
        font-weight: 500;
        text-align: center;
        color: #999999;
        span {
          display: inline-block;
          vertical-align: middle;
        }
        .text {
          margin-left: 0.2rem;
          margin-right: 0.3rem;
          display: flex;
          align-items: center;
        }
        .numberText {
          font-size: 0.44rem;
          font-weight: 500;
          text-align: center;
          color: #333333;
        }
        .iconShare {
          display: inline-block;
          width: 0.42rem;
          height: 0.42rem;
          margin-right: 0.2rem;
          background: url('~@/assets/images/iconShare.png') no-repeat center;
          background-size: contain;
        }
        .iconParticipants {
          display: inline-block;
          width: 0.42rem;
          height: 0.42rem;
          margin-right: 0.2rem;
          background: url('~@/assets/images/iconParticipants.png') no-repeat center;
          background-size: contain;
        }
      }
    }
  }
}
@media (min-height: 790px) {
  .business {
    .bottom-button {
      padding-bottom: 0.34rem;
    }
  }
}
</style>
