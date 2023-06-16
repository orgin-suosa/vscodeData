<template name="newscell">
	<view class="content-view" @click="itemClick">
		<view class="left-view">
			<view class="m-title">{{itemmodel.title}}</view>
			<view class="m-comfrom" style="">
				{{itemmodel.source}} {{timeStr()}} 
			</view>
		</view>
		<view class="right-view">
			<image class="m-image-img" mode="aspectFill" :src="(itemmodel.img)"/>
		</view>
	</view>
</template>

<script>

    import $ from "../../helpers/util";

	export default {
		name: "newscell",
		props: {
            itemmodel: {
				type: Object,
				default () {
					return {
						id:'2204212351469663',
						time: '15:23',
                        title: '央行',
                        img: '',
                        source: '同花顺财经',
                    }
				},
			},
		},
		data() {
			return {
			}
		},
		created: function() {
		},
		methods: {
			
			itemClick(){
				// console.log('---1---',this.itemmodel.id);
				this.$emit('itemClick',{id:this.itemmodel.id});
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
	  justify-content: space-between;
	  align-items: center;
	  height: 200rpx;
	  margin: 10rpx 10rpx;
	  border-bottom: #E9E9E9 1rpx solid;
	  // background-color: rgba(255, 140, 151, 1);
	  &:last-child {
	    border-bottom: 0;
	  }
	  .left-view{
		  
		  display: flex; 
		  flex-direction: column;
		  align-items: flex-start;
		  justify-content: space-between;
		  height: 160rpx;
		  margin-right: 20rpx;
		  .m-title{
			  
			  height:80rpx;
			  line-height:40rpx;
			  font-size: 30rpx;
			  font-weight:Medium;
			  color:#333333;
			  text-align:left;
			  overflow: hidden;
			  // white-space: nowrap;
			  text-overflow: ellipsis;
		  }
		  .m-comfrom{
			
			font-size:26rpx;
		    height:40rpx;
			line-height:40rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			color:#999999;
			// background-color: #007AFF;
			width: 450rpx;
		  }
	  }
	  
	  .right-view{
		  // background-color:rgba(255, 140, 151, 1);
		  height: 160rpx;
		  width: 200rpx;
		
		  .m-image-img{
			 height: 160rpx;
			 width: 200rpx;
			 border-radius:10rpx;
		  }
	  }
	}
	
</style>
