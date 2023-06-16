<template>
	<view class="shares">
		<view class="" v-if="!showLoading && !showError">
			<view class="shares-tips">
				请上传含有股票名称/代码的清晰图片，最多支持同时上传3张
			</view>
			<view class="shares-img">
				<image style="width: 664rpx;height: 485rpx;" :src="picture"></image>
			</view>
			<view class="simples-picture">
				示例图片
			</view>
			 <view class="shares-btn">
			 	<u-button shape="circle" size="normal" class="open-picture" text="打开相册" @click="openPicture"/>
				<u-button shape="circle" size="normal" class="photo-identification" text="拍照识别" @click="identifyStock"/>
			 </view>
		</view>
		 <!-- loading -->
		 <loading class="loading" v-if="showLoading"/>
		 <identifyError v-if="showError" />
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import loading from '../components/loadingCss.vue';
	import identifyError from '../components/identifyError.vue'
	function funurlTobase64(url) {
	  return new Promise((resolve, reject) => {
	    uni.request({
	      url: url,
	      method: 'GET',
	      responseType: 'arraybuffer',
	      fail: error => {
			  console.info('fail==',error)
	        reject(error);
	      },
		  // 'data:image/jpeg;base64,' + 
	      success: async res => {
			    console.info('success==',res)
	        let base64 = uni.arrayBufferToBase64(res.data);
	        base64 = base64;
	        resolve(base64);
	      }
	    })
	  })
	}
	// async function chooseImage2Base64() {
	//     return new Promise(async (resolve, reject) => {
	//      try {
	//       const [error, res] = await uni.chooseImage({
	//        count: 1
	//       });
	//       if (error) {
	//        throw new Error(error);
	//       }
	//       // #ifdef H5
	//       if (!/^image/.test(res.tempFiles[0].type)) {
	//        throw new Error('文件类型错误');
	//       }
	//       // #endif
	
	//       const tempFilePath = res.tempFilePaths[0];
	//       let base64Data = '';
	//       // #ifdef H5
	//       base64Data = await this.blob2Base64(res.tempFiles[0]);
	//       base64Data = (/.+;\s*base64\s*,\s*(.+)$/i.exec(base64Data) || [])[1];
	//       resolve(base64Data);
	//       // #endif
	
	//       // #ifdef MP
	//       base64Data = await uni.getFileSystemManager().readFile({
	//        filePath: tempFilePath,
	//        encoding: 'base64',
	//        success: ({
	//         data
	//        }) => {
	//         resolve(data);
	//        }
	//       });
	//       // #endif
	
	//       // #ifdef APP-PLUS
	//       base64Data = await this.filePath2Base64(tempFilePath);
	//       base64Data = (/.+;\s*base64\s*,\s*(.+)$/i.exec(base64Data) || [])[1];
	//       // console.info('base64Data=',base64Data)
	//       resolve(base64Data);
	//       // #endif
	
	//      } catch (error) {
	//       throw new Error(error);
	//      }
	//     });
	//    }
	   async function blob2Base64(file) {
	     return new Promise((resolve, reject) => {
	       try {
	         const fileReader = new FileReader();
	         fileReader.onloadend = async () => {
	           resolve(fileReader.result);
	         };
	         fileReader.readAsDataURL(file);
	       } catch (error) {
	         reject(error);
	       }
	     });
	   }
	   async function filePath2Base64(filePath) {
	     return new Promise((resolve, reject) => {
	       try {
	         plus.io.resolveLocalFileSystemURL(
	           filePath,
	           function (entry) {
	             entry.file(function (file) {
	               const fileReader = new plus.io.FileReader();
	               fileReader.readAsDataURL(file, 'utf-8');
	               fileReader.onloadend = function (evt) {
	                 resolve(evt.target.result);
	               };
	             });
	           },
	           function (e) {
	             reject(e.message);
	           }
	         );
	       } catch (error) {
	        reject(error);
	       }
	     });
	   }
	export default{
		components:{
			loading,
			identifyError
		},
		data(){
			return{
				methods:'',
				showError:false,
				imageList:[],
				baseImageList:[],
				chooseImageList:[],
				stockList:[],
				showLoading:false,
				picture:`${getApp().globalData.qnUrl}/zc_images/findTools/simple.png`+ this.$FT.versionKey(),
			}
		},
		created(){
			// this.getSharesList({"imageBase64":["1","2"]});
		},
		computed:{
			...mapState(['Config']),
		},
		methods:{
			// 请求股票列表
			getSharesList(params){
				let that = this
				// #ifdef APP-PLUS
				this.methods = 'POST'
				// #endif
				// #ifdef H5
				  this.methods = 'OPTIONS'
				// #endif
				
				
				this.showLoading = true
				uni.request({
					url:this.Config.selfShock,
					method:this.methods,
					dataType: 'jsonp',
					data:params,
					success:(res)=> {
						let {code, result} = JSON.parse(res.data);
						if(result && result.length == 0 ){
							console.log('進來啦');
							this.showLoading = false
							this.showError = true
						}
						console.log('code====>',code);
						console.log('result====>',result);
						if(code == "0" && result && result.length !== 0){
							this.showLoading = false
							this.stockList = JSON.stringify(result);
							uni.redirectTo({
								url:`/findTools/saoLeiBao/identifyStock?stockList=${this.stockList}`
							})
						};
					},
					fail() {
						// 识别失败的展示
						this.showError = true
					}
				})
			},
			// 打开相机
			identifyStock(){
				// 每次先清空上次的
				this.chooseImageList = []
				uni.chooseImage({
					count:3,
					sourceType: ['camera'],
					success:async (res)=>{
						this.imageList = this.imageList.concat(res.tempFilePaths); //前端页面展示
						console.info('前端展示',this.imageList);
						// #ifdef APP-PLUS
						for(let i = 0;i < res.tempFilePaths.length;i++){
							let result = await filePath2Base64(res.tempFilePaths[i])
							this.chooseImageList = this.chooseImageList.concat(result)
						}
						// #endif
						// #// #ifdef H5
						for(let i = 0;i < res.tempFilePaths.length;i++){
							let result = await funurlTobase64(res.tempFilePaths[i])
							this.chooseImageList = this.chooseImageList.concat(result)
						}
						// #endif
						
						console.info('转换后base64',JSON.stringify(this.chooseImageList));
						console.info('转换后base64-1',this.chooseImageList[0]);
						this.getSharesList({"imageBase64":this.chooseImageList});
					}
				})
			},
			// 打开相册
			openPicture(){
				// 每次先清空上次的
				this.chooseImageList = []
				uni.chooseImage({
					count:3,
					sourceType: ['album'],
					success:async (res)=>{
						this.imageList = this.imageList.concat(res.tempFilePaths); //前端页面展示
						console.info('前端展示',this.imageList);
						// #ifdef APP-PLUS
						for(let i = 0;i < res.tempFilePaths.length;i++){
							let result = await filePath2Base64(res.tempFilePaths[i])
							this.chooseImageList = this.chooseImageList.concat(result)
						}
						// #endif
						// #// #ifdef H5
						for(let i = 0;i < res.tempFilePaths.length;i++){
							let result = await funurlTobase64(res.tempFilePaths[i])
							this.chooseImageList = this.chooseImageList.concat(result)
						}
						// #endif
						console.info('转换后base64',this.chooseImageList);
						console.info('转换后base64-1',this.chooseImageList[0]);
						this.getSharesList({"imageBase64":this.chooseImageList});
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.shares{
		padding: 51rpx 0rpx 0rpx 0rpx;
		&-tips{
			font-size: 32rpx;
			font-weight: 400;
			color: #333333;
			padding: 0rpx 54rpx 72rpx 55rpx;
		}
		&-img{
			text-align: center;
		}
		.open-picture{
			width: 520rpx;
			height: 90rpx;
			line-height: 90rpx;
			background: #FA6029 linear-gradient(90deg, #FF6161 0%, #FF9661 100%);
			color: #fff;
			font-size: 30rpx;
			font-weight: 500;
			margin-top: 76rpx;
		}
		.photo-identification{
			width: 520rpx;
			height: 90rpx;
			line-height: 90rpx;
			font-size: 30rpx;
			font-weight: 500;
			color: #FA6029;
			border: 2px solid #FA6029;
			margin-top: 50rpx;
		}
		.simples-picture{
			text-align: center;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
			margin-top: 40rpx;
		}
		.loading{
			margin-top: 468rpx;
		}
	}
</style>