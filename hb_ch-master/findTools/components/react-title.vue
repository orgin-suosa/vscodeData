<template>
  <view class="react-title"> 
  <view class="receiveBenefits">
    <image class="receiveBenefits-title" :src="reactTitle"></image>
    <view class="receiveBenefits-content">
		<view  class="makeMoney">
			<view class="makeMoney-child" v-for="(item, i) in list" :key="i">
				<view class="makeMoney-pre">{{item.pre}}</view>
				<view class="makeMoney-key"> {{item.key}}</view>
			</view>

		</view>
		
    </view>
  </view>
  </view>
</template>

<script>
export default {
  props: {
    reactTitle: {
      type: String,
      default() {
        return 'https://qnsp.zcskjy.com/zc_images/findTools/makeMoney.png';
      },
    },
	list: {
	  type: Array,
	  default() {
	    return [];
	  },
	},
	
  },
  data() {
    return {
	};
  },
  onLoad() {},
  onUnload() {},
  methods: {},
};
</script>

<style lang="scss">
@import '@/styles/findPage/react-title.scss';
</style>