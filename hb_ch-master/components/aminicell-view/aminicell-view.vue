
<template name="aminicell-view">
	<view class="content-view" @click="itemClick">
		<view class="left-view">
			<image class="menu-img" style=""
			 mode="aspectFill" :src="(itemmodel.img)"  />
			<view class="m-title">{{itemmodel.title}}</view>
		</view>
		<view class="right-view" v-if="buttonType !='default'">
		   <image class="m-image-img" mode="aspectFill" src="https://qnsp.zcskjy.com/zc_images/images/right-btn.png" />
		</view>
		<view class="right-view" v-if="itemmodel.buttonType =='switch'">
		  	<u-switch :class="itemmodel.state ? 'openSwitch' : 'closeSwitch'" v-model="itemmodel.state" activeColor="#5ac725" 	@change="switchChange"></u-switch>
		</view>
	</view>
	
</template>

<script>

	export default {
		name: "aminicell-view",
		props: {
			itemmodel: {
				type: Object,
				default () {
					return {
			            title: '疯狂赚外快',
			            img: 'https://qnsp.zcskjy.com/zc_images/images/cart_select.png',
						buttonType:'default',
						state:true
			        }
				},
			},
         buttonType: {
         	type: String,
         	default () {
         		return 'default'
         	},
         },
			index:1,
			
		},
		data() {
			return {
			}
		},
		created: function() {
		},
		methods: {
			switchChange(e) {
					this.$emit('switchChange');
			},
			itemClick(){
					this.$emit('itemClick');
				// this.$emit('itemClick',{index : this.index});
			},
		}
	}
</script>


<style lang="scss" scoped>

	.content-view {
      		
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  justify-content: space-between;
	  height: 99rpx;
	  margin: 10rpx 30rpx;
	  border-bottom:#F5F5F5 1rpx solid;
	  // background-color: rgba(255, 140, 151, 1);	
	  
	  .left-view{
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  justify-content: flex-start;
		  
		  .menu-img{
			padding-right: 20rpx;
			width: 40rpx;
		    height: 40rpx;
			// background-color: #0077AA;
		  }
		  .m-title{
			height:100%;
			line-height:60rpx;
			color:#333333;
			text-align:left;
			font-size: 28rpx;
			font-weight: 400;
			font-family: PingFangSC-Regular, PingFang SC;
		  }
	  }
		 
		 
	  .right-view{
		
		  height: 100%;
		  width: 60rpx;
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  justify-content: center;
		  		 
		  .m-image-img{
			height: 26rpx;
			width: 12rpx;
			// background-color: rgba(255, 140, 151, 1);
			
		  }
	  }
	}
	::v-deep .openSwitch{
		&::before{
			background-color: #5ac725;
		}
		&::after{
			height: 100%;
			right: 0;
			left: inherit;
		}
		
	}
	
</style>



