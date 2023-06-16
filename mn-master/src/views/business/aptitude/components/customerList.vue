<template>
  <div class="container">
    <div v-if="isLoading" class="customer-list__loading">
      <van-loading size="24px" vertical color="#009c64">
        加载中...
      </van-loading>
    </div>
    <div v-else>
      <div class="total">
        <p>
          已参与人数<span>({{ total }})</span>
        </p>
      </div>
      <div v-if="customerList.length > 0" class="customer-level-wrap">
        <van-list v-model="loading" :finished="finished" finished-text="" @load="getCustomerList">
          <customer-item v-for="(item, index) in customerList" :key="index" :info="item" :is-show-unfold="false" />
        </van-list>
      </div>
      <Ndata v-if="total === 0" />
    </div>
  </div>
</template>
<script>
import CustomerItem from './customerItem';
import Ndata from '@/components/ndata.vue';
export default {
  name: 'CustomerList',
  components: {
    CustomerItem,
    Ndata,
  },
  data() {
    return {
      activeName: 'toBeActivated',
      activatedCustomerData: [],
      barHeight: '',
      isLoading: false,
      page: {
        pageIndex: 1,
        pageSize: 10,
      },
      customerList: [],
      total: 0,
      finished: false,
      loading: false,
    };
  },
  created() {
    this.getCustomerList();
  },
  mounted() {},
  methods: {
    getCustomerList() {
      this.loading = true;
      this.finished = false;
      this.$store
        .dispatch('sexual/queryParticipation', this.page)
        .then((res) => {
          console.log(res, 'res============>');
          if (res.code === 200) {
            this.loading = false;
            this.total = res.data?.total ? res.data.total : 0;
            const data = res.data?.list?.length > 0 ? res.data.list : [];
            this.customerList = this.customerList.concat(data);
            if (this.page.pageIndex * this.page.pageSize >= this.total) {
              this.finished = true;
            }
            if (this.page.pageIndex * this.page.pageSize < this.total) {
              this.page.pageIndex += 1;
            }
          }
        })
        .catch((e) => {
          console.log('查询异常', e);
          this.finished = true;
          this.loading = false;
        });
    },
    // 返回首页
    back() {
      this.$router.back();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .van-collapse-item__content {
  height: 89vh;
  overflow-y: scroll;
}
.container {
  background: #fff;
  width: 100%;
  height: 100%;
}
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
.customer-level-wrap {
  padding-top: 8vh;
  margin-bottom: 20px;
}
</style>
