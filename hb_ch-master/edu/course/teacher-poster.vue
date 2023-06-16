<template>
  <view class="teacher-page">
    <view class="teacher-page-title-label">
      <text style="color: #FFFFFF;font-size: 60rpx">1对1进为您解答服务</text>
      <text style="color: #FFFFFF;font-size: 40rpx">请联系您的专属管家</text>
    </view>
    <view class="image-box">
      <view style="background-image: url('https://qnsp.zcskjy.com/zc_images/edu_pic/edu_22.png'); background-repeat: center no-repeat;width: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px; background-origin: content-box; background-size: 101%;">
        <view style="text-align: center;padding: 40rpx 0">
          <view >
            <img style="width: 50px;height: 50px;border-radius: 50%" :src="teacher.user_avatar"/>
          </view>
          <view style="font-size: 16px;font-weight: 600;">{{teacher.user_nickname}}</view>
        </view>
      </view>
      <view style="padding: 40rpx 0;width:100%;height:580rpx;background:#fff;border-bottom-right-radius: 10rpx;border-bottom-left-radius: 10rpx;">
        <view style="text-align: center;padding-top: 40rpx">
          <img style="width: 140px;height: 140px;" :src="teacher.qrcode"/>
        </view>
        <view style="font-size:26rpx;display: flex;flex-direction: column;align-items: center;color: #666666;padding: 40rpx 0">
          <text>长按识别二维码</text>
          <text>添加专属管家进行联系</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'
export default {
  name: "teacher-poster",
  components: {},
  data() {
    return {
      teacher:{},
    }
  },
  onLoad: function(options) {
    let user_id = options.user_id;
    let product_id = options.product_id;
    this.getTeacherQrcode(user_id,product_id)
  },
  computed: {
    ...mapState(['Config']),
  },
  methods: {
    getTeacherQrcode(user_id,product_id){
      let that = this
      that.$.request({
        url: that.Config.URL.edu.getTeacherQrcode,
        data: {
          user_id: user_id,
          product_id: product_id,
        },
        success: function(data, status) {
          if (status === 200 ) {
            that.teacher = data
            console.log("更新结果",data)
          }
        }
      })
    },
  }
};
</script>

<style>
  page {
    background-color: #fff !important;
    font-family: PingFangSC-Medium, PingFang SC;
    padding-bottom: 200rpx;
  }
  .teacher-page{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 70rpx 150rpx;
	background: #FFFFFF linear-gradient(181deg, #FF6161 0%, #FFBB66 100%);
  }
  .teacher-page-title-label{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 100rpx 0;
  }
  .teacher-page .image-box{
    position: relative;
    width: 560rpx;
    height: 860rpx;
    border-radius: 10rpx;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

</style>