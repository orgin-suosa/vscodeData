<template>
	<view class="">
		<view class="spreadDetail">
			<tableData  :tableList="relativeStockUpInfo"/>
		</view>
	</view>
</template>

<script>
	import tableData from '@/ganhuo/components/selfStockTable.vue';
	export default{
		components:{tableData},
		props:{
			tableList:{
				type:Object,
				default(){
					return {}
				}
			},
			showDownData:{
				type:Boolean,
				default:false
			},
			Uptotal:{
				type:Number,
				default:0
			},
			Downtotal:{
				type:Number,
				default:0
			},
			list:{
				type:Object,
				default(){
					return {}
				}
			}
		},
		data(){
			return{
				relativeStockUpInfo: {
				  theadList: [
				    {
				      id: 'nameCode',
				      name: '时间',
				    },
				    {
				      name: '详细信息',
				      id: 'totalScore',
				    },
				    {
				      name: '价格',
				      id: 'totalCheckItems',
				    },
				    {
				      name: '涨跌幅',
				      id: 'safetyItems',
				    },
				    {
				      name: '成交量(手)',
				      id: 'riskItems',
				    },
				  ],
					fixedTB: [
				    {
				      nameCode: {
				        val: '--',
				        // val2: '--',
				        type: 'normal',
				        icon: '',
				        val2Color: '#999999',
				      },
				      totalScore: {
				        val: '--',
				        type: 'normal',
				        fontColor: '#FF3A3C',
				      },
				      totalCheckItems: {
				        val: '--',
				        type: 'normal',
						fontColor: '#FF3A3C',
				      },
				      safetyItems: {
				        val: '--',
				        type: 'normal',
						fontColor: '#FF3A3C',
				      },
				      riskItems: {
				        val: '--',
				        type: 'normal',
				        fontColor: '#999999',
				      },
				    },
				  ],
				},
			}
		},
		watch:{
			list:{
				handler(newName, oldName){
					this.list = newName
					this.getStockList()
				},
				deep: true,
				immediate: true,
			}
		},
		created() {
			console.log('==============',this.list.list);
			this.$FT.clearArr(this.relativeStockUpInfo.fixedTB);
			this.getStockList()
		},
		methods:{
			getStockList(){
				let scoreC;
				let scoreColor;
				if(this.list.type == 1){
					scoreC = '#FF3A3C'
				}else{
					scoreC = '#00A846'
				}
				this.$FT.clearArr(this.relativeStockUpInfo.fixedTB);
				console.log('===============',this.list);
				this.list.list.forEach(item => {
				  if(item.index.indexOf('-') !== -1){
					  scoreColor = '#00A846'
				  }else{
					  scoreColor = '#FF3A3C'
				  }
				  this.relativeStockUpInfo.fixedTB.push({
					nameCode: {
					  val: item.time,
					  val2: '',
					  type: 'normal',
					  icon:'创',
					  market: Number(item.market),
					  fontColor: '#999999',
					},
					totalScore: {
					  val: item.detailCount.indexOf('%') !== -1 ? item.detailCount : item.detailCount + '手',
					  type: 'normal',
					  fontColor: scoreC,
					},
					totalCheckItems: {
					  val: item.price,
					  type: 'normal',
					  fontColor: scoreColor,
					},
					safetyItems: {
					  val: item.index + '%',
					  type: 'normal',
					  fontColor: scoreColor,
					},
					riskItems: {
					  val: item.turnover,
					  type: 'normal',
					  fontColor: '#999999',
					},
				  });
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
	.raiseUnusual{
		height: 60rpx;
		line-height: 60rpx;
		background: #FFF5F5;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FF3A3C;
		margin-top: 27rpx;
	}
	.showDownUnusual{
		background-color: #E9FFF2;
		color: #00A846;
	}
	.tableData{
		margin-top: 21rpx;
		margin-left: 30rpx;
		font-size: 26rpx;
		font-weight: 400;
		color: #999999;
	}
	.dividedDetail{
		font-size: 26rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		margin-top: 20rpx;
		margin-bottom: 10rpx;
	}
</style>