<template>
	
	<view>
		<button @click="jumpTarget">每日目标</button>
	</view>
	
</template>

<script>
	export default {
			data() {
				return {
					
				}
			},
			methods: {
				jumpTarget(){
					uni.navigateTo({
						url: '/edu/course/learn/target'
					});
				}
		}
	}
</script>

<style>
</style>
