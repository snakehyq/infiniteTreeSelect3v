<template>
	<view class="tree-index">
		<view class="tree-index-title">无限级组件-动态加载-V3</view>
		<button type="primary" @tap="handleChooseTree(aprop)">多选模式（选择任意一项）</button>
		<button type="primary" @tap="handleChooseTree(bprop)">多选模式（关联下级）</button>
		<button type="primary" @tap="handleChooseTree(cprop)">单选模式（选择任意一项）</button>
		<button type="primary" @tap="handleChooseTree(dprop)">单选模式（只选user）</button>
		<button @tap="handleClear">清空选择</button>
		<view v-for="(item,index) in selectData" style="padding: 12px;0px;">
			<view>名字： {{item.name}}</view>
			<view>id： {{item.id}}</view>
			<view v-show="item.path.length">
				path： <text v-for="(pa,index) in item.path">{{pa.name + ' '}}</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		ref,
		toRaw
	} from 'vue'
	let selectData = ref([])
	const aprop = {
		label: 'name',
		children: 'children',
		multiple: true,
		hasPath: false
	}
	const bprop = {
		label: 'name',
		children: 'children',
		multiple: true,
		checkStrictly: true,
		hasPath: false
	}
	const cprop = { //单选模式(任意一项)
		label: 'name',
		children: 'children',
		multiple: false,
		nodes: false,
		hasPath: false
	}
	const dprop = { //单选模式选user
		label: 'name',
		children: 'children',
		multiple: false,
		nodes: true,
		hasPath: false
	}
	const handleClear = () => {
		selectData.value = []
	}
	const handleChooseTree = (props) => {
		// #ifdef H5
		let prop = encodeURIComponent(JSON.stringify(props));
		let data = encodeURIComponent(JSON.stringify(selectData.value));
		// #endif
		// #ifdef MP-QQ||MP-WEIXIN
		let prop = JSON.stringify(props);
		let data = JSON.stringify(toRaw(selectData));
		// #endif
		uni.navigateTo({
			url: "/pages/treeIndex/modules/choose/choose?prop=" + prop + '&data=' + data
		})
	}
	uni.$on('selectSuccess',(data)=>{
		console.log(68, data.value)
		setConfirmData(data.value)
	})
	function setConfirmData(data) {
		selectData.value = data
	}
	defineExpose({
		setConfirmData
	})
</script>

<style scoped>
	.tree-index-title {
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		line-height: 45px;
	}

	.tree-index>button {
		margin-top: 10px;
	}
</style>
