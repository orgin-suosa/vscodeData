<template>
   <view class="u-demo-block__content" >
   	<u-skeleton
   		rows="3"
   		title
   		:loading="isload"
   		avatar
   		rowsHeight="14"
   	>
   		<!-- 需要在外部多嵌套一层占位view，否则在nvue下会导致样式失效 -->
   		<view>
   			<view class="u-skeleton-slot">
   				<image
   					src="/static/uview/common/logo.png"
   					class="u-skeleton-slot__image "
   				></image>
   				<view class="u-skeleton-slot__content">
   					<u--text
   						text="利剑出鞘,一统江湖"
   						type="main"
   						size="16"
   					></u--text>
   					<u--text
   						type="tips"
   						size="14"
   						customStyle="margin-top: 5px"
   						text="众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用"
   					></u--text>
   				</view>
   			</view>
   		</view>
   	</u-skeleton>
   </view>
</template>

<script>
export default {
  components: {},
  props: {
    isload: {
      type: Boolean,
      default() {
        return false;
      },
    },
	number: {
	  type: Number,
	  default() {
	    return 1;
	  },
	},
	
  },
  watch: {
  	number: {
  		  handler(newName, oldName) {
  			this.number = newName;
  			this.$forceUpdate();
  		  },
  		  deep: true,
  		  immediate: true,
  		},
  	},
  data() {
    return {
		list:[]
	};
  },
  onLoad() {},
  onUnload() {},
  methods: {},
};
</script>

<style lang="scss">
	.u-demo-block__content{
		padding-bottom: 20upx;
	}
	/deep/ .u-skeleton__wrapper__avatar{
		width: 180upx !important;
		height: 220upx !important;;
		border-radius: 10upx;
	}
</style>