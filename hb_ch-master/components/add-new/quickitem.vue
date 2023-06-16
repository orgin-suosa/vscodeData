<template name="quickcell">
	<view class="content-view"  @click="itemClick">
		<view class="left-view" style="">
		    <view class="yuan" :class="action ? 'first': '' " ></view>
			<view class="line-view" ></view>
		</view>
		<view class="right-view">
			<view class="m-time">{{timeStr()}}</view>
			<rich-text class="m-title" :nodes="this.itemmodel.content"></rich-text>
		</view>
	</view>
</template>

<script>

	export default {
		name: "quickitem",
		props: {
            itemmodel: {
				type: Object,
				default () {
					return {
						id:'',
                        content: '',
                        time: '15:23',
						img:'',
						linkUrl:'',
						linkTitle:'',
                    }
				},
			},
			action:Boolean,
		},
		data() {
			return {
			}
		},
		
		methods: {
			
			itemClick(){
				// console.log('--itemClick---',this.itemmodel);
				this.$emit('itemClick',{linkTitle: this.itemmodel.linkTitle,
				linkUrl:this.itemmodel.linkUrl,content:this.itemmodel.content,time:this.itemmodel.time});
			},
			timeStr(){
				if(this.itemmodel.time !== 'null'){
					let arr = this.itemmodel.time.split(' ');
					if(arr.length == 2){
						return arr[1];
					}
				}
				return this.itemmodel.time;
			},
		}
	}
</script>


<style lang="scss" scoped>

	.content-view {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  // justify-content: space-between;
	  // height: 170rpx;
	  height: auto;
	  background-color: rgba(255, 140, 151, 1);	
	  padding: 0rpx 10rpx 0rpx 30rpx;
	  margin-right: 20rpx;
	
	  .left-view{
		  
		  width: 12rpx;
		  display: block;
		  background-color: #09BB07;
		  // border-left: #999999 1rpx dashed;
		   
		   .line-view{
			   // background-color:#F0AD4E; 
			   width: 1rpx;
			   // height: 100%;
			   flex: 1;
			   border-right: #E8E8E8 2rpx dashed;
		   }
		
		  .yuan{
			width: 9rpx;
			height: 9rpx;
			// margin-left: -4rpx;
			border-radius: 8rpx;
			background-color:#FFFFFF;
			border: #999999 1rpx solid;
		  }
		  
		  .first{
			 background-color:#FF0000;
			 border-width:#FF0000 1rpx solid;
		  }
	  }
	  
	  .right-view{
		  height: 100%;
		  margin-left: 10rpx;
		  // margin-bottom: 10rpx;
		  display: flex; 
		  padding-top: 0rpx;
		  // padding-bottom: 30rpx;
		  // margin-bottom: 40rpx;
		  flex-direction: column;
		  align-items: flex-start;
		  justify-content: flex-start;
		  // background-color: #F0AD4E;
		  // text-align: left;
		  
		  .m-time{	
			padding-top: 20rpx; 
		  	font-size:22rpx;
		    height:30rpx;
			line-height:30rpx;
			color:#888888;
			padding-bottom: 20rpx;
			// background-color: #007AFF;
		  }
		  .m-title{
			  width:100%;
			  height:80rpx;
			  line-height:40rpx;
			  font-size: 30rpx;
			  color:#333333;
			  text-align:left;
			  overflow: hidden;
			  // white-space: nowrap;
			  text-overflow: ellipsis;
			  // background-color: #0077AA;
			  // padding-bottom: 20rpx;
		  }
	    }
	}
	
</style>

