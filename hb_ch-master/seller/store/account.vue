<template>
	<view class="page">
		<view class="m-cells m-cells-form">
			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('店铺名称：')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :value="store_name"  />
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('店铺logo：：')}}</label></view>
				<view class="m-cell-bd" style="padding: 0;margin: 0;line-height: 1;">
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-if="store_logo">
									<view class="uni-uploader__file">
										<image class="uni-uploader__img" :data-imgindex="0" :src="store_logo" :data-src="store_logo" @click.stop="upImgs"></image>
									</view>
								</block>
								<view class="uni-uploader__input-box" v-else>
									<view class="uni-uploader__input" :data-imgindex="0" @click.stop="upImgs"></view>
								</view>
							</view>
						</view>
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('店铺横幅：')}}</label></view>
				<view class="m-cell-bd" style="padding: 0;margin: 0;line-height: 1;">
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-if="store_banner">
									<view class="uni-uploader__file" style="height:100upx">
										<image style="height:100upx" class="uni-uploader__img" :data-imgindex="1" :src="store_banner" :data-src="store_banner" @click.stop="upImgs"></image>
									</view>
								</block>
								<view class="uni-uploader__input-box" v-else>
									<view class="uni-uploader__input" :data-imgindex="1" @click.stop="upImgs"></view>
								</view>
							</view>
						</view>
				</view>
			</view>

			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('店铺电话:')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :value="store_tel" :placeholder="__('请输入店铺电话')" @input="onInputStoretel" maxlength="15" />
				</view>
			</view>

			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('所在地区：')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :value="store_area" :placeholder="__('请输入店铺所在地区')" @click="showbox" />
				</view>
			</view>

			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('店铺地址：')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :value="store_address" :placeholder="__('请输入店铺地址')" @input="onInputStoreaddress" />
				</view>
			</view>

			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('经度：')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :value="store_longitude" :placeholder="__('请输入经度')"  @input="onInputStorelongitude"/>
				</view>
			</view>

			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('纬度：')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :value="store_latitude" :placeholder="__('请输入纬度')"  @input="onInputStorelatitude" />
				</view>
			</view>

			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('QQ：')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :value="store_qq" :placeholder="__('请输入QQ')" @input="onInputStoreqq" />
				</view>
			</view>

		</view>

		<button class="u-btn u-btn-default"  @click="editStore" style="margin-top:50upx;">{{__('保存')}}</button>

		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker'
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				store_name:'',
				store_qq:'',
				store_ww:'',
				store_tel:'',
				store_banner:'',
				store_area:'',
				store_address:'',
				store_latitude:'',
				store_longitude:'',
				store_logo:'',
				storeinfo:{},

				Pindex: '',
				selectedProId: '',
				selectedCityId:'',
				selectedCountyId: '',
				selectedPro: '',
				selectedCity: '',
				selectedCounty: '',
				seladstr: '',


				cityPickerValueDefault: [0, 0, 0],
				themeColor: '#007AFF'
			}
		},



		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			var that = this;
			uni.setNavigationBarTitle({
				title:this.__('店铺设置')
			});
			that.getStoreBase()
		},

		onBackPress() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			getStoreBase: function() {
				var that = this;
				var params = {

				}
				that.$.request({
					url: that.Config.URL.seller.store,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==  200){
							that.setData({
								store_name:data.store_name,
								storeinfo:data,
								store_logo:data.store_logo,
								store_qq:data.info.store_qq,
								store_ww:data.info.store_ww,
								store_tel:data.info.store_tel,
								store_banner:data.info.store_banner,
								store_area:data.store_area,
								store_address:data.info.store_address,
								store_latitude:data.store_latitude,
								store_longitude:data.store_longitude,

							})
						}else{
							that.$.alert(msg)
						}
					}
				})
			},

			onInputStorename: function(e){
				this.setData({store_name:e.detail.value})
			},

			onInputStoretel: function(e){
				this.setData({store_tel:e.detail.value})
			},
			onInputStoreaddress: function(e){
				this.setData({store_address:e.detail.value})
			},
			onInputStorelongitude: function(e){
				this.setData({store_longitude:e.detail.value})
			},
			onInputStorelatitude: function(e){
				this.setData({store_latitude:e.detail.value})
			},
			onInputStoreqq: function(e){
				this.setData({store_qq:e.detail.value})
			},

			editStore: function() {
				var that = this;
				var params = {
					store_name:that.store_name,
					store_logo:that.store_logo,
					store_qq:that.store_qq,
					store_ww:that.store_ww,
					store_tel:that.store_tel,
					store_banner:that.store_banner,
					store_area:that.store_area,
					store_address:that.store_address,
					store_latitude:that.store_latitude,
					store_longitude:that.store_longitude,
				}
				that.$.request({
					url: that.Config.URL.seller.edit_store_info,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==  200){
							that.$.alert(that.__('修改完成'))
							that.getStoreBase()
						}else{
							that.$.alert(msg)
						}
					}
				})
			},

			//上传图片
			upImgs: function(e) {
							var that = this;
							var imgindex = e.currentTarget.dataset.imgindex
							let ukey = uni.getStorageSync('ukey');
							that.$.chooseImage({
								count: 1,
								sizeType: ["compressed"],
								success: function(n) {
									that.$.showLoading();
									var r = n.tempFilePaths;
									that.$.uploadFile({
										url: that.Config.URL.upload,
										method: "POST",
										filePath: r[0],
										name: "upfile",
										formData: {'perm_key':ukey},
			// 							header: {
			// 								"content-type": "multipart/form-data"
			// 							},
										success: function(n) {
											that.$.hideLoading();

											var up_res = that.$.parseJSON(n.data);
											var s = up_res.data.url;
											if(imgindex == 0){
												that.setData({
													store_logo: s
												})
											}else{
												that.setData({
													store_banner: s
												})
											}

										},
										fail: function(e) {
											that.$.hideLoading()
										},
										complete: function(e) {
											that.$.hideLoading()
										}
									})
								},
								fail: function(e) {
									that.$.hideLoading()
								},
								complete: function(e) {
									that.$.hideLoading()
								}
							})
						},


			//三级联动，地址选择
			showbox() {
				this.$refs.mpvueCityPicker.show()
			},

			onCancel(e) {
				//console.log(e)
			},

			onConfirm(e) {
				let that = this;
			    //console.info(e);
			    //console.info(JSON.stringify(e));
				this.pickerText = JSON.stringify(e)

			    this.setData({
			        Pindex: this.cityCode,
			        selectedProId: e.value[0],
			        selectedCityId: e.value[1],
			        selectedCountyId: e.value[2],
			        selectedPro: e.label[0],
			        selectedCity: e.label[1],
			        selectedCounty: e.label[2],
			        store_area: that.$.isNull(e.label.join("/")) ? that.__("请选择地址" ): e.label.join("/")
			    });

			},

		}
	}
</script>

<style lang="scss">
@import "../../styles/_variables";

	.m-cell-bd label {
		color: #888;
	}

	.m-cell-vcode {
		padding-top: 0;
		padding-right: 0;
		padding-bottom: 0;
	}

	.m-vcode-img {
		width: 216upx;
		height: 88upx;
	}

	.btn_box {
		padding: 20upx;
	}

	.m-code {
		right: 210upx;
	}

	.m-vcode-btn {
		width: 150upx;
		text-align: center;
	}
</style>
