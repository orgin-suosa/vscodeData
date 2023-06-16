<template>
    <view class="page">
        <view class="m-cells m-cells-form">
			<view class="m-cell" style="display:none">
			    <view class="m-cell-hd"><label class="u-label">{{__('账号')}}</label></view>
			    <view class="m-cell-bd">
			        <input class="u-input" type="text" :placeholder="__('请输入账号')" maxlength="11" @input="inputAccount" :value="user_account"/>
			    </view>
			    <view v-if="(!isAccount)" class="m-cell-ft">
			        <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
			    </view>
			</view>

			<view class="m-cell">
			    <view class="m-cell-hd"><label class="u-label">{{__('姓名')}}</label></view>
			    <view class="m-cell-bd">
			        <input class="u-input" type="text" :placeholder="__('请输入姓名')"  :value="user_nickname" @input="onInputNickname"/>
			    </view>
			    <view v-if="(!isNickname)" class="m-cell-ft">
			        <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
			    </view>
			</view>

			<view class="m-cell">
			    <view class="m-cell-hd"><label class="u-label">{{__('手机号码')}}</label></view>
			    <view class="m-cell-bd">
			        <input class="u-input" type="number" :placeholder="__('请输入手机号码')" maxlength="11" @input="inputphone" :value="user_mobile"/>
			    </view>
			    <view v-if="(!isUserMobile)" class="m-cell-ft">
			        <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
			    </view>
			</view>

			<view class="m-cell" style="display:none">
			    <view class="m-cell-hd"><label class="u-label">{{__('密码')}}</label></view>
			    <view class="m-cell-bd">
			        <input class="u-input" type="text" password="true"  :placeholder="__('请输入登录密码')"  :value="user_password"  @input="onInputPassword"/>
			    </view>
			    <view v-if="(!isPassword)" class="m-cell-ft">
			        <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
			    </view>
			</view>



			<view class="m-cell">
			    <view class="m-cell-hd"><label class="u-label">{{__('车牌号')}}</label></view>
			    <view class="m-cell-bd">
					<input class="u-input" :placeholder="__('车牌号')" disabled="true" @tap="plateShow=true" v-model.trim="user_licenseplate"></input>
			    </view>
				<view class="m-cell-hd" style="padding-right:40upx;" @click="licenseplateImage"><label  class="iconfont icon-xiangji"></label></view>
				<view v-if="(!isLicenseplate)" class="m-cell-ft">
				    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
				</view>
			</view>

			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('常用轮胎品牌')}}</label></view>
				<view class="m-cell-bd">
					<picker @change="bindPickerChange" :value="index" :range="brands" range-key="brand_name">
						<view class="uni-input">{{brand_name?brand_name:__('请选择常用轮胎品牌')}}</view>
					</picker>
				</view>
				<view v-if="(!isTyre)" class="m-cell-ft">
				    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
				</view>
			</view>

			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('车型分类')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text"  :value="user_vehicle_name" readonly="readonly" disabled="true" :placeholder="__('请选择车型分类')" @click="showvehicle"  />
				</view>
			</view>


			<view class="btn_box"><button class="u-btn u-btn-default" @tap="submitdata">{{__('保存')}}</button></view>

        </view>
		<!-- 车牌键盘 -->
		 <plate-input v-if="plateShow" :plate="user_licenseplate" @export="setPlate" @close="plateShow=false"></plate-input>

		<!-- 车型分类 -->
		<uni-drawer :visible="rightDrawerVehicle" mode="right" @close="closeDrawer()" >
			<view class="m-tab">
					<view class="m-navbar">
						<view :class="['m-navbar-item', tapindex==1?'m-navbar-item-on':'']" @click="showvehicle">
							{{__('一级分类')}}
						</view>
						<view :class="['m-navbar-item', tapindex==2?'m-navbar-item-on':'']">
							{{__('二级分类')}}
						</view>
						<view :class="['m-navbar-item', tapindex==3?'m-navbar-item-on':'']">
							{{__('三级分类')}}
						</view>
					</view>
			</view>
			<scroll-view scroll-y="true" style="height: 100%">
			<view class="m-cells" style="padding:20upx 20upx;" v-for="(category,ii) in vehicle_category" :key="ii">
				<view class="m-cell m-cell-access m-info-sp" :data-category_id="category.vehicle_category_id" :data-parent_id="category.parent_id" :data-category_name="category.category_name"  @click="getVehiclecategory">
					<view class="m-cell-bd">
						<view  class="m-order-title">
							<label class="m-ber-n">{{category.category_name}}</label>
							<label>
								<image  class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill" />
							</label>
						</view>
					</view>
				</view>
			</view>
			</scroll-view>
		</uni-drawer>
    </view>
