<template>
  <view class="playingNewShares">
	<view v-if="subsectionIndex == 0">
		<reactTitle :reactTitle="makeMoney" :list="reactTitleList"></reactTitle>
		<moveTable :tableList="tableList" :tableColumn="tableList.theadList"></moveTable>
	</view>
	<view v-if="subsectionIndex == 1">
		<stockDetails :stockDetailList="stockDetailList"></stockDetails>
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
					  isNewStock:false,
					  stockName:'腾亚精工',
					  iconStock:'创',
					  stockCode:'301125',
					  isYetAdd:false,
					  purchasePrice:'33.89元',// 申购价
					  PE:'42.94 > 33.42',
					  purchaseLimit:'5000股',// 申购上限
					  doPurchase:'18.50万',// 顶格申购
				  },
				  {
					  isNewStock:true,
					  stockName:'腾亚精工',
					  iconStock:'创',
					  stockCode:'301125',
					  isYetAdd:false,
					  purchasePrice:'33.89元',// 申购价
					  PE:'42.94 > 33.42',
					  purchaseLimit:'5000股',// 申购上限
					  doPurchase:'18.50万',// 顶格申购
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
		}
	};
  },
  onLoad() {},
  onUnload() {},
  methods: {},
};
</script>

<style lang="scss"></style>