<template>
	<view>
		<hyq-tree :label="props.label" :children="props.children" :key-code="props.keyCode" :has-path="props.hasPath"
			:nodes="props.nodes" :multiple="props.multiple" :checkStrictly="props.checkStrictly" :tree-node="treeNode"
			:feed-back-list="feedBackList" is-check show-search @handleConfirm="handleConfirm"
			@confirmSearch="confirmSearch"></hyq-tree>
	</view>
</template>

<script setup lang="ts">
	import {
		ref,
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		treeNode
	} from './data.js'
	import hyqTree from '@/components/hyq-tree/hyq-tree.vue'
	const props = ref({})
	const feedBackList = ref([])
	function handleConfirm(val: any) {
		uni.$emit('selectSuccess',{value: val})
		uni.navigateBack()
	}

	const confirmSearch = (val) => {
		console.log('val', val)
	}
	onLoad((options) => {
		// #ifdef H5
		let prop = JSON.parse(decodeURIComponent(options.prop));
		let data = JSON.parse(decodeURIComponent(options.data));
		// #endif
		// #ifdef MP-QQ||MP-WEIXIN
		let prop = JSON.parse(options.prop);
		let data = JSON.parse(options.data);
		// #endif
		props.value = prop
		feedBackList.value = data
	})
</script>

<style scoped>
</style>