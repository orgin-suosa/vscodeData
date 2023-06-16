<template>
  <div class="evaluationDetail">
    <div v-if="isLoading" class="customer-list__loading">
      <van-loading size="24px" vertical color="#009c64">
        加载中...
      </van-loading>
    </div>
    <div v-else>
      <div class="total">
        <p>
          已参与人数<span>({{ pkInfoTotal }})</span>
        </p>
        <i v-if="pkInfoTotal > 0" class="icon_arrow" :class="!isShowRecordList ? 'rotate' : ''" @click="showRecordList"></i>
      </div>
      <div class="content" v-if="pkInfoTotal > 0 && isShowRecordList">
        <van-list v-model="loading" :finished="finished" finished-text="" @load="selectPersonRecordList">
          <div class="list" v-for="(item, index) in list" :key="index">
            <div class="list_top">
              <div class="name">{{ item.result }}</div>
              <div class="data">{{ item.updatedTime }}</div>
            </div>
            <div class="list_content">
              <img :src="item.headImgUrl ? item.headImgUrl : portrait_icon" alt="" @error="imgError(item)" />
              <div class="ul">
                <div class="li">
                  <p>{{ item.userName }}</p>
                </div>
                <div class="li phone">
                  <p class="">{{ item.mobile }}</p>
                </div>
                <div class="li" v-for="(key, childIndex) in item.keyInfos" :key="childIndex">
                  <p>关键信息：{{ key.content }}</p>
                </div>
              </div>
              <div class="right">
                <!-- <div class="li li-buttonBox">
                  <div class="li-button buttonAnswers" @click="showAnswers(item)">答题情况</div>
                  <div class="li-button buttonEvaluation" @click="showEvaluation(item)">测评结果</div>
                </div> -->
                <ul class="userButton">
                  <!-- <p class="resultsButton" @click="showAnswers(item)">
                    <span
                      >答题<br />
                      情况</span
                    >
                  </p> -->
                  <li class="resultsButton">
                    <van-image class="phone-icon" :src="require('@/assets/images/phone-icon.png')" fit="contain" @click="callCustomer(item.mobile)" />
                  </li>
                  <li class="EvaluationButton">
                    <p @click="showEvaluation(item)">
                      <span>测评 <br />结果</span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </van-list>
      </div>

      <Ndata v-if="pkInfoTotal === 0" />
    </div>
    <popup-answers :nickname="nickname" ref="popupAnswers"></popup-answers>
    <popup-evaluation :baseInfoId="baseInfoId" :agentId="agentId" :id="id" ref="popupEvaluation"></popup-evaluation>
  </div>
</template>

