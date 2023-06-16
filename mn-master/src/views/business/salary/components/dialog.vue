<template>
  <div class="dialog">
    <template v-if="loadCard">
      <div class="business-card">
        <div class="icon">
          <img src="@/assets/images/delete.png" alt="" @click="onClose" />
          <p></p>
        </div>
        <div v-if="checked && showCard" class="card-box">
          <business-card v-if="isTourist" :agent-info="agentInfo" @checkBusinessaCard="checkBusinessaCard" />
          <tourist-business-card v-else />
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import businessCard from './business-card';
import touristBusinessCard from './tourist-business-card';
export default {
  name: 'Dialog',
  components: {
    businessCard,
    touristBusinessCard,
  },
  data() {
    return {
      loadCard: false,
      isTourist: true, // 是否为登录状态
      checked: true, // 名片默认展示,
      showCard: true, // 早报详情页名片是否展示
      agentInfo: {},
      cardStyle: '',
    };
  },
  created() {
    this.getBusinessCard();
  },
  mounted() {},
  methods: {
    // 获取名片信息
    getBusinessCard() {
      const parm = {
        userId: this.$route.query.agentId, // 微信内agentId
      };
      console.log(parm, this.$route.query);
      console.log('wtSelectAgentBusinessCard=====>parm', parm);
      if (parm.userId) {
        this.$store.dispatch('acquisition/wtSelectAgentBusinessCard', parm).then((res) => {
          console.log('获取名片信息====>res', res);
          if (res.data) {
            this.loadCard = true;
            this.agentInfo = res.data;
          }
        });
      } else if (this.$appInterface.getToken()) {
        this.loadCard = true;
      }
    },
    // 点击跳转名片
    checkBusinessaCard() {
      window.location.href = process.env.VUE_APP_SERVICE_URL + '/h5-bizcard/wx/home?userId=' + this.$route.query.agentId + '&comeType=' + 3;
    },
    onClose() {
      this.$emit('onClose');
    },
  },
};
</script>
<style scoped lang="scss">
.dialog {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  position: absolute;
  left: 0;
  top: 0;
  .business-card {
    width: 345px;
    margin: 0 auto;
    margin-top: 40%;
    position: relative;
    .icon {
      width: 25px;
      height: 25px;
      position: absolute;
      right: 18px;
      top: -50px;
    }
    p {
      width: 1px;
      height: 25px;
      background: #ffffff;
      margin-left: 12px;
    }
  }
  .card-style {
    margin-top: 40%;
  }
}
</style>
