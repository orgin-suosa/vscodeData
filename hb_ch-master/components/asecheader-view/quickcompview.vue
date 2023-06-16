<template name="quickcompview">
	
	<view class="quick-content-view" style="">
		<view class="bgimage-view" style="margin:30rpx;
		height: 420rpx;width: 690rpx;position:absolute;">
			<image  mode="aspectFill" src="https://qnsp.zcskjy.com/zc_images/images/quickbgImg.png"
			style="width: 100%;height: 100%;
			border-radius:16rpx;" />
		</view>
		
		<view class="m-section-header" style="">
			<image class="m-image-img" mode="aspectFill" 
			style="width: 140rpx;height: 30rpx;" src="https://qnsp.zcskjy.com/zc_images/images/kuai.png"/>
			<navigator url="/ganhuo/quicknewspage/quicknewspage" hover-class="none">
				 <view class="m-section-more" > {{__('更多')}}</view>
			</navigator>
		</view>
		
		<view class="m-news-content" style="">
			<block v-for="(model, index) in itemsModelArr" :key="index">
				<quickcell style="" :itemmodel="model" @itemClick="goDetail"  :action="index ==0"> </quickcell>
			</block>
		</view>
	</view>	
</template>

<script>
	
	import quickcell from '@/components/add-new/quickcell.vue'
	
	export default {
		
		name: "quickcompview",
		
		components: {
			quickcell
		},
		
		data() {
			return {
				
				loadPageFlag: true,
				isClickChange:false,
				itemsModelArr:[], 
				
			}
		},
		
		created: function() {
			
			this.initPageData();
		},
		
		methods: {
		
			//跳转到详情页 
			goDetail(data) {
				uni.navigateTo({
					url: '/ganhuo/quicknewspage/quickdetail?linkTitle='+data.linkTitle
					+'&linkUrl='+data.linkUrl+'&content='+data.content+'&time='+data.time
				});
			},
			
			initPageData: function(){
				 
			    this.loadBrandsAndProduncts(0, 0, 1, false)
			},
			
			// 请求具体的数据列表
			loadBrandsAndProduncts(index, tabType_id, pageNum, force_refresh) {
			   var params = {
						bussinessType: "0",
						tabType: "0",
						pageNum:"1",
						pageSize:"10"
				};
				var that = this;
				that.$.request({
					url: this.Config.URL.newsUrl.newslit,
					data: {},
					dataType: 'json',
					loading:false,
					success: function(data, status, msg, code) {
						if (status == 200) {	
							
						let tmp = data.result.list;
						console.log('--back--newslist--0--',tmp.length);
						let ary = tmp.slice(0,2);
						that.setData({
							itemsModelArr: ary
						})
					} else {
						that.$.confirm(msg)
					}
				  }
				});		
			},
		}
	}

</script>

<style lang="scss" scoped>
	
	.quick-content-view{
		
		background-color:#FFFFFF;
		width: 750rpx;
		height: 480rpx;
		position: relative;
		// width: 690rpx;
		// height: 440rpx;
		// padding: 30rpx;
		
		.m-section-header{
			height: 90rpx;
			width: 640rpx;
		    display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			margin: 10rpx 30rpx 0rpx;
			position: absolute;
			left: 30rpx;
			top: 20rpx;
			 
			.m-section-more{
				height: 60rpx;
				width: 200rpx;
				line-height:60rpx;
				font-size: 24rpx;
				text-align: right;
				color:#999999;
				// background-color: #0077AA;
			}
			
			.m-section-title{
				line-height:50rpx;
				font-size: 36rpx;
				font-weight:bold;
				color:#333333;
				text-align:left;
				width: 250rpx;
				margin-right: 250rpx;
			} 
		}
		
		.m-news-content{
			// height:auto;
			// margin-top: 20rpx;
			width: 690rpx;
			height: 350rpx;
			position: absolute;
			left: 30rpx;
			top: 100rpx;
		}
		
		
	}
	

</style>