<script>
import portrait_icon from '@/assets/images/portrait_detail.png';
import Ndata from '@/components/ndata.vue';
import PopupAnswers from './popupAnswers';
import PopupEvaluation from './popupEvaluationResult';
export default {
  name: 'ParticipateList',
  components: {
    Ndata,
    PopupAnswers,
    PopupEvaluation,
  },
  data() {
    return {
      pkInfoTotal: 0, // 已参与人数
      loading: false,
      finished: false,
      isLoading: false,
      showComponentsAnswers: false,
      isShowRecordList: true,
      list: [],
      activeName: 'toBeActivated',
      portrait_icon: portrait_icon,
      // openId: '',
      pageList: {
        pageIndex: 1,
        pageSize: 10,
        agentId: '782994890127572992',
        baseInfoId: '833716936419311616',
        // openId: 'oi-jG5y_2FS7BDiPW-PV2nvnHlds',
      },
      agentId: '782994890127572992',
      openId: 'oi-jG5y_2FS7BDiPW-PV2nvnHlds',
      baseInfoId: '833716936419311616',
      dataAnswers: '',
      id: '834366819606200320',
      nickname: '',
    };
  },
  computed: {},
  created() {
    this.getQuery();
    this.selectPersonRecordList();
    this.pageList.baseInfoId = this.$route.query.baseInfoId ? this.$route.query.baseInfoId : '833716936419311616';
    console.info('路由参数:', this.$route.query);
    console.info('baseInfoId:', this.pageList.baseInfoId);
  },
  mounted() {},
  methods: {
    // 获取参数
    getQuery() {
      this.isWeChart = this.$appInterface.judgingIsWeChart();
      console.log(this.isWeChart, 'isWeChart'); // 判断是否是微信环境
      this.agentId = !this.isWeChart ? this.$appInterface.getCreateId() || '782994890127572992' : this.$route.query.agentId || '782994890127572992';
      this.pageList.agentId = this.agentId;
    },
    //  展业工具客户测评列表查询
    selectPersonRecordList(data) {
      this.loading = true;
      this.finished = false;
      console.log(' 展业工具客户测评列表查询入参：', this.pageList);
      this.$store
        .dispatch('character/selectPersonRecordList', this.pageList)
        .then((res) => {
          if (res.code === 200) {
            this.loading = false;
            console.log(res, 'res============>');
            this.pkInfoTotal = res.data?.total ? res.data.total : 0;
            const data = res.data?.list?.length > 0 ? res.data.list : [{}];
            this.list = this.list.concat(data);
            if (this.pageList.pageIndex * this.pageList.pageSize >= this.pkInfoTotal) {
              this.finished = true;
            }
            if (this.pageList.pageIndex * this.pageList.pageSize < this.pkInfoTotal) {
              this.pageList.pageIndex += 1;
            }
            console.log('this.list:', this.list);
          }
        })
        .catch((e) => {
          console.log('查询异常', e);
          this.finished = true;
          this.loading = false;
        });
    },

    imgError(item) {
      item.headImgUrl = portrait_icon;
    },
    showAnswers(item) {
      console.log('baseInfoId::', item, item.baseInfoId);
      this.baseInfoId = item.baseInfoId;
      this.id = item.id;
      console.log(' this.baseInfoId-this.id :', this.baseInfoId, this.id);
      this.nickname = item.nickname;
      this.$nextTick(() => {
        // this.$refs.popupAnswers.selectQuestionList('827584892031205376');
        this.$refs.popupAnswers.initCreated(item.id);
        console.log('this.agentId: item.baseInfoId, item.openId', this.agentId, item.baseInfoId, item.openId);
        // this.$refs.popupAnswers.initCreated(this.agentId, item.baseInfoId, item.openId);
        this.$refs.popupAnswers.showPopupAnswers = true;
      });
    },
    showEvaluation(item) {
      console.log('参与详情-测评结果 agentId, baseInfoId, id:', this.agentId, item.baseInfoId, item.id);
      this.$nextTick(() => {
        this.$refs.popupEvaluation.selectPersonRecordDetail('', this.agentId, item.baseInfoId, item.id);
      });

      this.$refs.popupEvaluation.showPopupEvaluationResult = true;
    },
    showRecordList() {
      this.isShowRecordList = !this.isShowRecordList;
    },
    callCustomer(phone) {
      console.log('call', phone);
      this.$appInterface.callPhone(phone);
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .van-collapse-item__content {
  height: 89vh;
  overflow-y: scroll;
}
.evaluationDetail {
  width: 100%;
  height: 100%;
  background: #fff;
  .total {
    width: 100%;
    height: 8vh;
    padding: 0 15px;
    background: #fff;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      padding-top: 3.3vh;
      color: #333;
      font-size: 14px;
    }
    .icon_arrow {
      display: inline-block;
      width: 0.4rem;
      height: 0.4rem;
      background-image: url('~@/assets/challenge/icon_arrow.png');
      background-size: 0.18rem 0.18rem;
      background-position: center;
      background-repeat: no-repeat;
      transform: rotate(180deg);
    }
    .rotate {
      transform: rotate(0deg);
    }
  }
  .info {
    padding-left: 10px;
    padding-right: 10px;
    .name {
      font-size: 16px;
      font-weight: 500;
      text-align: left;
      color: #333333;
      margin-bottom: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 220px;
    }
    .phone {
      font-size: 12px;
      color: #999999;
    }
  }
  .content {
    width: 100%;
    padding-top: 1.35rem;
    transition: transform 0.3s;
    animation: 2s;
    margin-bottom: 20px;
    .list {
      width: 345px;
      // height: 184px;
      margin: 0.32rem auto;
      margin-top: 16px;
      background: #fff;
      border-radius: 0.08rem;
      padding-bottom: 0.4rem;
      box-shadow: 0 0.03rem 0.2rem 0 #f1f1f1;
      .list_top {
        width: 100%;
        height: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name {
          background: linear-gradient(130deg, #ffe3c2 4%, #f3ab53 96%);
          border-radius: 8px 0px 18px 0px;
          font-size: 12px;
          font-weight: 500;
          text-align: center;
          color: #89510c;
          line-height: 20px;
          padding: 0 0.2rem;
          max-width: 4rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .data {
          padding-right: 18px;
          margin-top: 10px;
          font-size: 0.22rem;
          font-weight: 400;
          color: #999999;
        }
      }
      .list_content {
        display: flex;
        margin-top: 0.3rem;
        img {
          width: 0.88rem;
          height: 0.88rem;
          margin: 0 0.38rem 0 0.2rem;
          border-radius: 50%;
        }

        .ul {
          line-height: 22px;
          margin-top: 0;
          padding-right: 0.2rem;
          .li {
            font-size: 0.32rem;
            color: #333333;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            p {
              border-bottom: 1px solid #e7e7e7;
            }
          }
          .phone {
            font-size: 12px;
            color: #999999;
          }

          .li:nth-last-child(-n + 2) {
            border: 0;
          }
        }
      }
    }
    .list:nth-child(1) {
      margin-top: 0;
    }
    .right {
      position: absolute;
      right: 0.5rem;
      .userButton {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 0.38rem;

        li {
          width: 0.9rem;
          height: 0.9rem;
          line-height: 0.3rem;
          background: linear-gradient(90deg, #00dddd, #00c5cd);
          border-radius: 0.26rem;
          font-size: 0.24rem;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: center;
          color: #ffffff;
          margin-right: 0.2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .resultsButton {
          // border: 1px solid #009c64;
          // color: #009c64;
          background: transparent;
        }
        .EvaluationButton {
          background: linear-gradient(315deg, #009c64, #29c38c);
          border-radius: 50px;
          box-shadow: 0px 4px 20px 0px rgba(0, 156, 100, 0.3);
        }
      }
      .phone-icon {
        width: 0.45rem;
        height: 0.45rem;
      }
    }
  }
}
</style>
