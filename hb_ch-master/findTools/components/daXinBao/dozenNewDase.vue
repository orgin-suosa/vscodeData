<template>
  <view class="playingNewShares">
	<view v-if="subsectionIndex == 0">
		<moveTable :tableList="tableList" :tableColumn="tableList.theadList" @det="det"></moveTable>
	</view>
	<view v-if="subsectionIndex == 1">
		<moveTable class="declarationFund" :tableList="beListed"  @det="det"></moveTable>
	</view>
	<view v-if="subsectionIndex == 2">
		<moveTable :tableList="newTableList"  @det="det"></moveTable>
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
		newTableList:{
			theadList:[
				{
					name:'名称/代码',
				   id: 'nameCode',
				},
				{
					name:'已获配金额',
					id:'amountAllocated'
				},
				{
					name:'日累计限购金额',
					id:'dailyAmount'
				},
			],
			fixedTB:[
				 {
					nameCode: {
						val:'腾亚精工',
						val2:'301125',
						type:'normal',
						val2Color:'#999999'						
					},
					amountAllocated:{
						val:'89.60万元',
						type:'normal',
					},
					dailyAmount:{
						val:'无限额',
					},
				}
			]
		},
		tableList:{
			theadList:[
				{
					id: 'nameCode',
					name: '简称/代码',
				},
				{
					name:'询价截止日',
					id:'inquiryDeadline'
				},
				{
					name:'涨停数量',
					id:'hardenNumber'
				},
				{
					name:'申报基金',
					id:'declarationFund'
				},
				{
					name:'获配基金',
					id:'getFund'
				},
			],
			fixedTB:[
				{
					nameCode: {
						val:'腾亚精工',
						val2:'301125',
						type:'normal',
						val2Color:'#999999'
					},
					inquiryDeadline:{
						val:'2020-07-18',
						type:'normal',
						fontColor:''
					},
					hardenNumber:{
						val:'4',
						type:'normal',
						fontColor:''
					},
					declarationFund:{
						val:'13明细 >',
						type:'normal',
						fontColor:'#F43D3E',
						isDet:true
					},
					getFund:{
						val:'13明细 >',
						type:'normal',
						fontColor:'#F43D3E',
						isDet:true
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
					name:'新股个数',
					id:'numberNewshares'
				},
				{
					name:'获配金额占净值比例',
					id:'winningRate',
					isIconHelp:true
				},
			],
			fixedTB:[
				{
					nameCode: {
						val:'腾亚精工',
						val2:'301125',
						type:'normal',
						val2Color:'#999999'
					},
					numberNewshares:{
						val:'13明细 >',
						type:'normal',
						fontColor:'#F43D3E',
						isDet:true
					},
					winningRate:{
						val:'0.016%',
						type:'normal',
						fontColor:''
					}
				},
			]
		},
	};
  },
  onLoad() {},
  onUnload() {},
  methods: {
	  det(item,row){
		  console.log("det-item",item,row)
		 if(!item.isDet) return;
		 uni.navigateTo({
		   url: '/findTools/daXinBao/detailsTable?detailsTableTitle=' +row.name +'明细',
		 });
	  },
  },
};
</script>

<style lang="scss">
	.declarationFund{
		::v-deep table.gridtable.col3{
			width: 100%;
			overflow: hidden;
				thead, tbody  {
					tr{
						width: 100%;
						td{
							width: 190rpx !important;
						}
						td:last-child{
							width: 280rpx !important;
						}
					
					}
				}
		}
	}
</style>