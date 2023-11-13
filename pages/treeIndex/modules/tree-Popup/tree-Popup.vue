<template>
	<uni-popup ref="popup" type="bottom">
		<view class="tree-list">
			<view class="tree-list-title">
				<text>已选择：{{modelValue.length}}人</text>
				<view class="">
					<text @tap="allClear()" class="all-clear">全部移除</text>
					<text @tap="close()" class="confrim">确认</text>
				</view>
			</view>
			<scroll-view scroll-top="0" scroll-y="true" class="scroll-Y">
				<view class="tree-list-item" v-for="(item,index) in modelValue" :key="index">
					<template v-if="checkIsRender(index)">
						<text>{{item.name}}</text>
						<text class="clear-btn" @tap="treeNodeClear(index)">移除</text>
					</template>
				</view>
			</scroll-view>
		</view>
	</uni-popup>
</template>

<script setup lang="ts">
	import {
		basicProps,
		popupEmits
	} from './props'
	import { ref } from 'vue'
	import { UPDATE_MODEL_EVENT } from '../../../../constants/event'
	import { useDefer } from '../hooks/useDefer.ts'
	const props = defineProps(basicProps)
	const popup = ref(null)
	const emit = defineEmits(popupEmits)
	const checkIsRender = ref(null)
	function treeNodeClear(index) {
		props.modelValue[index].checked = false
		props.modelValue[index].halfChecked = false
		props.modelValue.splice(index, 1)
	}
	function open() {
		popup.value.open()
		const  { checkIsRender: fn } = useDefer(props.modelValue.length, 2)
		checkIsRender.value = fn
	}
	function close() {
		popup.value.close()
	}
	function allClear(){
		for (let i = 0; i < props.modelValue.length; i++) {
			const v = props.modelValue[i]
			v.checked = false
			v.halfChecked = false
		}
		emit(UPDATE_MODEL_EVENT, [])
	}
	 defineExpose({
	        open,
			allClear
	    })
</script>

<style scoped>
	.scroll-Y {
		height: 500px;
	}

	.tree-list {
		background-color: #fff;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		padding: 12px 16px;
	}

	.tree-list-title {
		font-weight: 600;
		font-size: 16px;
		display: flex;
		justify-content: space-between;
		padding-top: 12px;
		padding-bottom: 12px;
		border-bottom: 1px solid #e4e1e1;
	}

	.tree-list-title .confrim {
		color: #529edb;
		cursor: pointer;
	}
	.tree-list-title .all-clear {
		color: rgba(0, 0, 0, 0.4);
		cursor: pointer;
		margin-right: 10px;
	}
	.tree-list .tree-list-item {
		padding: 10px 0px;
		border-bottom: 1px solid #e4e1e1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.clear-btn {
		padding: 5px 12px;
		background-color: #fff;
		border: 1px solid #dedede;
		border-radius: 10px;
	}
</style>
