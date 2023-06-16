<template>
  <view v-if="popupVisible" class="popup-footer">
    <view class="pop__ui_panel">
      <view class="pop__ui_mask" @tap="close"></view>
      <view class="pop__ui_child anim-footer">
        <text class="pop__ui_head">{{ sprintf(__('共%i件商品'), cartList.length) }}</text>
        <image @tap="close" style="width: 60upx; height: 60upx; position: absolute; top: 12upx; z-index: 1007; right: 12upx" src="https://qnsp.zcskjy.com/zc_images/images/false.png" />
        <view class="pop__ui_body">
          <scroll-view class="wrap_carts" scroll-y="true">
            <block v-for="(item, index) in cartList" :key="index">
              <view class="item">
                <image class="gpic" :src="item.product_image" mode="aspectFill" /><view class="ginfo"
                  ><text class="name">{{ item.product_item_name }}</text
                  ><text class="price">{{ sprintf(__('￥%.2f'), item.item_unit_price) }}</text></view
                ><text class="gbtn" @click="goToItem(item.item_id)">{{ __('去看看') }}</text>
              </view>
            </block>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return { popupVisible: false, cartList: [], winHeight: 0, winWidth: 0 };
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', '__', 'sprintf']),
  props: ['vlist'],
  created: function () {
    let that = this;
    // #ifdef MP-WEIXIN

    this.winHeight = uni.getSystemInfoSync().windowHeight;
    this.winWidth = uni.getSystemInfoSync().windowWidth;
    // #endif
  },
  methods: {
    show(index) {
      this.cartList = this.vlist[index].cart;
      this.popupVisible = true;
      this.updateHeights();
    },
    close() {
      this.popupVisible = false;
      this.updateHeight(this.winHeight, 1);
    },
    updateHeights() {
      this.$nextTick(() => {
        uni
          .createSelectorQuery()
          .in(this)
          .selectAll('.anim-footer')
          .boundingClientRect((res) => {
            var heights = 0;
            if (res.length > 0) {
              heights = res.map((item) => item.height);
            }

            console.log(heights);
            this.updateHeight(this.winHeight - heights);
          })
          .exec();
      });
    },
    updateHeight(h, t) {
      // #ifdef MP-WEIXIN
      this.$emit('confirm', h, t);
      // #endif
    },
    goToItem(item_id) {
      uni.navigateTo({
        url: '/pages/product/detail?pid=' + item_id,
      });
    },
  },
};
</script>

<style scoped>
.pop__ui_mask {
  background-color: #000;
  opacity: 0.6;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
}
.pop__ui_child {
  background-color: #fbfbfb;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  font-size: 14px;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001;
}
.pop__ui_head {
  border-style: solid;
  border-color: #ebebeb;
  border-bottom-width: 1upx;
  font-size: 28upx;
  font-weight: 700;
  padding: 30upx;
  text-align: left;
}
.wrap_carts {
  height: 650upx;
}
.item {
  flex-direction: row;
  align-items: center;
  padding: 30upx;
  position: relative;
}
.gpic {
  margin-right: 30upx;
  height: 50px;
  width: 50px;
}
.ginfo {
  flex: 1;
}
.name {
  font-size: 28upx;
}
.price {
  color: #ff0f33;
  font-size: 28upx;
  margin-top: 15upx;
}
.gbtn {
  background-image: linear-gradient(to right, #ff540a, #ff0f33);
  border-radius: 5upx;
  color: #fff;
  font-size: 28upx;
  padding: 12upx 25upx;
}
</style>
