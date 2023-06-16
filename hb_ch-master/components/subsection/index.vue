<template>
  <view>
    <uSubsection
      v-if="selectionList.length != 0"
      class="layout-row"
      :mode="subMode"
      :bold="subold"
      :activeColor="subActiveColor"
      :inactiveColor="subInactiveColor"
      :fontSize="subActiveColor"
      :bgColor="subBgColor"
      :list="subsectionList"
      :current="currentIndex"
      @change="changeBtnIndex"
    ></uSubsection>
  </view>
</template>

<script>
import uSubsection from '@/uni_modules/uview-ui/components/u-subsection/u-subsection.vue';
export default {
  components: { uSubsection },
  props: {
    selectionList: {
      type: Array,
      default() {
        return [];
      },
    },
    subsectionIndex: {
      type: Number,
      default() {
        return 0;
      },
    },
    subold: {
      // 是否加粗
      type: Boolean,
      default() {
        return false;
      },
    },
    subMode: {
      type: String,
      default() {
        return 'button';
      },
    },
    subActiveColor: {
      // 被选中的选项字体颜色
      type: String,
      default() {
        return '#333333';
      },
    },
    subInactiveColor: {
      // 选项字体颜色
      type: String,
      default() {
        return '#666666';
      },
    },
    subActiveColor: {
      type: String,
      default() {
        return '28rpx';
      },
    },
    subBgColor: {
      // 被选中选项下方默认"矩形"背景色
      type: String,
      default() {
        return '#F6F7FA';
      },
    },
  },
  watch: {
    selectionList: {
      handler(newName, oldName) {
        this.subsectionList = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    subsectionIndex: {
      handler(newName, oldName) {
        this.currentIndex = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      currentIndex: 0,
      subsectionList: [],
    };
  },
  onLoad() {},
  onUnload() {},
  methods: {
    init() {
      this.currentIndex = this.subsectionIndex;
      this.subsectionList = this.selectionList;
    },
    changeBtnIndex(data) {
      this.currentIndex = data;
      if (this.subsectionList.length == 0) return;
      let l = this.subsectionList.length - 1;
      if (data == 0) {
        let list = this.subsectionList.forEach(function (item, i, array) {
          if (i == 0 || i == l) {
            item.show_fg = 0;
          } else {
            item.show_fg = 1;
          }
          return array;
        });
      } else {
        let list = this.subsectionList.forEach(function (item, i, array) {
          if (i == data - 1 || i == data || i == l) {
            item.show_fg = 0;
          } else {
            item.show_fg = 1;
          }
          return array;
        });
      }
      console.log('changeBtnIndex-type:', data);
      this.$emit('changeBtnIndex', data);
    },
    changeBtnIndex2(data) {
      this.currentIndex = data;
      if (this.subsectionList.length == 0) return;
      let l = this.subsectionList.length - 1;
      if (data == 0) {
        let list = this.subsectionList.forEach(function (item, i, array) {
          if (i == 0 || i == l) {
            item.show_fg = 0;
          } else {
            item.show_fg = 1;
          }
          return array;
        });
      } else if (data == 1) {
        let list = this.subsectionList.forEach(function (item, i, array) {
          if (i == 0 || i == 1 || i == l) {
            item.show_fg = 0;
          } else {
            item.show_fg = 1;
          }
          return array;
        });
      } else if (data == 2) {
        let list = this.subsectionList.forEach(function (item, i, array) {
          if (i == 1 || i == 2 || i == l) {
            item.show_fg = 0;
          } else {
            item.show_fg = 1;
          }
          return array;
        });
      } else if (data == 3) {
        let list = this.subsectionList.forEach(function (item, i, array) {
          if (i == 2 || i == 3 || i == l) {
            item.show_fg = 0;
          } else {
            item.show_fg = 1;
          }
          return array;
        });
      }
      console.log('changeBtnIndex-type:', data);
      this.$emit('changeBtnIndex', data);
    },
  },
};
</script>

<style lang="scss">
/deep/ .u-line {
  height: 40rpx;
}
</style>
