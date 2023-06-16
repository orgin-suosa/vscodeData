<template>
	<view class="news-edit">
		<view class="m-cell">
			<view class="m-cell-hd">内容：</view>
			<view class="m-cell-bd">
				<textarea
					class="input" 
					name="text" 
					v-model="formData.category_content" 
					placeholder-class="placeholder" 
				></textarea>
			</view>
		</view>
		<view class="m-cell">
			<view class="m-cell-hd">关键字：</view>
			<view class="m-cell-bd">
				<input 
					class="input input-1" 
					placeholder-class="placeholder" 
					type="text" 
					v-model="formData.message_keywords" 
				/>
			</view>
		</view>
		<view class="m-cell">
			<view class="m-cell-hd">分类：</view>
			<view class="m-cell-bd">
				<select name="public-choice" class="input input-1" v-model="formData.category_id" @change="getCouponSelected">
					<option value="">请选择</option>
				    <option :value="item.category_id" v-for="item in category" >{{item.category_name}}</option>                                    
				</select>
			</view>
		</view>
		<view class="m-cell">
			<view class="m-cell-hd">区域：</view>
			<view class="m-cell-bd">
				<select name="public-choice" class="input input-1" v-model="formData.message_area" @change="getCouponSelected">
					<option value="">请选择</option>
				    <option :value="item.id" v-for="item in area" >{{item.category_name}}</option>                                    
				</select>
			</view>
		</view>
		<view class="m-cell m-cell-select-before" @click="showbox">
			<view class="m-cell-hd">省/市/区：</view>
			<view class="m-cell-bd">
				<label>{{seladstr}}</label>
			</view>
		</view>
		<view class="m-cell">
			<view class="m-cell-hd">详细地址：</view>
			<view class="m-cell-bd">
				<input 
					class="input input-1" 
					placeholder-class="placeholder" 
					type="text" 
					v-model="formData.message_address" 
				/>
			</view>
		</view>
		<view class="m-cell">
			<view class="m-cell-hd">联系人：</view>
			<view class="m-cell-bd">
				<input 
					class="input input-1" 
					placeholder-class="placeholder" 
					type="text" 
					v-model="formData.message_username" 
				/>
			</view>
		</view>
		<view class="m-cell">
			<view class="m-cell-hd">手机号：</view>
			<view class="m-cell-bd">
				<input 
					class="input input-1" 
					placeholder-class="placeholder" 
					type="number" 
					v-model="formData.message_mobile" 
				/>
			</view>
		</view>
		<view class="m-cell">
		    <view class='bk_box'>
		        <view class='m-cell-hd'>图片：</view>
		        <view class='pic_box'>
		            <view class='pic_box_img'>
		                <!-- 视频 -->
		                <view  v-if="story_video" class="hjs-select-img" >
		                    <view class="uni-icon uni-icon-clear mp-clean-icon icon-cuo" @tap="delectVideo" v-if="false"></view>
		                    <video :src="story_video" class="pic_box_image" ></video>
		                    <cover-view  class='shanchu'>
		                        <label  @tap="delectVideo" class="iconfont icon-delete" style='color:#fff'></label>
		                    </cover-view>
		                </view>
		        
		                <block v-for="(item, index) in ImgList" :key="index">
		                    <view class="hjs-select-img">
		                        <image class='pic_box_image' :src='item.Url' :data-src="item.Url" @click="previewImage" mode="scaleToFill"></image>
		                        <view class='shanchu' style=''><label @tap='delImg' class="iconfont icon-delete"
		                                                              :data-id="item.SkuId" :data-index="index"
		                                                              style='color:#fff'></label>
		                        </view>
		                    </view>
		                </block>
		                <view @click='chooseVideoImage' class="hjs-select-img">
		                    <image class='pic_box_image' src='https://static.shopsuite.cn/xcxfile/appicon/img/pic_11.png'></image>
		                </view>
		            </view>
		        </view>
		    </view>
		</view>
		<button class="u-btn u-btn-default" @click="submitInfo">提交</button>
		<mpvue-city-picker 
			:themeColor="themeColor" 
			ref="mpvueCityPicker" 
			:pickerValueDefault="cityPickerValueDefault"
		  @onCancel="onCancel" 
			@onConfirm="onConfirm"
		></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'
	import {mapMutations, mapState} from 'vuex'
	var picPath = []; 
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				formData: {
					category_content: '',
					message_keywords: '',
					category_id: '',
					message_area: '',
					message_full_area: '',
					message_address: '',
					message_username: '',
					message_mobile: '',
				},
				themeColor: '#007AFF',
				cityPickerValueDefault: [0, 0, 0],
				form: {},
				story_video:"",
				ImgList: [],
				Pindex: 0,
				selectedProId: 0,
				selectedCityId: 0,
				selectedCountyId: 0,
				selectedPro: '',
				selectedCity: '',
				selectedCounty: '',
				seladstr: "请选择所属地区",
				'category' : [],
				'area' :[],
				isShow: !1,
			}
		},
		computed: mapState(['Config']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('发布信息')
			});
		
			this.GetAddressList();
		
		},
		methods: {
			onUnload() {
				if (this.$refs.mpvueCityPicker.showPicker) {
					this.$refs.mpvueCityPicker.pickerCancel()
				}
			},
			onBackPress() {
				if (this.$refs.mpvueCityPicker.showPicker) {
					this.$refs.mpvueCityPicker.pickerCancel();
					return true;
				}
			},
			onConfirm(e) {
				let that = this;
				console.info(e);
				console.info(JSON.stringify(e));
				this.pickerText = JSON.stringify(e)
				this.setData({
						Pindex: this.cityCode,
						selectedProId: e.value[0],
						selectedCityId: e.value[1],
						selectedCountyId: e.value[2],
						selectedPro: e.label[0],
						selectedCity: e.label[1],
						selectedCounty: e.label[2],
						seladstr: that.$.isNull(e.label.toString()) ? that.__("请选择地址") : e.label.toString()
				});
			},
			onCancel(e) {
				console.log(e)
			},
			GetAddressList: function() {
				var that = this;
				var params = {};
				that.setData({
					isdata: !1,
					category: [],
					area: []
				});
				that.$.request({
					url: that.Config.URL.user.serviceMessage,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status){
							if (data.items.length > 0) {
								that.addresslist = data.items;
								that.setData({
									isdata: !0,
									category: data.category,
									area: data.area
								});
							} else {
								that.setData({
									isdata: !1
								});
							}
						}
						uni.stopPullDownRefresh()
					},
				})
			},   
			submitInfo(e) {
				var that = this;
				var params = this.formData
				params.message_full_area = this.seladstr
				params.photos_area = JSON.stringify(that.ImgList)
				params.user_birthday == that.__("请选择生日日期") && (params.user_birthday = "");
				that.$.request({
					url: this.Config.URL.user.addServiceMessage,//新加提交接口，家胜
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.$.showToast({
								title: that.__("更新成功!")
							})
				
							setTimeout(function(){
								that.$.navigateBack(1)
							},2000)
						} else {
							that.$.confirm(msg);
						}
					}
				});
			},
			chooseVideoImage(){
			    let that = this;
			    uni.showActionSheet({
			        title:that.__("选择上传类型"),
			        itemList: [that.__('图片')],
			        success: (res) => {
			            console.log(res)
			            if(res.tapIndex == 0){
			              this.chooseImages()
			            } else {
			              this.chooseVideo()
			            }
			        }
			    })
			},
			UploadImg() {
			    var that = this, max_num = 9;
			
			    if (that.$.isNull(that.ImgList) || (max_num = 9 - that.ImgList.length), 0 != max_num){
						that.$.chooseImage({
								count: max_num,
								sizeType: ["compressed"],
								sourceType: ["album", "camera"],
								success: function (result) {
									for (var num = that.ImgList.length, path = result.tempFilePaths, idx = 0; idx < path.length; idx++){
										that.$.uploadFile({
											url: that.Config.URL.upload,
											method: "POST",
											filePath: path[idx],
											name: "upfile",
											formData: {user: idx + num},
											//header: {"content-type": "multipart/form-data"},
											success: function (t) {
												console.log(t), console.log(t.data);
												var a = JSON.parse(t.data);
												console.log(a);
												var s = that.$.parseJSON(t.data);
												let info = {Url:s.data.url, SkuId:1}
												picPath.push(info);
												for (var o = picPath.length - 1; 0 < o; o--)
												{
													for (var e = 0; e < o; e++)
													{
														if (picPath[e].order > picPath[e + 1].order)
														{
															var i = picPath[e];
															picPath[e] = picPath[e + 1], picPath[e + 1] = i
														}
													}
												}
												that.setData({ImgList: picPath})
											},
											fail: function (t) {
											},
											complete: function (t) {
											}
										})
									}
							},
							fail: function (t) {
							},
							complete: function (t) {
							}
			        })
			    }
			    else
			    {
			        that.$.alert(that.__("最多上传9张图片！"))
			    }
			},
			delImg(e) {
			    var that = this;
			    that.$.confirm("是否放弃上传本张图片?", function (t) {
			            if (t.confirm)
			            {
			                var a = that.ImgList, s = [];
			                for (var o in picPath = [], a)
			                {
			                    o != e.target.dataset.index && (s.push(a[o]), picPath.push(a[o]));
			                }
			                that.setData({ImgList: s})
			            }
			        },
			        !0)
			},
			chooseImages(){
			    this.UploadImg();
			
			    return;
			
			    // 上传图片
			    uni.chooseImage({
			        count: 4, //默认9
			        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			        sourceType: ['album','camera'], //从相册选择
			        success:(res)=> {
			            this.ImgList = this.ImgList.concat(res.tempFilePaths);
			
			            if(this.ImgList.length == 4) {
			                this.VideoOfImagesShow = false
			            }
			        }
			    });
			},
			// 三级联动选择
			showbox() {
				/*
				this.setData({
				    isShow: !0
				})
				*/
				this.$refs.mpvueCityPicker.show()
			},
		}
	}
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';
.input{
	font-size: 30rpx;
	color: #333333;
	line-height: 34rpx;
	border: 1rpx dashed #666;
	width: auto;
	height: 100px;
	border-radius: 5px;
	padding: 20rpx;
	&.input-1{
		height: 60rpx;
		line-height: 60rpx;
		border-style: solid;
		padding: 0 20rpx;
	}
}
.placeholder{
	line-height: 40rpx;
	font-size: 30rpx;
	color: #CCCCCC;
}
.m-cell-hd{
	width: 120rpx;
	text-align: center;
	flex-shrink: 0;
}
.m-cell{
	padding: 30rpx;
}
.m-cell-hd{
	font-size: 24rpx;
	font-weight: 400;
}
.bk_box{
	display: flex;
	.pic_box_image{
		width: 100%;
		height: 100%;
	}
	.pic_box_img{
		display: flex;
		flex-wrap: wrap;
	}
	.hjs-select-img{
		display: inline-block;
		position: relative; 
		width: 200rpx; 
		height: 200rpx;
		margin: 0 20rpx 20rpx;
	}
}
.m-select-box-msk {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 3;
	}

	.m-select-box {
		position: absolute;
		width: 100%;
		height: 300px;
		background-color: #fff;
		left: 0;
		bottom: 0;
	}

	.u-select {
		width: 100%;
		height: 300px;
		text-align: center;
	}

	.u-select .m-cell-bd {
		width: 100%;
		line-height: 50px;
		font-size: 28upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.u-select .m-cell-bd label {
		width: 100%;
	}

	.m-select-content {
		position: relative
	}
	
</style>
