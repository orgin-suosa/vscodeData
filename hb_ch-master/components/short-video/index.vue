<template>
  <!-- <scroll-view scroll-y="true" @scrolltolower="scrollToBottom"> -->
    <div class="container">
      <view v-for="(item,index) in shortVideoLost" :key="index">
        <view class="imgList" @click="videoItemClick(item)">
          <image :src="(item.cover_url || item.portraitUrl)"></image>
          <view class="heart">
            <u-icon name="heart" color="#fff"></u-icon>
            <view class="text">{{item.gallery_id}}</view>
          </view>
        </view>
      </view>
    </div>
  <!-- </scroll-view> -->
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      page:'',
      pageNum: 1,
      pageSize: 9,
      totalPage:'',
      shortVideoLost: []
    }
  },
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  created () {
    console.log('this.options', this.options.uid);
    this.getShortVideo()
  },
  computed: {
    ...mapState(['Config', 'userInfo']),
    scrollHeight: function () {
      let sys = uni.getSystemInfoSync();
      let winWidth = sys.windowWidth;
      let winrate = 750 / winWidth;
      let winHeight = parseInt(sys.windowHeight * winrate);
      return winHeight;
    },
  },
  methods: {
    getShortVideo () {
      uni.request({
        url: this.Config.URL.getTeacherMediaList,
        method: 'POST',
        data: {
          tidList: [this.options.uid],
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        dataType: 'json',
        success: (res) => {
          console.log(res.data.result.list, 'sssssssssssssssss');
          this.shortVideoLost = [...this.shortVideoLost, ...res.data.result.list]
          if (res?.data?.result?.list.length > 0) {
            this.$emit('showShortVideo', true)
          }
          this.totalPage = res.data.result.totalPage
          this.page = res.data.result.page
        }
      });
    },
    videoItemClick (item) {
      console.info('-video--item--', item);
      uni.navigateTo({
        url: '/ganhuo/recomvideolist/mediaPlay?media_url=' + item.media_url + '&media_name=' + item.media_name + '&media_time' + item.media_time
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 5rpx 3rpx;
  // text-align: center;
  // grid-template-rows: 100px 100px 100px;
}
.imgList {
  position: relative;
  width: 248rpx;
  height: 330rpx;
  uni-image {
    width: 100%;
    height: 100%;
  }
}
.heart {
  // display: flex;
  // align-items: center;
  position: absolute;
  bottom: 15rpx;
  left: 23rpx;
  .text {
    font-size: 22rpx;
    font-weight: 400;
    color: #ffffff;
    display: inline-block;
    vertical-align: middle;
  }
  .u-icon {
    margin-right: 15rpx;
    display: inline-block;
    vertical-align: middle;
  }
}
</style>