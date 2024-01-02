<template>
	<view class="search-tree">
		<view class="search-box">
			<input class="uni-input" v-model="inputValue" confirm-type="search" placeholder="搜索" @confirm='handleFllter'/>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import {
		searchEmits
	} from './props'
	const inputValue = ref("")
	const emit = defineEmits(searchEmits)
	const handleFllter = (e) => {
		console.log(12, e)
		emit("confirm", e.detail.value)
	}
	const clear = () => {
		inputValue.value = ""
	}
	defineExpose({
	    clear
	})
</script>

<style scoped>
	.search-tree {
		padding: 8px 20px;
		background-color: #ffffff;
	}
	.search-box {
		background-color: #eeeff0;
		border-radius: 20px;
		padding: 5px 20px;
		font-size: 10px;
	}
</style>