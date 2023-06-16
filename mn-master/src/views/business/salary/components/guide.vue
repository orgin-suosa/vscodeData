<template>
  <div class="guide" @click="onHide">
    <img class="text" src="@/assets/images/guide_text.png" alt="" />
    <img class="icon" src="@/assets/images/guide_icon.png" alt="" />
  </div>
</template>

<script>
export default {
  name: "EvaluationHome",
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {
    document.querySelector("body").classList.add("guide-overflow");
  },
  mounted() {},
  beforeDestroy() {
    document.querySelector("body").classList.remove("guide-overflow");
  },
  methods: {
    onHide() {
      document.querySelector("body").classList.remove("guide-overflow");
      this.$emit("onHide");
    },
  },
};
</script>

<style scoped lang="scss">
.guide {
  width: 100%;
  // height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  .text {
    width: 131px;
    height: 16px;
    position: absolute;
    right: 88px;
    top: 70px;
  }
  .icon {
    width: 77px;
    height: 62px;
    position: absolute;
    right: 27px;
    top: 20px;
  }
}
</style>
<style lang="scss">
.guide-overflow {
  overflow: hidden;
}
</style>
