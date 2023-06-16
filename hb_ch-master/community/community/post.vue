<template>
    <view>
        <view class='box'>
            <view class='box_title'>
                <input @blur="onBlurStoryTitle" @input="onInputStoryTitle"
                       class='box_text_input' maxlength="18"
                       :placeholder="__('帖子标题3~18个字以内')" placeholder-style="color:#999;font-size: 30upx;" v-model="story_title"></input>
            </view>
            <view class='box_text'><textarea auto-height="true" @blur="bindTextAreaBlur" @input="onInputStoryContent"
                                             class='textarea' maxlength="3000"
                                             :placeholder="__('帖子内容5~3000个字以内')" placeholder-style="  font-size: 30upx;color: #999;"
                                             v-model="story_content"/></view>

            <view class='pic_box'>
                <view class='pic_box_img'>
                    <!-- 视频 -->
                    <view  v-if="story_video"  style='display: inline-block;position: relative'>
                        <view class="uni-icon uni-icon-clear mp-clean-icon icon-cuo" @tap="delectVideo" v-if="false"></view>
                        <video :src="story_video" class="pic_box_image" ></video>
                        <cover-view  class='shanchu'>
                            <label  @tap="delectVideo" class="iconfont icon-delete" style='color:#fff'></label>
                        </cover-view>
                    </view>

                    <block v-for="(item, index) in ImgList" :key="index">
                        <view style='display: inline-block;position: relative'>
                            <image class='pic_box_image' :src='item.Url' :data-src="item.Url" @click="previewImage" mode="scaleToFill"></image>
                            <view class='shanchu' style=''><label @tap='delImg' class="iconfont icon-delete"
                                                                  :data-id="item.SkuId" :data-index="index"
                                                                  style='color:#fff'></label>
                            </view>
                        </view>
                    </block>
					<view class="pic_box_image_videoImage" v-if="!story_video" @click='chooseVideoImage'>
					    <image class='pic_box_image buttonAdd' :src='buttonAdd'></image>
					</view>
                </view>
            </view>
            <view style='background-color:#f6f6f6;padding:20upx 0 0upx 0;'>
                <view class='bk_box'>
                    <view class='bk_box_title'><span>{{__('推荐商品')}}</span></view>
                    <view class='pic_box_pic'>
                        <view style='display: inline-block;'>
                            <view class="selectShop_content">
                                <view class='pic_box_image' :style='"background: url(" + item.product_image + ") center no-repeat ;background-size:contain;"' v-for="(item, index) in shopback" :key="index">
                                    <view @tap='delshopImg' class='shanchu' :data-index='item.item_id'
                                          style='bottom:0upx;margin:0'><label class="iconfont icon-delete" data-id="item.item_id"
                                                                              data-index="index"
                                                                              style='color:#fff'></label></view>
                                </view>
        <!--                        <image @tap='shopsearch' class='pic_box_image buttonAdd' :src='buttonAdd' v-if="shopback.length < 4"></image> -->
								<view class="pic_box_image_shop">
									 <image @tap='shopsearch' class='pic_box_image buttonAdd'  :src='buttonAdd' v-if="shopback.length < 4"></image>
								</view>
								                               
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view style='height:20upx;background-color:#f6f6f6'></view>
            <view>
                <view class='bk_box'>
                    <view class='bk_box_title'><span>{{__('添加到板块')}}</span></view>
                    <view class='bkspan'>
                        <block v-for="(item, index) in CategoryList" :key="index">
                            <view @click="ChoosePlate" :id="item.story_category_id">
                                <view :class="'bkspan_span ' + (item.story_category_id==storyCategoryId?'borred':'')">{{item.story_category_name}}</view>
                            </view>
                        </block>
                    </view>
                </view>
            </view>
        </view>

        <view style='width:100%;height:79upx'></view>
        <view class='fabu_box'>
			<view @tap="AddMemberPosts">
				<view class='fabu_box_fb release'>{{__('发布')}}</view>
			</view>
  <!--          <view style='width:2upx;height:100%;backgroud-color:#fff'></view>
            <view @tap="SaveDraft">
                <view class='fabu_box_fb' style='width:375upx;'>{{__('保存草稿')}}</view>
            </view> -->

        </view>
    </view>
</template>

