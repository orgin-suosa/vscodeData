<template>
  <view class="playingNewShares">
	<view v-if="subsectionIndex == 0">
		<reactTitle :reactTitle="makeMoney" :list="reactTitleList"></reactTitle>
		<moveTable class="makeMoneyTable" :tableList="tableList" :tableColumn="tableList.theadList"></moveTable>
<!-- 		<view class="triangle" v-if="tableList.theadList.length>4"></view> -->
	</view>
	<view v-if="subsectionIndex == 1">
		<stockDetails :modalData="modalData" :stockDetailList="stockDetailList" @clickitem="clickitem" @reminder="reminder" @helpTip="helpTip"></stockDetails>
	</view>
	<view v-if="subsectionIndex == 2">
		<moveTable :tableList="beListed"></moveTable>
	</view>
	<view v-if="subsectionIndex == 3">
		<moveTable :tableList="newTableList"></moveTable>
	</view>
  </view>
</template>

<script>
	import reactTitle from '../react-title.vue';
	import moveTable from '../scrolTable.vue';
	import stockDetails from '../stockDetails.vue';
export default {
  components: {
	  reactTitle,
	  moveTable,
	  stockDetails
  },
  props: {
    subsectionIndex: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
		makeMoney: `${getApp().globalData.qnUrl}/zc_images/findTools/makeMoney.png`,
		stockDetailList:[
				  {
					  stockName:'腾亚精工',
					  iconStock:'创',
					  stockCode:'301125',
					  isU:false,
					  isYetAdd:false,
				  keyList:[
							{
								id:'purchasePrice',
								type:'purchasePrice',
								key:'申购价',
								val:'35.89元',
								valHelp:false,// > 50 字体标红 显示iconhelp为true
							},
							{
								id:'PE',
								type:'PE',
								key:'PE',
								val:45,// 个股
								val2:34,// 市场
								keyHelp:true,
								
							},
							{
								id:'purchaseLimit',
								type:'normal',
								key:'申购上限',
								val:'5000股'
							},
							{
								id:'doPurchase',
								type:'normal',
								key:'顶格申购',
								val:'18.50万'
							}
						],
				  },
				  {
					  stockName:'腾亚精工',
					  iconStock:'创',
					  stockCode:'301125',
					  isU:true,
					  isYetAdd:true,
					  keyList:[
							{
								id:'purchasePrice',
								type:'purchasePrice',
								key:'申购价',
								val:'55.89元',
								valHelp:false,// > 50 字体标红 显示iconhelp为true
							},
							{
								id:'PE',
								type:'PE',
								key:'PE',
								val:45,// 个股
								val2:84,// 市场
								keyHelp:false,
								
							},
							{
								id:'purchaseLimit',
								type:'normal',
								key:'申购上限',
								val:'5000股'
							},
							{
								id:'doPurchase',
								type:'normal',
								key:'顶格申购',
								val:'18.50万'
							}
						],
				  },
		],
		reactTitleList:[
			{
				pre:'100%',
				key:'当月'
			},
			{
				pre:'100%',
				key:'本季度'
			},
			{
				pre:'100%',
				key:'本年度'
			},
		],
		newTableList:{
			theadList:[
				{
					name:'名称/代码',
				   id: 'nameCode',
				},
				{
					name:'发行价/上市日',
					id:'issue'
				},
				{
					name:'最新价(元)',
					id:'newPrice'
				},
				{
					name:'首日涨跌幅',
					id:'firstDayAD'
				},
				{
					name:'是否破发',
					id:'issuePrice'
				},
				{
					name:'首日开盘价',
					id:'openingPrice'
				},
				{
					name:'首日最高价',
					id:'firstDayHigh'
				},
			],
			fixedTB:[
				 {
					nameCode: {
						val:'腾亚精工',
						val2:'301125',
						type:'normal',
						icon:'创'
					},
					issue:{
						val:'168.00',
						val2:'2020-07-18',
						type:'normal',
					},
					newPrice:{
						val:'468.00',
					},
					firstDayAD:{
						val:'90.8%',
						type:'normal',
						fontColor:'#F43D3E'
					},
					issuePrice:{
						val:'是',
					},
					openingPrice:{
						val:'5.00',
					},
					firstDayHigh:{
						val:'3.00',
					}
			},
				{
					nameCode: {
						val:'腾亚精工',
						val2:'301125',
						type:'normal',
						icon:'创'
					},
					issue:{
						val:'168.00',
						val2:'2020-07-18',
						type:'normal',
					},
					newPrice:{
						val:'468.00',
					},
					firstDayAD:{
						val:'-10.8%',
						type:'normal',
						fontColor:'#24B842'
					},
					issuePrice:{
						val:'是',
					},
					openingPrice:{
						val:'5.00',
					},
					firstDayHigh:{
						val:'3.00',
					},
				}
			]
		},
		tableList:{
			theadList:[
				{
					id: 'nameCode',
					name: '名称/代码',
				},
				{
					name:'发行价/上市日',
					id:'issue'
				},
				{
					name:'打新收益(元)',
					id:'earnings'
				},
				{
					name:'涨停数量',
					id:'hardenNumber'
				},
				{
					name:'顶配资金（万）',
					id:'maxFund'
				},
				{
					name:'打新周期（日）',
					id:'period'
				},
			],
			fixedTB:[
				{
					nameCode: {
						val:'腾亚精工',
						val2:'301125',
						type:'normal',
						icon:'创',
						// fontColor:'#999999'
					},
					issue:{
						val:'168.00',
						val2:'2020-07-18',
						type:'normal',
					},
					earnings:{
						val:'74000',
						type:'normal',
						fontColor:'#F43D3E'
					},
					hardenNumber:{
						val:'90.80%',
						val2:'首日最高',
						type:'normal',
					},
					maxFund:{
						val:'5.00',
						type:'normal',
					},
					period:{
						val:'12',
						type:'normal',
					},
				},
				{
					nameCode: {
						val:'腾亚精工',
						val2:'301125',
						type:'normal',
						icon:'创',
						val2Color:'#999999'
					},
					issue:{
						val:'168.00',
						val2:'2020-07-18',
						type:'normal',
					},
					earnings:{
						val:'74000',
						type:'normal',
						fontColor:'#F43D3E'
					},
					hardenNumber:{
						val:'90.80%',
						val2:'首日最高',
						type:'normal',
					},
					maxFund:{
						val:'5.00',
						type:'normal',
					},
					period:{
						val:'12',
						type:'normal',
					},
				}
			],
		},
		beListed:{
			theadList:[
				{
					id: 'nameCode',
					name: '名称/代码',
				},
				{
					name:'发行价/上市日',
					id:'issue'
				},
				{
					name:'中签率',
					id:'winningRate'
				},
			],
			fixedTB:[
				{
					nameCode: {
						val:'腾亚精工',
						val2:'301125',
						type:'normal',
						icon:'创',
						fontColor:'#999999'
					},
					issue:{
						val:'168.00',
						val2:'2020-07-18',
						type:'normal',
					},
					winningRate:{
					val:'0.016%',
					fontColor:'#F43D3E',
					}
				},
			]
		},
		modalData:{
			showHelp:false,
			title:'',
			helplText:''
		}
	};
  },
  watch: {
    stockDetailList: {
      handler(newName, oldName) {
        this.stockDetailList = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    reactTitleList: {
      handler(newName, oldName) {
        this.reactTitleList = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
	newTableList: {
	  handler(newName, oldName) {
	    this.newTableList = newName;
	    this.$forceUpdate();
	  },
	  deep: true,
	  immediate: true,
	},
	tableList: {
	  handler(newName, oldName) {
	    this.tableList = newName;
	    this.$forceUpdate();
	  },
	  deep: true,
	  immediate: true,
	},
	beListed: {
	  handler(newName, oldName) {
	    this.beListed = newName;
	    this.$forceUpdate();
	  },
	  deep: true,
	  immediate: true,
	},
	modalData: {
	  handler(newName, oldName) {
	    this.modalData = newName;
	    this.$forceUpdate();
	  },
	  deep: true,
	  immediate: true,
	},
  },
  onLoad() {},
  onUnload() {},
  methods: {
	  reminder(state,i){
		this.stockDetailList[i].isYetAdd = !state;
	  },
	  helpTip(id){
		  if(id == 'PE'){
			  this.modalData = {
				showHelp:true,
				title:'PE说明',
				helplText:'个股市盈率与行业市盈率对比，新股发行市盈率大幅高于行业市盈率，会有破发风险。'
			};
		  }else if(id == 'U'){
			  this.modalData = {
				showHelp:true,
				title:'带U标签说明',
				helplText:'带U标签表示新股业绩下滑会影响股价估值，注意风险。'
			};
		  }else if(id == 'purchasePrice'){
			  this.modalData = {
				showHelp:true,
				title:'申购价标红说明',
				helplText:'发行价过高会抑制上涨空间'
			};
		  }
		  console.log("helpTip-id:",id)
	  },
	  clickitem(index,isNewStock){
		  console.log("clickitem-index-isNewStock",index,isNewStock);
		  if(!isNewStock) return;
		  uni.navigateTo({
		    url: '/findTools/daXinBao/detailsNewShares?index=' + index,
		  });
	  }
  },
};
</script>

<style lang="scss">
	::v-deep .react-title{
		padding-bottom: 26rpx;
	}
	.triangle{
		position: sticky;
		right:18rpx ;
		z-index: 9;
		margin-top: 18rpx;
		&::before{
			content: "";
			position: absolute;
			top:0;
			right: 0;
			width: 0;
			height: 0;
			border-left: 10rpx solid #E7E7E7;
			border-top: 10rpx solid transparent;
			border-bottom: 10rpx solid transparent;
		}
	}
</style>