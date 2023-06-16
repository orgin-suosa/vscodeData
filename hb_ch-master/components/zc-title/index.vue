<template>
  <view>
    <view :class="['zc-nav-bar', { 'zc-nav-bar--fixed': fixed }]" :style="{ paddingTop: top }">
      <view class="zc-nav-bar__left" @touchstart="onClickLeft">
		<u-icon name="arrow-left" color="#333333" size="20"></u-icon>
        <span class="zc-nav-bar__text">{{ leftText }}</span>
      </view>
      <view class="zc-nav-bar__title zc-ellipsis">
        {{ title }}
      </view>
      <view class="zc-nav-bar__right" @click="onClickRight">
        <slot name="right">
          <!-- <span class="zc-nav-bar__text">{{ rightText }}</span> -->
        </slot>
      </view>
    </view>
    <view v-if="placeholder" class="zc-nav-bar__placeholder" :style="{ marginTop: top }" />
  </view>
</template>

<script>
export default {
  name: 'ZCTitle',
  components: {},
  props: {
    fixed: {
      // 固定到顶部时
      type: Boolean,
      default: true,
    },
    top: {
      type: String,
      default: '10px',
    },
    placeholder: {
      // 固定到顶部时, 有个占位的高度
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '',
    },

    leftText: {
      type: String,
      default: '',
    },
    rightText: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  methods: {
    onClickLeft(event) {
      this.$emit('click-left', event);
    },

    onClickRight(event) {
      this.$emit('click-right', event);
    },
  },
};
</script>

<style lang="scss" scoped>
.zc-nav-bar {
  position: relative;
  display: flex;
  align-items: center;
  height: 44px;
  text-align: center;
  background-color: #ffffff;
  user-select: none;
  z-index: 9;
  padding-top:var(--status-bar-height);
  &__placeholder {
    height: 44px;
  }
  &__title {
    max-width: 60%;
    margin: 0 auto;
    font-weight: 500;
    font-size: 16px;
  }
  &--fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    transform: translateZ(0);
  }
  &__left,
  &__right {
    display: flex;
    align-items: center;
    font-size: 18px;
    cursor: pointer;
    text-align: center;
    height: 50px;
    &:active {
      opacity: 0.7;
    }
  }

  &__left {
    padding-left: 15px;
    padding-right: 15px;
    position: absolute;
    left: 0;
  }

  &__right {
    width: 20px;
    height: 23px;
    margin-right: 15px;
    position: absolute;
    right: 0;
  }

  &__text {
    color: #0f1c34;
  }
}
</style>
