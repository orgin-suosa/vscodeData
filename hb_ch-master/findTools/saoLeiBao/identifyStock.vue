<template>
	<view>
		<!-- 识别中的toast,loading -->
		<!-- <u-toast ref="uToast" :icon="iconUrl" v-if="showLoading"></u-toast> -->
		<!-- <loading v-if="showLoading"/> -->
		<!-- 未识别到股票 -->
		<view class="stock" v-if="noStock">
			<image src="https://qnsp.zcskjy.com/zc_images/findTools/choose.png" class="stock-img" ></image>
			<view class="stock-content">
				<view class="content">
					图片不清晰或未包含股票名称
				</view>
				<view class="">
					请重新选择
				</view>
			</view>
			<u-button shape="circle" size="normal" class="stock-btn" text="重新选择" @click="openPicture"/>
		</view>
		
		<!-- 识别结果 -->
		<view class="result" v-if="hasResult">
			<view class="result-tips">
				共识别出{{stockList.length || 0}}只股票, 若识别有误, 可至<text style="color: #F43D3E;font-weight: 600;">个股扫雷</text>中添加
			</view>
			<view class="result-checkbox">
				<checkbox-group @change="stockChange" v-model="allSelectValue">
					<label v-for="item in stockList" :key="item.stockName">
						<checkbox class="singleChoose" :checked="checkList.includes(String(item.stockName))" :value="item.stockName" color="#fff" />
						<view class="result-content">
							<view class="content-name">{{item.stockName}}</view>
							<view class="content-code">{{item.stockCode}}</view>
						</view>
					</label>
				</checkbox-group>
			</view>
			<view class="result-bottom">
				<view class="bottom-left">
					<!-- <checkbox :checked="seletedAll" color="#fff" value="cb" /> -->
					<label @click="_seletedAll">
						<checkbox class="selecte" v-if="seletedAll === false" :checked="seletedAll" color="#fff" value="cb" />
						<u-icon v-if="seletedAll" name="https://qnsp.zcskjy.com/zc_images/findTools/cancelAll.png" color="#2979ff"></u-icon>
						<text :class="seletedAll ? 'allSelect' : 'normal'">{{selectText}}</text>
					</label>
				</view>
				<view class="reload">
					<button type="default" class="result-btn" @click="clickImport">一键导入</button>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				iconUrl:'https://qnsp.zcskjy.com/zc_images/findTools/loading.png',
				selectText:'取消全选',
				checkList:[],
				seletedAll:true,
				allSelectValue:[],
				showLoading:false,
				noStock:false,
				hasResult:true,
				stockList: [],
				choose:[],
				env:2,
				newDate:''
			}
		},
		computed: {
			...mapState(['Config','userInfo','groupId'])
		},
		onLoad(options) {
			// option获取传递过来的参数
			console.log('option获取传递过来的参数',JSON.parse(options.stockList));
			this.stockList = JSON.parse(options.stockList)
			console.log(this.stockList);
			this.stockList.map(item=>{
				this.checkList.push(item.stockName)
			})
		},
		created() {
			if(this.hasResult){
				uni.setNavigationBarTitle({
					title:'识别结果'
				})
			}
		},
		mounted(){
			if(this.showLoading){
				this.loading()
			}
		},
		methods: {
			// 全选反选
			_seletedAll(){
				if(this.seletedAll){
					this.seletedAll = false
					this.selectText = '全选'
					this.checkList=[]
				}else{
					this.stockList.map(item=>{
						console.log('选中的',item);
						this.checkList.push(item.stockName)
					})
					this.selectText = '取消全选'
					this.seletedAll = true
				}
			},
			// 单选
			stockChange(e){
				console.log('单选',e.detail.value);
				this.checkList = e.detail.value
				if (this.checkList.length === this.stockList.length) {
					this.seletedAll = true
					this.selectText = '取消全选'
				}else{
					this.seletedAll = false
					this.selectText = '全选'
				}
			},
			getEnv(){
				let port = uni.getSystemInfoSync().platform;
				switch (port) {
				  case 'android':
				    this.env = 4
				    break;
				  case 'ios':
				    this.env = 3
				    break;
				  default:
				    this.env = 2
				    break;
				}
			},
			getNowTime(){
				let d = new Date()
				let y = d.getFullYear()
				let m = d.getMonth() + 1
				let dd = d.getDate()
				console.log(y,m,dd);
				this.newDate = y + '-' + m + '-' + dd
				console.log(this.newDate);
			},
			// 一键导入
			clickImport(){
				// 筛选出选中的数据
				let chooseData = this.stockList.filter((item)=>{
					return this.checkList.includes(item.stockName)
				})
				// 判断环境
				this.getEnv();
				// 获取时间
				this.getNowTime()
				chooseData.map(item1 => {
					this.choose.push(Object.assign({},item1,{
						"code":item1.stockCode,
						"name":item1.stockName,
						"channel":this.env,
						"selfDate": this.newDate,
						"codeType": 1,
						"market":item1.market,
						"extend":"扩展信息"
						}))
				})
				console.log(this.choose);
					let params = {
						"groups": [
							{
								"groupId": this.groupId,
								"codes": this.choose
							}
						],
						"userId": this.userInfo.user_id
					}
				
				uni.request({
					url:this.Config.createStock,
					method:'POST',
					data:params,
					success:(res)=> {
						console.log(res.data.code);
						this.$store.commit('changeFrom',true)
						uni.redirectTo({
							url:'/findTools/saoLeiBao/index?position=2'
						})
						// 返回2次
						// uni.navigateBack({
						// 	delta: 2
						// });
					}
				})
				console.log(this.checkList);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.singleChoose{
		position: relative;
		top: -6rpx;
	}
	/deep/ .u-toast__content--loading{
		display: flex;
	    justify-content: center;
		width: 318rpx !important;
		height: 287rpx !important;
		border-radius: 20px;
		background-color: #000;
		opacity: 0.6;
	}
	/deep/ .u-toast__content__text--loading{

			font-size: 28rpx !important;
			font-weight: 400 !important;
			color: #fff;
			margin-top: 27rpx !important;
	}
	/deep/ .u-loading-icon__spinner--circle{
		width: 96rpx !important;
		height: 96rpx !important;
	}
	.stock{
	    text-align: center;
		&-img{
			width: 198rpx;
			height: 256rpx;
			margin-top: 286rpx;
	   }
	   &-content{
		   line-height: 41px;
		   font-size: 28rpx;
		   font-family: PingFangSC-Regular, PingFang SC;
		   font-weight: 400;
		   color: #666666;
		   // margin-top: 44rpx;
	   }
	   &-btn{
		   width: 520rpx;
		   height: 90rpx;
		   background: #FA6029 linear-gradient(90deg, #FF6161 0%, #FF9661 100%);
		   color: #fff;
		   font-size: 30rpx;
		   font-weight: 500;
		   margin-top: 198rpx;
	   }
	}
	.result{
		&-tips{
			width: 100%;
			z-index: 44;
			height: 90rpx;
			line-height: 90rpx;
			background-color: #FEF5D2;
			text-align: center;
			font-size: 28rpx;
			font-weight: 400;
			color: #333333;
		}
		/deep/ .u-radio__icon-wrap .u-radio__icon-wrap--circle{
			width: 40rpx;
			height: 40rpx;
		}
		&-checkbox{
			margin-left: 30rpx;
			margin-top: 29rpx;
			/deep/ .uni-label-pointer{
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				border-bottom: 1px solid #F5F5F5
			}
		}
		&-content{
			line-height: 41rpx;
		}
		/deep/ .uni-checkbox-input-checked{
			width: 40rpx;
			height: 40rpx;
			line-height: 40rpx;
			border-radius: 50%;
			margin-right: 27rpx;
			background-color: #FB6729;
			text-align: center;
		}
		/deep/ .uni-checkbox-input{
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			margin-right: 27rpx;
		}
		.content{
			&-name{
				font-size: 34rpx;
				font-weight: 500;
				color: #333333;
			}
			&-code{
				font-size: 26rpx;
				font-weight: 500;
				color: #999999;
			}
		}
		&-bottom{
			position: fixed;
			bottom: 0;
			width: 750rpx;
			display: flex;
			align-items: center;
			padding-left: 30rpx;
			z-index: 20;
			background-color: #fff;
			padding-bottom: 15rpx;
			/deep/ .uni-label-pointer{
				display: flex;
				align-items: center;
			}
		}
		&-btn{
			display: inline-block;
			width: 280rpx;
			height: 90rpx;
			line-height: 90rpx;
			background: linear-gradient(90deg, #FF6161 0%, #FF9661 100%);
			border-radius: 45rpx;
			color: #fff;
			font-size: 32rpx;
			font-weight: 500;
		}
		.allSelect{
			font-size: 34rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #000000;
			margin-left: 27rpx;
			margin-right: 214rpx;
		}
		/deep/.u-icon__img{
			width: 40rpx !important;
			height: 40rpx !important;
			line-height: 40rpx !important;
		}
		.reload{
			width: 280rpx;
			height: 90rpx;
		}
		.normal{
			display: flex;
			align-items: center;
			font-size: 34rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #000000;
			margin-right: 280rpx;
		}
	}
</style>