<template>
  <div class="home-card">
    <div class="home-card-bg"></div>
    <div class="home-card-content">
      <div class="home-card-content-title">
        大量测评助您展业，快来和我一起测一测吧！
      </div>
      <div v-if="infoDetail.deputyName" :class="infoDetail.bibliographyCommon && infoDetail.bibliographyHost ? 'home-card-content-text bto' : 'home-card-content-text btm'">
        {{ infoDetail.deputyName }}
      </div>
      <div class="text1" v-if="infoDetail.templateType === 200 && infoDetail.bibliographyHost && infoDetail.bibliographyCommon">
        <p>
          <img src="@/assets/evaluationTemplate/text2.png" />
          参考文献：{{ infoDetail.bibliographyCommon }}
        </p>
        <span @click="blank">{{ infoDetail.bibliographyHost }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeCard',
  components: {},
  props: {
    infoDetail: {
      type: Object,
      default: () => {},
    },
    openId: {
      type: String,
      default: '',
    },
    templateType: {
      type: Number,
      default: 200,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  methods: {
    blank() {
      if (!this.openId) {
        this.$appInterface.goToH5Page({
          urlPath: this.infoDetail.bibliographyHost,
          navigation: true,
        });
      } else {
        window.location.href = this.infoDetail.bibliographyHost;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.home-card {
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 20px 20px 0px 0px;
  &-bg {
    position: fixed;
    right: 0;
    bottom: 125px;
    width: 249px;
    height: 179px;
    background: url('~@/assets/evaluate/evaluate_card_bg.png') no-repeat center;
    background-size: 100% 100%;
  }
  &-content {
    position: relative;
    padding: 20px 15px;
    &-title {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 24px;
      margin-bottom: 5px;
    }
    &-text {
      width: 100%;
      height: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 24px;
      border: 0;
      padding: 0;
      background-color: rgba(0, 0, 0, 0);
      white-space: pre-line;
      // padding-bottom: 1rem;
    }
  }
  .bto {
    height: calc(100vh - 9.34rem);
    overflow-y: scroll;
    // margin-bottom: 40px;
  }
  .btm {
    height: calc(100vh - 8rem);
    overflow-y: scroll;
  }
  .text1 {
    display: none;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 375px;
    height: 80px;
    background: linear-gradient(180deg, #ffffff, #d1eee4);
    padding-left: 15px;
    display: flex;
    flex-direction: column;
    p {
      font-size: 12px;
      text-align: left;
      color: #666;
      line-height: 17px;
      margin-top: 8px;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      img {
        width: 15px;
        height: 13px;
        margin-right: 4px;
      }
    }
    span {
      font-size: 12px;
      text-align: left;
      color: #666;
      line-height: 17px;
      text-decoration: underline;
    }
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
