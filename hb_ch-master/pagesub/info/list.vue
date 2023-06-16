<template>
	<view class="page-news-list">
		<view class="create-icon" @click="createNews">
			发帖
		</view>
		<view class="header-category">
			<view class="category-title">
				分类:
			</view>
			<view v-for="(item, s) in arealist" :key="s" class="category-list">
				<view class="info-item color-blue" :data-cat_id="item.id" @click="getCat">
					{{item.category_name}}
				</view>
			</view>
		</view>
		<view v-for="(item, i) in addresslist"  :key="i" class="news-list">
			<view class="news-item">
				<view class="news-content">
					{{item.category_content}}
				</view>
				<view class="news-info-block">
					<!-- <view class="info-item">
						分类
					</view> -->
					<view class="info-item" v-if="(item.message_keywords)">
						{{item.message_keywords}}
					</view>
					<view class="info-item" v-if="(item.message_area_name)">
						{{item.message_area_name}}
					</view>
				</view>
				<view class="address-info">
					{{item.message_full_area}}
				</view>
				<view class="address-info">
					{{item.message_username}}：{{item.message_mobile}}
				</view>
				<view class="news-info-block">
					<view class="img-item" v-for="(img, t) in item.images" :key="t">
						<image :src="img" ></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'


	export default {
		data() {
			return {
				options:{},
				addresslist: [],
				arealist:[],
				isdata: !1,
				spid: "",
				cat_id: 0,
				ud_id: 0
			}
		},
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('信息列表')
			});

			this.setData({
				ud_id: options.ud_id || 0,
				spid: options.spid || "",
				options: options,
				isdata: !1
			});

			var that = this;
            this.GetAddressList();

            that.notice.addNotification("RefreshAddress", that.RefreshMethod, that);
		},
		onShow: function() {
		},
		onUnload: function() {
			// 离开页面，注销事件
			var that = this
			this.notice.removeNotification("RefreshAddress", that);
		},
        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {
            this.GetAddressList();
        },
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			RefreshMethod: function() {
                console.info('.........RefreshMethod');
				this.GetAddressList()
			},
			getCat: function (e) {
				this.setData({
					cat_id: e.target.dataset.cat_id
				}), this.GetAddressList()
			},
			GetAddressList: function() {
				var that = this;
				var params = {
					message_area : that.cat_id
				};

                that.setData({
                    isdata: !1,
                    addresslist: [],
					arealist: []
                });

				that.$.request({
					url: that.Config.URL.user.serviceMessage,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							if (data.items.length > 0) {

							    //that.addresslist = data.items;

                                that.setData({
                                    isdata: !0,
                                    addresslist: data.items,
									arealist: data.area
                                });
                                console.log(data.area);
							} else {
								that.setData({
									isdata: !1
								});
							}
						}

                        uni.stopPullDownRefresh()
                    }
				});
			},           
			EditAddress: function(obj) {
				var that = this;
				var options = this.options;
				options.ud_id = obj.currentTarget.dataset.ud_id;

				if (that.ud_id != 0) {
					that.$.redirectTo({
						url: that.$.createUrl("/member/address/manage", options)
					});
				} else {
					that.$.navigateTo({
						url: that.$.createUrl("/member/address/manage", options)
					});
				}
			},
			createNews(){
				this.$.gotopage('/pagesub/info/edit')
			}
		}
	};
</script>

<style lang="scss" scoped>
.news-list{
	padding: 10px;
}
.news-item{
	background: #fff;
	padding: 10px;
	border-radius: 10px;
	margin-bottom: 10px;
}
.news-content{
	font-size: 14px;
	color: #212121;
	margin-bottom: 5px;
}
.news-info-block{
	display: flex;
	flex-wrap: wrap;
}
.info-item{
	font-size: 12px;
	margin: 0 5px;
	background: rgba(0,0,0,.3);
	border-radius: 3px;
	padding: 0 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	margin-bottom: 5px;
	&.color-blue{
		background: #275688;
	}
}
.address-info{
	margin: 5px 0;
	font-size: 12px;
}
.img-item{
	width: 33%;
	display: flex;
	justify-content: center;
	margin-bottom: 10px;
	image{
		width: 100px;
		height: 100px;
	}
}
.header-category{
	padding: 10px;
	display: flex;
	align-items: flex-start;
	background: #fff;
}
.category-title{
	flex-shrink: 0;
	font-size: 12px;
	margin-right: 5px;
}
.category-list{
	display: flex;
}
.create-icon {
	position: fixed;
	bottom: 10%;
	right: 20px;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	background-color: rgba(0,0,0,.4);
	font-size: 14px;
	z-index: 10;
}
</style>
