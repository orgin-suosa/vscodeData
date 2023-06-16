<template>
  <view class="">
    <view class="container">
      <image style="width: 100%;height: auto;" :src="bgc" mode="widthFix"></image>

      <view class="tips">
        <view class="">
          提示：仅作为接受服务使用!
        </view>
        <view class="">
          <u--input placeholder="请输入手机号" border="surround" :customStyle="{'padding':'0'}" v-model="phone" color="#fff"></u--input>
        </view>
      </view>
      <image style="width: 479rpx;height: 92rpx;bottom: 123rpx;position: absolute;" @click="openUrl" src="https://qnsp.zcskjy.com/zc_images/images/agree.png" mode="widthFix"></image>
    </view>

  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  components: {
    // topTitle,
  },
  data () {
    return {
      phone: '',
      token: '',
      miniUrl: '',
      bgc: `${getApp().globalData.qnUrl}/zc_images/images/CSLL.png` + this.$FT.versionKey(),
    };
  },

  computed: {
    ...mapState(['Config']),
  },
  onLoad () {
    // window.location.href = 'https://shop.zcskjy.com/mp?typeIndex=9';
    this.getUrlLink()
    // 初始化埋点
    this.addAct('initLoad')
  },

  methods: {
    goBack () {
      uni.navigateBack({
        delta: 1,
      });
    },

    getUrlLink () {
      const that = this;
      uni.request({
        // url: 'https://shop.zcskjy.com/zc-config/v1/weixin/getWxULink',
        url: that.Config.shareWeixin,
        data: {
          path: 'pages/index/llxldIndex'
        },
        success: (res) => {
          that.miniUrl = res.data.result
          // window.location.href = that.response
        }
      })
    },
    openUrl () {
      let that = this
      // 点击埋点
      that.addAct('click')
      if (!that.$FT.validatemobile(this.phone)) {
        // this.setData({
        //   isUserMobile: !1,
        // });

        uni.showToast({
          icon: 'none',
          title: that.__('请输入正确的手机号'),
        });
        return

      } else {
        let params = {
          phone: this.phone
        }
        // 调接口存手机号
        uni.request({
          url: this.Config.mobileSave,
          method: 'GET',
          data: params,
          success: (res) => {
            uni.showToast({
              icon: 'none',
              title: that.__('提交成功，请耐心等待')
            });
            this.phone = ''
          },
          fail () {

          }
        })
      }
    },
    addAct (val) {
      let that = this;
      uni.request({
        url: 'https://shop.zcskjy.com/zc-config/v1/stat/add',
        data: {
          type: 'H5',
          num: 'KS_LL_XLD',
          item: val
        },
        complete () {
          // if (val == 'click') {
          //   window.location.href = that.miniUrl
          // }
        }
      })
    }
  },
}
</script>

<style lang="scss">
.container {
  display: flex;
  width: 750rpx;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  position: relative;
}
.tips {
  position: absolute;
  bottom: 320rpx;
  left: 73rpx;
  color: #fff;
}
/deep/ .u-input__content__field-wrapper__field {
  width: 605rpx;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 10rpx;
  border: 1rpx solid #fdddc5;
  margin-top: 80rpx;
  font-size: 50rpx;
}
/deep/ .uni-input-placeholder {
  font-size: 40rpx;
  padding-left: 35rpx;
  color: #FFF3E6 !important;
}
/deep/ .uni-input-input {
  font-size: 40rpx;
  padding-left: 35rpx;
  font-weight: 600;
}
</style>
