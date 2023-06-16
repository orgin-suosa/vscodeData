<template>
	<view class="analysis-group">
		<scroll-view scroll-x scroll-y>
			<view class="table" :style="tableStyle">
				<view class="table-header">
					<view class="title-cell">
						<view class="row">名称</view>
						<view class="column">代码</view>
					</view>
					<view class="content-cell" v-for="(item,index) in tableList.theadList" :key="item.id">
						<view class="cell">{{ item.name }}</view>
					</view>
				</view>
				<view class="table-content" :style="tableStyle">
					<view class="table-content__item" v-for="row in tableData" :key="row.id">
						<view class="title-cell f">
							<view class="cell">{{ row.name }}</view>
						</view>
						<view class="content-cell" v-for="column in tableColumn" :key="column.id">
							<view class="cell">{{ row[column.id] }}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
  components: {},
  props: {
	  tableList: {
	    type: Object,
	    default() {
	      return {};
	    },
	  },
    tableColumn: {
      type: Array,
      default() {
        return [
				{ id: 'language', name: '语文' },
				{ id: 'math', name: '数学' },
				{ id: 'english', name: '英语' },
				{ id: 'politics', name: '政治' },
				{ id: 'biology', name: '生物' },
			];
      },
    },
	 fixedTB: {
	  type: Array,
	  default() {
	    return ['宋江', '卢俊义', '吴用', '公孙胜', '关胜', '林冲', '花容', '柴进', '李逵', '宋江', '卢俊义', '吴用', '公孙胜', '关胜', '林冲', '花容', '柴进', '李逵'];
	  },
	},
  },
  data() {
    return {
		// tableColumn: [
		// 				{ id: 'language', name: '语文' },
		// 				{ id: 'math', name: '数学' },
		// 				{ id: 'english', name: '英语' },
		// 				{ id: 'politics', name: '政治' },
		// 				{ id: 'biology', name: '生物' },
		// 			],
					person: ['宋江', '卢俊义', '吴用', '公孙胜', '关胜', '林冲', '花容', '柴进', '李逵', '宋江', '卢俊义', '吴用', '公孙胜', '关胜', '林冲', '花容', '柴进', '李逵'],
					min: 60,
					max: 100,
					titleWidth: 200,
					contentWidth: 250

	};
  },
  computed: {
	  tableStyle() {
	  			const width = this.titleWidth + this.tableColumn.length * this.contentWidth;
	  			return `width: ${width}rpx`;
	  		},
	  		// tableData() {
	  		// 	const tableData = this.fixedTB.map((name, index) => {
	  		// 		const obj = this.tableColumn.reduce((result, item) => {
	  		// 			result[item.id] = Math.ceil(Math.random() * (this.max - this.min) + this.min);
	  		// 			return result;
	  		// 		}, {});
					// this.tableList.tbodyList.forEach(function (item, i, array) {
					// 	 console.log('tbodyList-----item, i, array',item, i, array);
					//   });
	  		// 		return {
	  		// 			id: String(index + 1),
	  		// 			name,
	  		// 			...obj
	  		// 		};
	  		// 	});
	  		// 	console.log("tableData:",tableData);
	  		// 	// [{"id":1,"name":"宋江","language":90,"math":69,"english":98,"politics":89,"biology":85}]
	  		// 	return tableData;
	  		// }
			tableData() {
				const tableData = this.tableList.fixedTB.map((name, index) => {
					console.log('fixedTB-----map-name, index',name, index);
					const obj = this.tableColumn.reduce((result, item) => {
						result[item.id] = Math.ceil(Math.random() * (this.max - this.min) + this.min);
						return result;
					}, {});
					this.tableList.tbodyList.forEach(function (item, i, array) {
						 console.log('tbodyList-----item, i, array',item, i, array);
					  });
					// let nameText= name.item.val;
						console.log('fixedTB-----map-name-nameText',name);
					return {
						id: String(index + 1),
						...name,
						...obj
					};
				});
				console.log("tableData:",tableData);
				// [{"id":1,"name":"宋江","language":90,"math":69,"english":98,"politics":89,"biology":85}]
				return tableData;
			}
  },
  onLoad() {},
  onUnload() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.analysis-group {
	width: 100vw;
	height: 100vh;
	scroll-view {
		width: 100vw;
		height: 100vh;
	}
}
$title-width: 200rpx;
$content-width: 250rpx;
$border-color: #E4E4E4;
$border: 1rpx solid $border-color;
$white: #FFFFFF;
$title-color: #F0F2F5;
.table {
	display: table;
	.table-header {
		// display: table-row;
		font-weight: bold;
		background-color: $title-color;
		position: sticky;
		top: 0;
		z-index: 2;
		.title-cell {
			background-image: linear-gradient(to top right, transparent 48%, $border-color, transparent 52%);
			border: $border;
			position: relative;
			position: sticky;
			left: 0;
			z-index: 1;
			.row {
				position: absolute;
				right: 10rpx;
				top: 5rpx;
			}
			.column {
				position: absolute;
				left: 10rpx;
				bottom: 5rpx;
			}
		}
		.content-cell {
			border-top: $border;
			border-bottom: $border;
			border-right: $border;
		}
	}
	.table-content {
		&__item {
			display: table-row;
			.title-cell {
				border-left: $border;
				border-right: $border;
				border-bottom: $border;
				position: sticky;
				left: 0;
				z-index: 1;
			}
			.content-cell {
				border-bottom: $border;
				border-right: $border;
			}
		}
	}
	.title-cell {
		display: table-cell;
		width: $title-width;
		background-color: $title-color;
	}
	.content-cell {
		display: table-cell;
		width: $content-width;
	}
	.cell {
		padding: 10rpx;
		line-height: 1.6;
	}
}
</style>