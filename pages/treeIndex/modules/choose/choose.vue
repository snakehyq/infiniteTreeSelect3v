<template>
	<view>
		<infinite-tree v-bind="prop" :tree-node="treeNode" :feed-back-list="feedBackList" :is-check="true"
			@handleConfirm="handleConfirm"></infinite-tree>
	</view>
</template>

<script setup lang="ts">
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		treeNode
	} from './data.js'
	import infiniteTree from '../tree/tree'
	const prop = ref({})
	const feedBackList = ref([])
	const handleConfirm = () => {
		console.log('val', val);
		// 获取上一个页面
		var pages = getCurrentPages(); //当前页面栈
		var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
		beforePage.$vm.setConfirmData(val); //触发上一个页面中的update方法
	}
	onLoad((options) => {
		console.log(options, options.data);
		// #ifdef H5
		let prop = JSON.parse(decodeURIComponent(options.prop));
		let feedBackList = JSON.parse(decodeURIComponent(options.data));
		// #endif
		// #ifdef MP-QQ||MP-WEIXIN
		let prop = JSON.parse(options.prop);
		let feedBackList = JSON.parse(options.data);
		// #endif
		prop.value = prop
		feedBackList.value = feedBackList
	})
</script>

<style scoped>
</style>