</template>

<script>

import { mapState, mapMutations } from 'vuex';
import verifycodeDialog from '@/components/verifycode-dialog/verifycode-dialog.vue';
import plateInput from '@/components/uni-plate-input/uni-plate-input.vue'


import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
import uniList from '@/components/uni-list/uni-list.vue'
import uniListItem from '@/components/uni-list-item/uni-list-item.vue'


export default {
    name: 'asset',
    data: function() {
        return {
				user_account: "",
				user_nickname: "",
				user_password: "",
				user_licenseplate: "",
				user_vehicle_name: "",
				user_tyre: 0,
				user_mobile: "",
				brands:[],
				brand_name:'',
				rightDrawerVehicle: false,
				index: 0,
				isCardNo: !0,
				plateNumberList:[],
				type:'number',
				parent_id:0,
				vehicle_category_id:0,
				oneVehiclecategory:'',
				twoVehiclecategory:'',
				threeVehiclecategory:'',
				n_level:0,
				vehicle_name:'',
				vehicle_category:[],
				tapindex:1,
				isPassword: !0,
				isNickname: !0,
				isAccount: !0,
				isTyre: !0,
				isLicenseplate: !0,
				isUserMobile: !0,
				plateNo:'',
				plateShow:false
        };
    },
		components: {
			verifycodeDialog,
			uniDrawer,
			uniList,
			uniListItem,
			plateInput
		},
    computed: mapState([
        'Config',
        'StateCode',
        'notice',
        'plantformInfo',
        'shopInfo',
        'userInfo',
        'hasLogin'
    ]),
    onLoad: function(options) {
        var that = this;
        // this.Phone = this.userInfo.user_mobile;

		// this.user_data = Object.assign({}, this.userInfo);
		
		uni.setNavigationBarTitle({
			title:this.__('新增会员')
		});

		this.getbrand();


    },

    methods: {
        ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

		//车牌号输入

		 setPlate(plate){
		     if(plate.length >= 7) this.user_licenseplate = plate
			 this.islLicenseplate = !0
		     this.plateShow = false
		 },


		bindPickerChange: function(e) {
			let that = this;
			var r = e.target.value
			this.brand_name = that.brands[r].brand_name
			that.user_tyre = that.brands[r].brand_id

		},


		getbrand: function() {
			let that = this;
			var params = {
				category_id: 116
			}
			that.$.request({
				url: that.Config.URL.account.vehicle_brand,
				data: params,
				success: function(data, status, msg, code) {
					if (status == 200) {
						for(var r in data.items){
							that.brands[r] = data.items[r]

						}

					}

				},
			})
		},

		initData:function (){
			let that = this;
			that.$.request({
				url: that.Config.URL.account.certificate.replace(/typ=e/, "typ=json"),
				data: {},
				success: function(data, status, msg, code) {
					if (status == 200) {
						that.setData({
							user_data: data
						})

						that.user_data.user_vehicle_name = data.user_vehicle_name.split(",").join('>')

					} else {
					}

					that.getbrand();
				},
			})


		},

		onInputNickname: function (e) {
		    let that = this;
		    this.setData({user_nickname:e.detail.value})
		    that.$.isNull(e.detail.value) ? this.setData({isNickname: !1}) : this.setData({isNickname: !0})
		},

        inputAccount: function (e) {
            let that = this;
            this.setData({user_account:e.detail.value})
            that.$.isNull(e.detail.value) ? this.setData({isAccount: !1}) : this.setData({isAccount: !0})
        },

		onInputPassword: function (e) {
		    let that = this;
		    this.setData({user_password:e.detail.value})
		    that.$.isNull(e.detail.value) ? this.setData({isPassword: !1}) : this.setData({isPassword: !0})
		},

		inputphone: function (e) {
		    let that = this;
		    this.setData({user_mobile: e.detail.value,user_password:e.detail.value,user_account:e.detail.value});
		    that.$.isNull(e.detail.value) ? this.setData({isUserMobile: !1,isPassword: !1,isAccount: !1}) : /^1[0123456789]\d{9}$/.test(e.detail.value) ? this.setData({isUserMobile: !0}) : this.setData({isUserMobile: !1})
		},


		onInputLicenseplate: function (e) {
				this.user_data.user_licenseplate = e.detail.value

		},

        upImgs: function(e) {
            var that = this;

			var i = e.currentTarget.dataset.imgindex;

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
                        success: function(n) {
                            that.$.hideLoading();

                            var up_res = that.$.parseJSON(n.data);
                            var s = up_res.data.url;

							let info = Object.assign({}, that.user_data);
							info[i] = s;
							//that.login(that.user_data);



                            that.setData({
                                user_data: info
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
                fail: function(e) {
                    that.$.hideLoading()
                },
                complete: function(e) {
                    that.$.hideLoading()
                }
            })
        },

		//上传车牌照图片
		licenseplateImage: function(){
			var that = this;
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
						formData: {
						             'license_plate': 'test'
						          },
			            success: function(n) {
			                that.$.hideLoading();
							var up_res = that.$.parseJSON(n.data);

							that.user_licenseplate = up_res.data.license_plate_number

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

		submitdata: function(e) {
			let that = this;

			if (that.$.isNull(this.user_mobile))
			{
			    this.setData({isUserMobile: !1});
			}

			if (!/^1[0123456789]\d{9}$/.test(this.user_mobile))
			{
			    this.setData({isUserMobile: !1});
			}

			if (that.$.isNull(this.user_password))
			{
			    this.setData({isPassword: !1});
			}

			if (that.$.isNull(this.user_nickname))
			{
			    this.setData({isNickname: !1});
			}

			if (that.$.isNull(this.user_licenseplate))
			{
			    this.setData({isLicenseplate: !1});
			}

			if (that.$.isNull(this.user_account))
			{
			    this.setData({isAccount: !1});
			}

			if (that.$.isNull(this.user_tyre))
			{
			    this.setData({isTyre: !1});
			}

			if (this.isUserMobile && this.isNickname && this.isPassword && this.isAccount && this.isLicenseplate && this.isTyre)
			{
			    this.update();
			}

		},
		lod: function() {
			this.setData({
				user_account: '',
				user_password:'',
				user_nickname:'',
				user_mobile: '',
				user_licenseplate :'',
				user_vehicle_name : '',
				vehicle_category_id : 0,
				isPassword: !0,
				isNickname: !0,
				isAccount: !0,
				isUserMobile: !0,
			})
		},
        update: function() {
            let that = this;
			var vehicle = that.user_vehicle_name.split(">").join(',');

			var params = {
				user_account: that.user_account,
				user_password:that.user_password,
				user_nickname:that.user_nickname,
				user_mobile: that.user_mobile,
				user_licenseplate :that.user_licenseplate,
				user_vehicle_name : vehicle,
				user_tyre : that.user_tyre,
				vehicle_category_id : that.vehicle_category_id

			};

			that.$.request({
			    url: that.Config.URL.seller.add_member,
			    data: params,
			    success: function(data, status, msg, code) {
			        if (status == 200) {

							that.$.showToast({
								title: that.__("添加成功"),
								success: function() {
									setTimeout(function() {that.lod()}, 1500);

								}
							})
			        } else {
						that.$.confirm(msg);
			        }
			    }
			});



        },

		showvehicle: function() {
			var that = this;
			that.setData({
				parent_id:0,
				vehicle_category_id:0,
				oneVehiclecategory:'',
				twoVehiclecategory:'',
				threeVehiclecategory:'',
				n_level:0,
				vehicle_name:'',
				vehicle_category:[],
				tapindex:1
			})
			that.getVehiclecategorys()

			this.rightDrawerVehicle = true;
		},

		getVehiclecategory: function(e){
			var that = this;
				switch (that.tapindex) {
					case 1:
						that.setData({
							n_level:that.tapindex,
							vehicle_category_id:parseInt(e.currentTarget.dataset.category_id),
							oneVehiclecategory:e.currentTarget.dataset.category_name,
							parent_id:e.currentTarget.dataset.parent_id,
							tapindex:2
						})
						that.getVehiclecategorys()
						break;
					case 2:
						that.setData({
							n_level:that.tapindex,
							vehicle_category_id:parseInt(e.currentTarget.dataset.category_id),
							twoVehiclecategory:e.currentTarget.dataset.category_name,
							parent_id:e.currentTarget.dataset.parent_id,
							tapindex:3
						})
						that.getVehiclecategorys()
						break;
					case 3:
						that.setData({
							threeVehiclecategory:e.currentTarget.dataset.category_name,
							vehicle_category_id:parseInt(e.currentTarget.dataset.category_id),
							tapindex:1,
							n_level:0,
							rightDrawerVehicle:false
						})
						that.user_vehicle_name  = that.oneVehiclecategory + '>' + that.twoVehiclecategory + '>' + that.threeVehiclecategory

						break;
				}


		},

		getVehiclecategorys: function(e){
			var that = this;
			var	params = {

				};

			if(that.vehicle_category_id !== 0){
				params.category_id= that.category_id,
				params.nodeid = that.vehicle_category_id,
				params.parentid = that.parent_id,
				params.n_level = that.n_level
			}
			that.$.request({
				url: that.Config.URL.seller.vehicle_category,
				data: params,
				success: function(data, status, msg, code) {
					if(status ==  200){
						that.setData({
							vehicle_category: data.items
						})
					}
				}
			})
		},


    },

};
</script>


<style lang="scss">
@import '../../styles/_variables.scss';
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

.uni-uploader__img
{
	width: 320upx;
	height: 200upx;
}

	.m-tab {
		width: 100%;
	}

	.m-navbar-item {
		padding: 20upx 0;
		font-size: 24upx;
	}

	.m-orderlist {
		padding-top: 170upx;
		position: absolute;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}

	.m-navbar-item:after {
		border: none;
	}

	.m-navbar-item.m-navbar-item-on {
		background-color: #fff;
		color: $default-skin-bg;
	}

	.m-navbar-item.m-navbar-item-on::before {
		content: " ";
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height:
				6upx;
		border-bottom: 6upx solid $default-skin-bg;
		color: #CCCCCC;
		-webkit-transform-origin: 0 100%;
		transform-origin: 0 100%;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		z-index: 3;
	}

	.u-tuan-label {
		padding: 5upx;
		background-color: $default-skin-bg;
		border-radius: 4upx;
		font-size: 24upx;
		color:#fff;
		margin-right: 5upx;
	}

	.nav-image {
		width:12upx;
		height:24upx;
		float:right;
		padding-top:12upx;
	}

	.m-cell::before {
		border-top: 0px solid #ebebe7;
	}
</style>
