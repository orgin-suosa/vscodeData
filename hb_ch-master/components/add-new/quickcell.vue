<template name="quickcell">
	<view class="content-view"  @click="itemClick">
		
		<view class="left-view" style="">
			<!-- v-if="!action" -->
			<view class="line-view"  :class="action? 'linea-view':''"
			 ></view>
		    <view class="yuan" :class="action ? 'first': '' " ></view>
			<view class="line-view" style="height: 150rpx;"></view>
			<!-- <view class="" style="background-color:rgb(246,244,255);left: -5rpx;top: 0; position: absolute; width: 10rpx;height: 30rpx;" v-if="action" ></view> -->
		   
		</view>
		<view class="right-view">
			<view class="m-time">{{timeStr()}}</view>
			<rich-text class="m-title" :nodes="this.itemmodel.content"></rich-text>
			<!-- #ifndef APP-PLUS -->
			<!-- <view class="m-title">{{ this.itemmodel.content }}</view> -->
			<!-- <view class="m-title">{{ contentStr() }}</view> -->
			<!-- #endif -->
			
		</view>
	</view>
</template>

<script>

    import $ from "../../helpers/util";

	export default {
		name: "quickcell",
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
			// action:{ // true =>自动播放
			// 	type:Boolean,
			// 	default:false
			// },
		    
		},
		data() {
			return {
			}
		},
		created: function() {
			
			// console.log('action---',this.action);
		},
		onLoad:function(){
			
			// console.log('action---',this.action);
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
			contentStr(){
				
				if(this.itemmodel.content.indexOf('<b>') != -1){
				    var str= this.itemmodel.content.replaceAll('<b>','');
				    str= str.replaceAll('</b>','');
					str= str.replaceAll('</br>','');
					return str;
				}
				return this.itemmodel.content;
				
			}
		}
	}
</script>


<style lang="scss" scoped>

	.content-view {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  // justify-content: space-between;
	  height: 170rpx;
	  // height: auto;
	  // background-color: rgba(255, 140, 151, 1);	
	  padding: 0rpx 10rpx 0rpx 30rpx;
	  margin-right: 20rpx;
	
	  .left-view{
		  
		  width: 12rpx;
		  height: 100%;
		  display: flex;
		  flex-direction: column;
          align-items: center;
		  justify-content: space-between;
		  // background-color: #09BB07;
		  // border-left: #999999 1rpx dashed;
		   
		   .line-view{
			   // background-color:#F0AD4E; 
			   width: 1rpx;
			   height: 30rpx;
			   border-right: #E8E8E8 2rpx dashed;
		   }
		   .linea-view{
			   width: 1rpx;
			   height: 30rpx;
			   border-right: #FFFFFF 2rpx dashed;
		   }
		   
		   .tenas-view{
			   color: transparent;
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
			  // margin-bottom: 10rpx;
			  // font-weight:bold;
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

