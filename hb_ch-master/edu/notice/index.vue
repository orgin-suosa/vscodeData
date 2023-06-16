<template>
    <view>
		<u-button @click="getList()">点击触发</u-button>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	var that; // 当前页面对象
	
	export default {
		computed: mapState(['Config']),
		onLoad() {		
			that = this;
		},
		methods: {
			getList() {
				that.$.request({
					url: "http://localhost:8201/mobile/shop/distributionUser/poster",
					data: {
						MainPrice: 666,
						
						summary : '证书概括',
						MainImg : 'http://mallsuite.oss-accelerate.aliyuncs.com/mall/images/media/plantform/20220416/99beb76e06d042a0a84c7735e7f3b783.jpeg',
						MainTitle : '证书标题',
						Path : '',
						source_from: 'wxminiapp',

						poster_name:'poster_name',
						path : '',
					},
					dataType: 'json',
					success: function(data, status, msg, code) {
						if (status == 200) {
							console.log("返回数据：s")
							console.log(data)
						}
					}
				});
			},
		}
	}
</script>

<style>

</style>