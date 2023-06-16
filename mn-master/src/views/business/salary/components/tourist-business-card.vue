<template>
  <div class="tourist-business-card" @click="toLogin">
    <img :src="require('@/assets/images/cardExpIcon.svg')" />
  </div>
</template>

<script>
export default {
  name: 'TouristBusinessCard',
  components: {},
  props: {},
  data() {
    return {};
  },
  methods: {
    toLogin() {
      this.$appInterface.jumpLogin();
    },
  },
};
</script>

<style lang="scss" scoped>
.tourist-business-card {
  width: 100%;
  img {
    width: 100%;
  }
}
</style>
