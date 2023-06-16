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
      </div>
      <div class="content" v-if="list.length > 0">
        <van-list v-model="loading" :finished="finished" finished-text="" @load="getPkInfoList">
          <div class="list" v-for="(item, index) in list" :key="index">
            <div class="list_top">
              <div class="result">PK结果：{{ item.pkResult === 100 ? '负' : item.pkResult === 200 ? '胜' : '旗鼓相当' }}</div>
              <div class="data">{{ item.updatedTime }}</div>
            </div>
            <div class="list_content">
              <img :src="item.headImgUrl ? item.headImgUrl : portrait_icon" alt="" />
              <ul>
                <li>{{ item.nickName }}</li>
                <li>
                  <span>
                    <b>打败人数：</b>
                    <b>{{ item.numberPeople }}%</b>
                  </span>
                  <span>
                    <b>收入：</b>
                    <b>{{ item.income }}</b>
                  </span>
                </li>
                <li>
                  <span>
                    <b>月天数：</b>
                    <b>{{ item.monthDays }}</b>
                    <b>天</b>
                  </span>
                  <span>
                    <b>工时：</b>
                    <b>{{ item.hours }}</b>
                    <b>小时/天</b>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </van-list>
      </div>
      <Ndata v-if="pkInfoTotal === 0" />
    </div>
  </div>
</template>

<script>
import portrait_icon from '@/assets/images/portrait_detail.png';
import Ndata from '@/components/ndata.vue';
export default {
  name: 'EvaluationDetail',
  components: {
    Ndata,
  },
  data() {
    return {
      pkInfoTotal: 0,
      loading: false,
      finished: false,
      isLoading: false,
      list: [],
      activeName: 'toBeActivated',
      portrait_icon: portrait_icon,
      pageList: {
        pageIndex: 1,
        pageSize: 10,
      },
    };
  },
  computed: {},
  created() {
    this.getPkInfoList();
  },
  mounted() {},
  methods: {
    // 获取秒薪详情
    getPkInfoList(data) {
      this.loading = true;
      this.finished = false;
      this.$store
        .dispatch('acquisition/getPkInfoList', this.pageList)
        .then((res) => {
          if (res.code === 200) {
            this.loading = false;
            console.log(res, 'res============>');
            this.pkInfoTotal = res.data?.total ? res.data.total : 0;
            const data = res.data?.list?.length > 0 ? res.data.list : [];
            this.list = this.list.concat(data);
            if (this.pageList.pageIndex * this.pageList.pageSize >= this.pkInfoTotal) {
              this.finished = true;
            }
            if (this.pageList.pageIndex * this.pageList.pageSize < this.pkInfoTotal) {
              this.pageList.pageIndex += 1;
            }
          }
        })
        .catch((e) => {
          console.log('查询异常', e);
          this.finished = true;
          this.loading = false;
        });
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
    p {
      padding-top: 3.3vh;
      color: #333;
      font-size: 14px;
    }
  }
  .content {
    width: 100%;
    padding-top: 8vh;
    margin-bottom: 20px;
    .list {
      width: 345px;
      height: 115px;
      margin: 0 auto;
      margin-top: 16px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0px 3px 20px 0px #f1f1f1;
      margin-bottom: 8px;
      .list_top {
        width: 100%;
        height: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .result {
          width: 120px;
          height: 20px;
          background: linear-gradient(130deg, #ffe3c2 4%, #f3ab53 96%);
          border-radius: 8px 0px 18px 0px;
          font-size: 12px;
          font-weight: 500;
          text-align: center;
          color: #89510c;
          line-height: 20px;
        }
        .data {
          padding-right: 18px;
          margin-top: 10px;
          font-size: 11px;
          font-weight: 400;
          color: #999999;
        }
      }
      .list_content {
        display: flex;
        margin-top: 15px;
        img {
          width: 44px;
          height: 44px;
          margin: 0 17px 0 10px;
          border-radius: 50%;
        }
        ul {
          li {
            font-size: 12px;
            font-weight: 400;
            color: #999999;
            line-height: 17px;
            span:nth-child(1) {
              display: inline-block;
              width: 110px;
            }
          }
          li:nth-child(1) {
            font-size: 16px;
            font-weight: 600;
            text-align: left;
            color: #333333;
            line-height: 22px;
          }
        }
      }
    }
    .list:nth-child(1) {
      margin-top: 0;
    }
  }
}
</style>