<script>

    import dateUtil from "../../helpers/util_date";
    import {mapMutations, mapState} from 'vuex'


    var sourceType = [
        ['camera'],
        ['album'],
        ['camera', 'album']
    ]

    var Interval , picPath = [];
    export default {
        data: function () {
            return {
                options: {},
                story_title: "",
                story_content: "",
                story_contentVal: "",
                storyCategoryId: 0,
                CategoryList: [],
                ImgList: [],//图片
                sortList: [],
                shopback: [],
                caogaolist: [],
                proLista: [],
                objlist: [],
                tiaozhuan: !0,
                shuaxin: !0,
                count: 0,
                uploadFile: !0,
                bdpicPath: [],

                story_video:"",//视频存放
                sourceTypeIndex: 2,
                checkedValue:true,
                checkedIndex:0,
                sourceType: ['拍摄', '相册', '拍摄或相册'],
                cameraList: [{
                    value: 'back',
                    name: '后置摄像头',
                    checked: 'true'
                },
                    {
                        value: 'front',
                        name: '前置摄像头'
                    },
                ],
                cameraIndex: 0,
                VideoOfImagesShow:true,
				buttonAdd: `https://qnsp.zcskjy.com/zc_images/images/button_add.png`,
				uid:''
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        onLoad: function (options) {
            var that = this;

            uni.setNavigationBarTitle({
                title:this.__('发帖')
            });

            this.sourceType = [that.__('拍摄'), that.__('相册'), that.__('拍摄或相册')];

            this.setData({
                options: options
            });


            that.$.getStorage({
                key: "draft_key",
                success: function (t) {
                    t.data ? that.getStorage(t) : picPath = []
                }
            });

            that.notice.addNotification("RefreshCoupon", that.RefreshCoupon, that);

			if (options.pid)
			{
				//读取商品信息
				
				var params = {
					item_id: options.pid,
				};
				
				that.$.request({
					url: this.Config.URL.product.item,
					data: params,
					loading: false,
					ajaxCache: {
						timeout: this.Config.CACHE_EXPIRE
					},
					success: function(data, status, msg, code) {
						if (200 == status) {
							
							let selectd_p = {couponItemId: [{item_id:options.pid, product_image:data.item_row.product_image}]};
							that.RefreshCoupon(selectd_p);
						}
				
					},
					complete: function (res, status) {
					}
				});
				
				
			}
				that.setData({
				  uid: options.uid || that.userInfo.user_id,
				});	
            that.GetCategoryList()
        },

        onHide: function () {
            clearInterval(Interval)
        },

        onShow: function () {
            var that = this;
            Interval = setInterval(function () {
                    that.zdSaveDraft()
                },
                3e4)
        },

        onUnload: function () {
            let that = this;
            this.notice.removeNotification("RefreshCoupon", that);
            clearInterval(Interval)


            this.story_video = '',
                this.sourceTypeIndex = 2,
                this.sourceType = [that.__('拍摄'), that.__('相册'), that.__('拍摄或相册')];
        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {
            this.initData(true)
        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {
            return {
                title: this.ShareTitle,
                imageUrl: this.ShareImg,
                path: "/pages/index/index?uid=" + this.userInfo.user_id
            }
        },

        /**
         * 页面滚动触发事件的处理函数
         */
        onPageScroll: function () {
        },

        methods: {
            ...mapMutations(['logout', 'getPlantformInfo', 'forceUserInfo', 'getStoreInfo']),
            getStorage: function (t) {
                var that = this;
                //console.log(t.data);
                t = JSON.parse(t.data);
                //console.log(t);
                for (var s = [], o = 0; o < t.story_file.length; o++)
                {
                    s.push({Url: t.story_file[o], order: o});
                }

                picPath = s;
                that.setData({
                    story_title: t.story_title,
                    ImgList: s,
                    shopback: that.shopback.concat(t.proList),
                    storyCategoryId: t.story_category_id,
                    story_content: t.story_content,
                    story_video: t.story_video
                });

                picPath = [];
                that.GetCategoryList()
            },
            RefreshCoupon: function (t) {
                if (0 == this.shopback.length)
                {
                    this.setData({shopback: t.couponItemId});
                }
                else
                {
                    var a = [];
                    a = this.shopback;
                    for (var s = 0; s < a.length; s++)
                    {
                        for (var o = 0; o < t.couponItemId.length; o++)
                        {
                            a[s].item_id == t.couponItemId[o].item_id && a.splice(s, 1);
                        }
                    }
                    for (o = 0; o < t.couponItemId.length; o++)
                    {
                        a.push(t.couponItemId[o]);
                    }
                    this.setData({shopback: a})
                }
            },

            /* 版块 */
            GetCategoryList: function () {
                var that = this, params = {};

                that.$.request({
                    url: that.Config.URL.sns.category_lists,
                    data: params,
                    success: function(data, status, msg, code) {
                        if (200 == status && data.items.length > 0) {
                            that.CategoryList = data.items
                        } else {
                        }
                    }
                });
            },
            onInputStoryTitle: function (t) {
                this.setData({story_title: t.detail.value})
            },
            onBlurStoryTitle: function (t) {
                this.setData({story_title: this.story_title})
            },
            onInputStoryContent: function (t) {
                this.setData({story_contentVal: t.detail.value})
            },
            bindTextAreaBlur: function () {
                this.setData({story_content: this.story_contentVal})
            },
            ChoosePlate: function (t) {
                this.setData({storyCategoryId: t.currentTarget.id})
            },
            UploadImg: function () {
                var that = this, max_num = 9;
				let ukey = uni.getStorageSync('ukey');
                if (that.$.isNull(that.ImgList) || (max_num = 9 - that.ImgList.length), 0 != max_num)
                {
                    that.$.chooseImage({
                        count: max_num,
                        sizeType: ["compressed"],
                        sourceType: ["album", "camera"],
                        success: function (result) {
                            for (var num = that.ImgList.length, path = result.tempFilePaths, idx = 0; idx < path.length; idx++)
                            {
                                that.$.uploadFile({
                                    url: that.Config.URL.upload,
                                    method: "POST",
                                    filePath: path[idx],
                                    name: "upfile",
                                    formData: {
										user: idx + num,
										perm_key:ukey,
									},
                                    //header: {"content-type": "multipart/form-data"},
                                    success: function (t) {
                                        //console.log(t), //console.log(t.data);
                                        var a = JSON.parse(t.data);
                                        //console.log(a);
                                        var s = that.$.parseJSON(t.data);

                                        if (s.status == 200)
                                        {
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
                                        }
                                        else
                                        {
                                            that.$.confirm(s.msg || that.__('发生错误'));
                                        }

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
            delImg: function (e) {
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
            AddMemberPosts: function () {
                var that = this;
                if (19 < that.story_title.length || that.story_title.length < 3)
                {
                    that.$.alert(that.__("标题在3~18字内"));
                }
                else if (that.story_content.length < 5)
                {
                    that.$.alert(that.__("内容在5~3000字内"));
                }
                else if (0 != that.storyCategoryId)
                {
                    var t = [];
                    that.$.isNull(that.story_content) || t.push(0);
                    var a = [];
                    if (!that.$.isNull(that.ImgList))
                    {
                        for (var o = 0; o < that.ImgList.length; o++)
                        {
                            t.push(o + 1), a.push(that.ImgList[o].Url);
                        }
                    }
                    that.setData({sortList: t});
                    var e = [];
                    for (o = 0; o < this.shopback.length; o++)
                    {
                        e.push(this.shopback[o].item_id);
                    }
                    if (that.setData({objlist: e}), 1 == that.tiaozhuan)
                    {
                        that.setData({tiaozhuan: !1});
                        var params = {
                            story_category_id: that.storyCategoryId,
                            story_title: that.story_title,
                            story_content: that.story_content,
                            story_file: JSON.stringify(a || []),
                            SortList: that.sortList,
                            item_id_row: JSON.stringify(that.objlist || []),
                            story_video: that.story_video
                        };

                        that.$.request({
                            url: this.Config.URL.sns.story_add,
							method:"POST",
                            data: params,
                            success: function (data, status, msg, code) {
                                if (200 == status) {
                                    that.$.showToast({title: that.__("已发布，待审核"), icon: "success", duration: 3e3}), clearTimeout(a);
                                    var a = setTimeout(function () {
                                            that.setData({
                                                story_title: "",
                                                story_content: "",
                                                storyCategoryId: 0,
                                                CategoryList: [],
                                                ImgList: [],
                                                sortList: [],
                                                shopback: [],
                                                caogaolist: [],
                                                proLista: [],
                                                objlist: [],
                                                story_video: "",
                                            });

                                            picPath = [];
                                            //that.$.gopage({url: "/community/community/detail?id=" + data.story_id})
                                            that.$.gopage({url: '/community/community/userspace?uid=' + that.uid })
											 // that.$.gopage({url: '/community/community/userspace'})
                                        },
                                        1500);
                                    that.$.removeStorage({
                                        key: "draft_key", success: function (t) {
                                            //console.log(t.data)
                                        }
                                    })
                                } else {
                                    that.$.alert(msg);
                                    that.setData({tiaozhuan: !0})
                                }
                            }
                        });
                    }
                }
                else
                {
                    that.$.showToast({title: "请选择板块", icon: "success", duration: 2e3})
                }
            },
            SaveDraft: function () {
                var that = this, a = [];
                that.$.isNull(that.story_content) || a.push(0);
                var s = [];
                if (!that.$.isNull(that.ImgList))
                {
                    for (var o = 0; o < that.ImgList.length; o++)
                    {
                        a.push(o + 1), s.push(that.ImgList[o].Url);
                    }
                }
                that.setData({sortList: a});
                var e = [];
                for (o = 0; o < this.shopback.length; o++)
                {
                    e.push(this.shopback[o]);
                }
                that.setData({objlist: e});
                var i = {
                        story_category_id: that.storyCategoryId || 0,
                        story_title: that.story_title,
                        story_content: that.story_content,
                        story_file: s || [],
                        SortList: that.sortList,
                        proList: that.objlist || [],
                        story_video: that.story_video
                    },
                    n = JSON.stringify(i);
                that.$.setStorage({key: "draft_key", data: n}), that.$.showToast({title: that.__("保存成功"), icon: "success", duration: 1500})
            },
            zdSaveDraft: function () {
                var that = this, a = [];
                that.$.isNull(that.story_content) || a.push(0);
                var s = [];
                if (!that.$.isNull(that.ImgList))
                {
                    for (var o = 0; o < that.ImgList.length; o++)
                    {
                        a.push(o + 1), s.push(that.ImgList[o].Url);
                    }
                }
                that.setData({sortList: a});
                var e = [];
                for (o = 0; o < this.shopback.length; o++)
                {
                    e.push(this.shopback[o]);
                }
                that.setData({objlist: e});
                var i = {
                        story_category_id: that.storyCategoryId,
                        story_title: that.story_title,
                        story_content: that.story_content,
                        story_file: s || [],
                        SortList: that.sortList,
                        proList: that.objlist || [],
                        story_video: that.story_video
                    },
                    n = JSON.stringify(i);
                that.$.setStorage({key: "draft_key", data: n})
            },
            shopsearch: function () {
                var that = this
                that.$.navigateTo({url: "/community/community/searchsq?num=" + (4 - this.shopback.length)})
            },
            delshopImg: function (s) {
                var that = this;
                that.$.confirm("是否放弃选择该商品?", function (t) {
                        if (t.confirm)
                        {
                            var a = s.target.dataset.index;
                            that.shopback.splice(a, 1), that.setData({shopback: that.shopback})
                        }
                    },
                    !0)
            },


            chooseVideoImage(){
                let that = this;
                uni.showActionSheet({
                    title:that.__("选择上传类型"),
                    itemList: [that.__('图片'), that.__('视频')],
                    success: (res) => {
                        //console.log(res)
                        if(res.tapIndex == 0){
							console.log("上传图片-that.story_video:",that.story_video)
							if(that.story_video != ''){
								uni.showModal({
									title: this.__('提示'),
									content:  this.__("视屏模式下，不支持上传图片"),
									showCancel:false,
									confirmColor:'#F43D3E'
								})
							}else{
								this.chooseImages()
							}
                          
                        } else {
							console.log("上传视屏-ImgList:",that.ImgList)
							if(that.ImgList.length != 0 ){
								uni.showModal({
									title: this.__('提示'),
									content:  this.__("图片模式下，不支持上传视屏"),
									showCancel:false,
									confirmColor:'#F43D3E'
								})
							}else{
								this.chooseVideo()
							}
						
                       
                        }
                    }
                })
            },

            chooseImages(){
                this.UploadImg();
				
                return;

                // 上传图片
                this.$.chooseImage({
                    count: 4, //默认9
                    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album','camera'], //从相册选择
                    success:(res)=> {
						console.log('上传图片-res',res);
                        this.ImgList = this.ImgList.concat(res.tempFilePaths);
						console.log('上传图片-ImgList',this.ImgList);
                        if(this.ImgList.length == 4) {
                            this.VideoOfImagesShow = false
                        }
                    }
                });
            },
            chooseVideo(){
                let that = this;
                // 上传视频
                //console.log('上传视频')
                uni.chooseVideo({
                    maxDuration:10,
                    count: 1,
                    camera: this.cameraList[this.cameraIndex].value,
                    sourceType: sourceType[this.sourceTypeIndex],
                    success: function (result) {
                        uni.showToast({
                            title: that.__('上传中'),
                            icon: 'loading',
                            duration: 10000,
                            mask: !0,
                        })

                        that.$.uploadFile({
                            url: that.Config.URL.upload,
                            method: "POST",
                            filePath: result.tempFilePath,
                            name: "upfile",
                            formData: {video: true},
                            //header: {"content-type": "multipart/form-data"},
                            success: function (t) {
                                //console.log(t), //console.log(t.data);
                                var a = JSON.parse(t.data);
                                //console.log(a);
                                var s = that.$.parseJSON(t.data);

                                if (s.status == 200)
                                {
                                    that.story_video = s.data.url;

                                    let info = {Url:s.data.thumb, SkuId:1}
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
									console.log('上传视频---story_video',that.story_video )
									console.log('上传视频-ImgList',that.ImgList)
                                }
                                else
                                {
                                    s.$.confirm(up_res.msg || that.__('发生错误'));
                                }

                            },
                            fail: function (t) {
								
                            },
                            complete: function (t) {
                                uni.hideToast();
                            }
                        })
                    },
                    fail: function (t) {
                    },
                    complete: function (t) {
                    }
                })
            },
            previewImage: function(e) {
                //预览图片
                var current = e.target.dataset.src

                var that = this;
                var n = [];
                for (var r in this.ImgList) n.push(this.ImgList[r].Url);

                uni.previewImage({
                    current: current,
                    urls: n
                })
            },
            delect(index){
                uni.showModal({
                    title: this.__('提示'),
                    content:  this.__("是否要删除该图片"),
                    success: (res) => {
                        if (res.confirm) {
                            this.ImgList.splice(index, 1)
                        }
                    }
                })
            },
            delectVideo(){
                uni.showModal({
                    title: this.__("提示"),
                    content: this.__("是否要删除此视频"),
                    success:(res) =>{
                        if(res.confirm){
                            this.story_video = ''
                        }
                    }
                })
            }
        }
    }
</script>


<style lang="scss">
    @import "../../styles/_variables";
    @import '../../styles/layout.scss';

    page {
        background-color: #fff;
    }

    .box {
        width: 100%;
    }

    .box_text {
        width: 700upx;
        margin: 30upx 25upx 35upx 25upx;
        position: relative;
        color: #333;
    }

    .textarea {
        width: 690upx;
        height: 227upx;
        display: block;
        position: relative;
        word-wrap: break-word;
        word-break: break-all;
        font-size: 30upx;
        color: #333;
    }

    .pic_box {
        margin: 24upx 27upx;
        display: flex;
    }

    .pic_box_img {
        width: 100%;
		display: flex;
    }

    .pic_box_image {
        width: 154upx;
        height: 154upx;
        margin: 0 10upx;
        overflow: hidden;
        display: inline-block;
        position: relative;
    }

    .pic_box_pic {
        // padding: 24upx 27upx;
		width: 690rpx;
		height: 160rpx;
		background: #F6F6F6;
		border-radius: 8rpx;
		margin: 0 auto;
    }

    .btn_box {
        margin-top: 110upx;
        text-align: center;
        display: flex;
    }

    .u-btn-default {
        width: 566upx;
        margin: 0 92upx;
    }

    .box_title {
        padding: 0 25upx;
        height: 81upx;
        color: #000;
    }

    .box_title::before {
        content: " ";
        position: absolute;
        left: 25upx;
        top: 81upx;
        right: 25upx;
        height: 1px;
        border-top: 1px solid #d9d9d9;
        color: #d9d9d9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .box_text_input {
        height: 81upx;
        font-size: 30upx;
        padding-left: 5upx;
    }

    .bk_box {
        background-color: #fff;
		padding-bottom: 40rpx;
    }

    .bk_box_title {
		padding: 24upx 30rpx 20rpx 25upx;
        font-size: 32rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 60upx;
    }
   .bkspan_span {
        color: #878787;
        font-size: 28upx;
        margin: 8upx 7upx;
        border-radius: 8upx;
        text-align: center;
        padding: 5upx 32upx;
        display: inline-block;
		background: #F9F9F9;
		margin-right: 20rpx;
    }

    .bkspan {
        padding: 20upx 25upx 0 15upx;
        display: flex;
    }


    .fabu_box_fb {
        background: #db384c;
        color: #fff;
        width: 374upx;
        text-align: center;
        float: left;
        font-size: 30upx;
        height: 77upx;
        line-height: 77upx;
    }

    .fabu_box {
        height: 79upx;
        line-height: 79upx;
        font-size: 30upx;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
        bottom: 80rpx;
        display: flex;
    }

    .borred {
        border: 1upx solid #db384c;
        color: #db384c;
    }

    .scimg {
        width: 40upx;
        height: 40upx;
    }

    .shanchu {
        width: 154upx;
        margin: 0 10upx;
        position: absolute;
        bottom: 14upx;
        height: 50upx;
        background-color: #000;
        opacity: 0.6;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9;
    }











    .burst-wrap{
        width: 100%;
        height: 100%;
    }
    /* .burst-wrap .burst-wrap-bg{
        position: relative;
        width: 100%;
        height: 320upx;
        background:linear-gradient(90deg,rgba(251,91,80,1) 0%,rgba(240,45,51,1) 100%);
        border-bottom-right-radius: 80upx;
        border-bottom-left-radius: 80upx;
    } */
    .burst-wrap .burst-wrap-bg>view{
        width: 90%;
        height: 100%;
        margin: 0 auto;
        position: absolute;
        top: 65upx;
        left: 0;
        right: 0;
    }

    .form-item{
        width: 100%;
    }
    .form-item textarea{
        display: block;
        height: 220upx;
        width: 100%;
        color: #AAAAAA;
        font-size: 28upx;
    }
    .uni-uploader__file,.uploader_video{
        position: relative;
        z-index: 1;
        width: 200upx;
        height: 200upx;
    }
    .uni-uploader__img {
        width: 200upx;
        height: 200upx;
    }
    .icon-cuo {
        position: absolute;
        right: 14upx;
        top: 5upx;
        background: linear-gradient(90deg,rgba(251,91,80,1) 0%,rgba(240,45,51,1) 100%);
        color: #FFFFFF;
        z-index: 999;
        border-top-right-radius: 20upx;
        border-bottom-left-radius: 20upx;
    }
    .video{
        width: 100%;
        height: 100%;
    }

    .login-input-box{
        position: relative;
        border-bottom: 1upx solid #EEEEEE;
    }
    .login-input-box .forget,.login-input-box .phone{
        position: absolute;
        top: 0;
        height: 100%;
        z-index: 100;
    }
    .login-input-box .phone{
        width: 100upx;
        left: 0;
        color: #666666;
        font-weight: bold;
    }
    .login-input-box .phone-input{
        padding-left: 100upx;
    }
    .address-wrap,.open-info{
        margin-top: 20upx;
    }
    .open-info>view:last-child{
        font-size: 28upx;
        color: #999999;
    }
    .address-wrap .address {
        background: #F2F2F2;
        border-radius: 40upx;
        padding: 0 20upx;
    }
    .user-set-btn{
        margin: 40upx;
        background: linear-gradient(90deg,rgba(251,91,80,1) 0%,rgba(240,45,51,1) 100%);
        color: #FFFFFF;
        text-align: center;
        height: 88upx;
        line-height: 88upx;
    }
	.pic_box_image_videoImage,.pic_box_image_shop{
		width: 104rpx;
		height: 131rpx;
		border: 1rpx dotted #979797;
		margin: 0 10upx;
		overflow: hidden;
		display: inline-block;
		position: relative;
		margin-left: 44rpx;
		display: flex;
		align-items: center;
		justify-self: center;
	}
	.pic_box_image_videoImage{
		width: 160rpx;
		height: 160rpx;
	}
	.buttonAdd {
		width: 42upx;
		height: 42upx;
		margin: 0 auto;
	}
	.selectShop_content{
		display: flex;
		align-items: center;
		height: 160rpx;
	}
	.release{
		width: 620rpx;
		height: 90rpx;
		background: #F43D3E;
		border-radius: 45rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
	}
</style>
