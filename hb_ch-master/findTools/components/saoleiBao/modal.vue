<template>
  <view class="modal-page">
	  <u-modal
	  	:content="contentModal"
	  	:title="titleModal"
	  	:show="show"
		:closeOnClickOverlay="closeOnClickOverlay"
	  	@confirm="confirmModal"
		@close="closeModal"
		:confirmText="confirmText"
		:confirmColor="confirmColor"
	  ></u-modal>
  </view>
</template>

<script>
	/**
	*	<modal :showModal="showModal" :titleModal="titleModal" :contentModal="contentModal" :confirmText="confirmText" @confirmModal="confirmModal" @closeModal="closeModal"></modal>
	**/
export default {
  components: {},
  props: {
    showModal: {
      type: Boolean,
      default() {
        return false;
      },
    },
	titleModal: {
	  type: String,
	  default() {
	    return '';
	  },
	},
	contentModal: {
	  type: String,
	  default() {
	    return '';
	  },
	},
	confirmText: {
	  type: String,
	  default() {
	    return '确定';
	  },
	},
	confirmColor: {
	  type: String,
	  default() {
	    return '#F43D3E';
	  },
	},
  },
  watch: {
    showModal: {
      handler(newName, oldName) {
        this.show = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
	},
  data() {
    return {
		show:false,
		closeOnClickOverlay:true
	};
  },
  onLoad() {
	  this.show = this.showModal;
  },
  onUnload() {},
  methods: {
	  closeModal(){
		  this.show = false;
		  this.$emit('closeModal', this.show);
	  },
	  confirmModal(){
		this.show = false;
		this.$emit('confirmModal', this.show);
	  }
  },
};
</script>

<style lang="scss">
	.modal-page{
		::v-deep .u-popup__content{
			.u-modal__title{
				font-size: 34rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #000000;
			}
			.u-modal__content{
				text-align: center;
			}
			.u-modal__button-group__wrapper--only-confirm{
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #F43D3E;
			}
		}
	}

</style>