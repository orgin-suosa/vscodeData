<template>
  <div class="fortune_wrapper">
    <div class="fortune_review__btn" v-if="!judgeEnvIsWechat" @click="reviewHistory()"></div>
    <div class="fortune_review_bottom">
      <div class="fortune_review_bottom__share" @click="onShare()"></div>
      <div class="fortune_review_bottom__start" @click="startReview()"></div>
    </div>
  </div>
</template>
<script>
import { shareClick } from '@/utils/wechatAuth';
import { getFirstMainId } from '@/api/fortune';
export default {
  name: 'FortuneHome',
  props: {
    wxUserInfo: {
      type: Object,
      default: () => {},
    },
    wxData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      type: 100,
      imgUrl: '',
      isGuide: false,
      id: '',
      agentId: '',
      userId: '',
    };
  },
  computed: {
    judgeEnvIsWechat() {
      return this.$appInterface.judgingIsWeChart();
    },
  },
  created() {
    this.id = this.wxData.id;
    this.agentId = this.wxData.agentId;
    console.info('wxData:', this.wxData);
    if (!this.judgeEnvIsWechat) {
      this.recordShareTime(2);
    }
  },
  methods: {
    async startReview() {
      console.log("document.title", document.title);
      this.$gdp('acquisition_tools_start_evaluation', {tabName: document.title });
      if (!this.judgeEnvIsWechat) {
        // return this.$router.replace({
        //   name: 'FortuneQuestion',
        //   query: { userId: '', agentId: this.agentId, id: this.id },
        // });
        return this.$emit('clickReview', { page: 'question', params: { userId: this.userId, agentId: this.agentId, id: this.id } });
      }
      // 微信环境未获取openid跳出重新获取
      if (!this.wxUserInfo.openid) {
        return;
      }
      const data = await this.isFirstTest({ openId: this.wxUserInfo.openid, agentId: this.agentId });
      console.log('开始测评-isFirstTest:', data);
      this.userId = data.userId;
      if (data.isFirst) {
        // this.showDialog = true;
        // 第一次填问卷,跳转报名弹框
        this.$emit('clickReview', { page: 'home', params: { isFirst: data.isFirst, userId: data.userId, agentId: this.agentId, id: this.id } });
      } else {
        // this.signUp(data.userId);
        // 填过问卷，跳转到答题页
        this.$emit('clickReview', { page: 'question', params: { userId: data.userId, agentId: this.agentId, id: this.id } });
      }
    },
    // 跳转参与情况
    reviewHistory() {
      // this.$emit('reviewHistory', { page: 'test' });
      this.$router.push({
        name: 'FortuneTest',
      });
    },
    recordShareTime(type) {
      const params = {
        agentId: this.agentId,
        openId: this.wxUserInfo.openid,
        id: this.id,
        type: type, // 浏览1，转发2
      };
      this.$store.dispatch('business/saveFrequency', params);
    },
    // 微信用户是否是第一次答题
    isFirstTest(params) {
      console.log(params, '微信用户是否是第一次答题-params');
      return new Promise((resolve, reject) => {
        getFirstMainId(params)
          .then((res) => {
            console.log(res, '微信用户第一次答题');
            resolve(res.data);
          })
          .catch((err) => {
            console.log(err, '微信用户答过题报错');
          });
      });
    },
    onShare() {
      console.log("document.title", document.title);
      this.$gdp('acquisition_tools_quick_share', {tabName: document.title });
      if (this.judgeEnvIsWechat) {
        // return (this.isGuide = true);
        return this.$emit('clickShare');
      }
      this.recordShareTime(1);
      const param = {
        title: '朋友圈财富金矿知多少',
        content: '你的朋友圈价值百万！还不赶紧挖掘一下你朋友圈里的财富金矿',
        picture: process.env.VUE_APP_OSS_URL + 'static/h5-agent-business/img/fortune.png',
        url:
          shareClick('/fortune', {
            agentId: this.agentId,
            id: this.id,
          }) || '',
      };
      console.log(param, 'onShare参数--');
      this.$appInterface.shareUrl(param);
    },
  },
};
</script>
<style lang="scss" scoped>
.fortune_wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 811px;
  overflow-y: auto;
  background: url('~@/assets/images/fortune_review.png') no-repeat;
  background-size: 100% 100%;
  .fortune_review__btn {
    position: fixed;
    top: 29px;
    right: 0;
    width: 87px;
    height: 37px;
    background: url('~@/assets/images/test_case.png') no-repeat;
    background-size: 100% 100%;
  }
  .fortune_review_bottom {
    position: fixed;
    bottom: 31px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 32px;
    box-sizing: border-box;
    &__start {
      width: 147px;
      height: 38px;
      background: url('~@/assets/images/fortune_start_review.png') no-repeat;
      background-size: 100% 100%;
    }
    &__share {
      width: 147px;
      height: 38px;
      background: url('~@/assets/images/fortune_share.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
