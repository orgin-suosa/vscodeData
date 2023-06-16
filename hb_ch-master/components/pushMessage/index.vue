<template>
  <view>
    <u-modal
      class="pushModal"
      :content="contentPush"
      :show="showPush"
      showCancelButton
      cancelText="以后看看"
      confirmText="前往查看"
      @confirm="confirmPush(articleId)"
      @cancel="ccancelPush"
    ></u-modal>
  </view>
</template>

<script>
export default {
  components: {},
  computed: {},
  props: {
    pushdata: {
      type: Object,
      default() {
        return {};
      },
    },
    showpushdata: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  watch: {
    pushdata: {
      handler(newName, oldName) {
        // this.pushdata = newName;
        this.$emit('update:pushdata', newName);
        console.log('推送消息-pushdata', this.pushdata);
        this.contentPush = this.pushdata?.content || '';
        this.articleId = this.pushdata?.articleId || '';
        // var pages = getCurrentPages() // 获取栈实例
        // let currentRoute  = pages[pages.length-1].route; // 获取当前页路由
        // let currentPage = pages[pages.length-1]['$page']['fullPath'] //当前页路径(带参数)
        if (JSON.stringify(this.pushdata) === '{}') {
          this.showPush = false;
        } else {
          this.showPush = true;
        }
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    contentPush: {
      handler(newName, oldName) {
        this.contentPush = newName;
        console.log('推送消息-contentPush', newName);
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    articleId: {
      handler(newName, oldName) {
        this.articleId = newName;
        console.log('推送消息-articleId', newName);
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      showPush: false,
      contentPush: null,
      articleId: null,
    };
  },
  onLoad() {
    this.contentPush = this.pushMessage?.content || '';
    this.articleId = this.pushMessage?.articleId || '';
  },
  onUnload() {},
  methods: {
    ccancelPush() {
      this.showPush = false;
      this.$emit('confirmPush', {});
    },
    confirmPush(articleId) {
      const that = this;
      this.showPush = false;
      uni.navigateTo({
        url: '/findTools/panZhongbao/articleDetails?pageID=' + articleId,
        success(res) {
          //   that.updatePushMessage({});
          that.$emit('confirmPush', {});
        },
        fail(err) {
          that.$emit('confirmPush', {});
        },
      });
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/home/pushModal.scss';
</style>
