

<template name="amenuitem-view">
	<view class="content-view" @click="itemClick" style="position: relative;">
		<uni-badge v-if="showBadge" :text="badgeNum" type="red" class="badge" 
		style="background-color: #FF5E5E;position: absolute;right: 10rpx;top: 15rpx;z-index: 1;"></uni-badge>
		<image class="menu-img" style=""
		 mode="aspectFill" :src="(itemmodel.img)" />
		<view class="m-title">{{itemmodel.title}}</view>
	</view>
</template>

<script>
    
	import uniBadge from '@/components/uni-badge.vue';
	
	export default {
		name: "amenuitem-view",
		props: {
			itemmodel: {
				type: Object,
				default (){
					return {
						title: '疯狂赚外快快',
						img: 'https://qnsp.zcskjy.com/zc_images/images/cart_select.png',
					}
				},
			},
			showBadge:false,
			badgeNum: 0,
		},
		
		components: {
			uniBadge
		},
		
		data() {
			return {
			}
		},
		created: function() {
		},
		methods: {
			
			itemClick(){
				this.$emit('itemClick');

			},
		}
	}
</script>


<style lang="scss" scoped>

	.content-view {
      		
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: space-between;
	  width: 150rpx;
	  height: 140rpx;
	  // margin: 10rpx 30rpx;
	  // border-bottom:#F5F5F5 1rpx solid;
	  // background-color: rgba(255, 140, 151, 1);	
	  
	  .menu-img{
		padding-bottom: 10rpx;
		width: 90rpx;
		height: 90rpx;
	  }
	  .m-title{
		height:33rpx;
		line-height:33rpx;
		color:#333333;
		text-align:center;
		font-size: 24rpx;
		font-weight: 400;
		font-family: PingFangSC-Regular, PingFang SC;
	  }
	}
	
</style>



