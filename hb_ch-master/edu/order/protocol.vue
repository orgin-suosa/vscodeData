<template>
	<!-- 弹出层 -->
	<view class="uni-banner" style="background:#FFFFFF;"  v-if="loaded">
		<view :style="'height: ' + h + 'px; width:750uxp;padding:50upx;'">
			<scroll-view scroll-y="true"  :style="'height: ' + h + 'px; '">
					<wxParse :content="contract.course_contract_context"  />
			</scroll-view>
		</view>
		<view style="height:50px;text-align: center;">
<!--            <view class="button-sp-area">-->
<!--                <button class="mini-btn" type="default" size="mini" @tap="disagree" v-if="!state && showBtnFlag">{{__('不同意')}}</button>-->
<!--                <button class="mini-btn" type="warn" size="mini" @tap="agree">{{__('同意')}}</button>-->
<!--            </view>-->
		</view>
	</view>
</template>

<script>

	import wxParse from '@/components/u-parse/u-parse.vue'
  import htmlParser from '@/helpers/plugins/html-parser.js'
  import {
    mapState,
    mapMutations
  } from 'vuex'
	export default {
		data() {
			return {
        product_id: '',
        contract: {},
				protocols_key:'',
				protocol_text:'',
				loaded:true,
				h:0,
				showBtnFlag:true,
				state:false
			}
		},
		components: {
			wxParse
		},
    computed: mapState(['Config']),
		onLoad(options){
			uni.setNavigationBarTitle({
			    title:this.__('课程服务协议')
			});
			
			var h = this.$.getSystemInfoSync().windowHeight;

			this.setData({
				h: h-50-50,
        product_id:options.product_id,
        protocols_key:options.product_id ? options.product_id : 'reg_protocols_description',
        showBtnFlag:options.no_btn ? false : true
			})
			

			//console.info(h)
			this.getProtocal();
		},
		methods: {
      // 解析富文本 html字符串
      html(strHtml) {
        if (!strHtml) return ""
        strHtml = "<div>" + strHtml + "</div>"
        /*
        let nodes = htmlParser(strHtml)
        if(!nodes || nodes.length == 0) return ""

        let div = nodes[0]
        let childrens = div.children
        console.log(nodes) */

        strHtml = strHtml
            .replace(/\<img/gi,
                "<img style='vertical-align: top;max-width: 100%; border-radius: 6px; background-color: #eee;'")
            .replace(/\<p/gi,
                "<p style='margin: 0;min-height: 30px;margin-left: 0px;margin-bottom: 30px;font-weight: 400;font-size: 17px;line-height: 30px;color: #353535;'"
            )

        return htmlParser(strHtml)
      },
			getProtocal: function() {
				let that = this;
				let params = {product_id:this.product_id};
				that.$.request({
          url: that.Config.URL.edu.getCourseContract,
				  data: params,
				  success: function (data, status, msg, code) {
            if (status === 200){
              that.contract = data;
            }
				  }
				});
			},
			disagree: function() {
				let that = this;
				uni.showModal({
					title: '',
					content: that.__('十分抱歉，若您不同意此协议，我们将无法为您提现'),
					cancelText:that.__('返回'),
					confirmText:that.__('我再想想'),
					success: function (res) {
						if (res.confirm) {
						} else if (res.cancel) {
							uni.navigateBack({
								delta:1
							})
						}
					}
				});
			},

			agree: function() {
				let that = this;
				let params = {protocols_key:this.protocols_key, state:1};

				that.$.request({
				    url: that.cf.URL.protocol,
				    data: params,
				    success: function (data, status, msg, code) {
						that.$.alert('签订协议成功！')
						that.state = data.state;
						
						uni.navigateBack({
							delta:1
						})
				    }
				});
			}

		}
	}
</script>
<style>

</style>
