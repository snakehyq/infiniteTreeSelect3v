<template>
	<hyq-tree :label="props.label" :children="props.children" :key-code="props.keyCode" :has-path="props.hasPath"
		:nodes="props.nodes" :multiple="props.multiple" :checkStrictly="props.checkStrictly" :tree-node="treeNode"
		:feed-back-list="feedBackList" is-check show-search @handleConfirm="handleConfirm"
		@confirmSearch="confirmSearch"></hyq-tree>
</template>

<script setup lang="ts">
	import {
		ref
	} from 'vue'
	import {
		treeNode
	} from './data.js'
	const aprop = {
		label: 'name',
		children: 'children',
		keyCode: 'id',
		multiple: true,
		hasPath: false
	}
	const bprop = {
		label: 'name',
		children: 'children',
		keyCode: 'id',
		multiple: true,
		checkStrictly: true,
		hasPath: false
	}
	const cprop = { //单选模式(任意一项)
		label: 'name',
		children: 'children',
		keyCode: 'id',
		multiple: false,
		nodes: false,
		hasPath: false
	}
	const dprop = { //单选模式选user
		label: 'name',
		children: 'children',
		keyCode: 'id',
		multiple: false,
		nodes: true,
		hasPath: false
	}
	const props = ref(cprop)
	const feedBackList = ref([])
	const handleConfirm = (val) => {
		console.log('完成', val);
	}
	function confirmSearch(val) {
		console.log('搜索', val);
	}
</script>

<style scoped>
</style>