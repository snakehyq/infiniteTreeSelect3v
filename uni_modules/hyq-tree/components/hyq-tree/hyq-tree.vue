<template>
	<view class="tree-node">
		<hyq-tree-search v-show="showSearch" ref="searchRef" @confirm="confirmSearch"></hyq-tree-search>
		<scroll-view class="choose-toolbar" scroll-x="true" scroll-left="120">
			<view class="topics-item" v-for="(top, index) in topics" :key="index" @tap="handleTopic(index, top)">
				<i v-if="index !== 0" class="iconfont icon-z043 iconclass"></i>
				<text :class="isActive(index) ? 'topics-item-active' : ''">{{
          top[label]
        }}</text>
			</view>
		</scroll-view>
		<!-- // 遍历节点渲染列表 -->
		<scroll-view scroll-y ref="infiniteList" class="infinite-list-container" :style="{height: infinityHeight}"
			@scroll="scrollEvent($event)">
			<view class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></view>
			<!-- // 遍历节点渲染列表 -->
			<view class="tree-node-list" ref="nodeListRef" :style="{ transform: getTransform }">
				<view class="node-list-item" v-for="(nodeItem, index) in visibleData" :key="nodeItem[keyCode]"
					@tap="handleTreeNode(nodeItem, index)" :data-index="index">
					<view class="item-left">
						<template v-if="isCheck">
							<!-- // 单选选择 multiple: false-->
							<template v-if="!multiple">
								<view class="select-btn" v-if="
                  !nodes || !nodeItem[children] || !nodeItem[children].length
                " @tap.stop="handleRadioSelect(nodeItem)">
									<i v-if="isRadioSelect(nodeItem)" class="txt iconfont icon-selected" />
									<i v-else style="color: #b8b8b8" class="txt iconfont icon-weixuanzhong1" />
								</view>
							</template>
							<!-- 多选选择  multiple： true-->
							<template v-if="multiple">
								<view class="select-btn" @tap.stop="handleMulSelect(nodeItem)">
									<i v-if="isMulSelect(nodeItem) == 1"
										class="iconfont icon-xuanzhong txt icon-selected" />
									<i v-else-if="isMulSelect(nodeItem) == 2"
										class="iconfont icon-banxuanzhongshousuo1-shi icons" />
									<i v-else style="color: #b8b8b8" class="txt iconfont icon-weixuanzhong" />
								</view>
							</template>
						</template>
						<text>{{ nodeItem[label] }}</text>
					</view>
					<view class="item-right" v-if="nodeItem[children] && nodeItem[children].length">
						<i class="iconfont icon-z043 iconclass" />
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="footer">
			<view class="footer-left">
				<view class="select">
					已选择：
					<text v-if="selectData.length" @tap="selectOpen">
						{{ selectData.length }}个
						<text class="select-row">^</text>
					</text>
				</view>
				<!-- <view class="more-select">最多选择{{number}}个</view> -->
			</view>
			<view class="footer-right" @tap="handleConfirm"> 完成 </view>
		</view>
		<hyq-tree-popup ref="popupRef" v-model:modelValue="selectData"></hyq-tree-popup>
	</view>
</template>

<script setup lang="ts">
	import {
		basicProps,
		basicPropsType
	} from './props'
	import {
		ref,
		computed,
		defineEmits,
		onMounted,
		nextTick,
		onUpdated
	} from 'vue'
	const emit = defineEmits(["handleConfirm"])
	const infinityHeight = 'calc(100vh -  140px)'
	let searchResult : any[] = []
	const tree = ref([])
	// 当前选中的数据
	const selectData = ref([])
	const screenHeight = ref(0)
	const startOffset = ref(0)
	//起始索引
	const start = ref(0)
	//结束索引
	const end = ref(0)
	// 预估高度
	const preItemSize = ref(44)
	// 缓存列表
	const positions = ref([
		// 列表项对象
		{
			index: 0, //下标
			top: 0, // 列表项顶部位置 
			bottom: 50, //列表项底部位置
			height: 50 //列表项高度
		}
	])
	// 每个缓存区只缓冲0.5  * 最大可见列表项的个数
	const bufferPercent = 0.5
	const topics = ref([])
	const props:basicPropsType = defineProps(basicProps)
	console.log('props', props);
	const popupRef = ref<InstanceType<typeof hyqTreePopup> | null>(null)
	const searchRef = ref<InstanceType<typeof hyqTreeSearch> | null>()
	// 列表高度
	const listHeight = computed(() => {
		return positions.value[positions.value.length - 1].bottom
	})
	// 偏移量对应的style
	const getTransform = computed(() => {
		return `translate3d(0, ${startOffset.value}px, 0)`
	})
	//获取真实显示列表数据
	const visibleData = computed(() => {
		// return this.tree.slice(this.start, Math.min(this.end, this.tree.length) + 1);
		return tree.value.slice(start.value - aboveCount.value, end.value + belowCount.value);
	})
	// 缓冲区的数量
	const bufferCount = computed(() => {
		return bufferPercent * visibleCount.value >> 0
	})
	// 上面的缓冲区
	const aboveCount = computed(() => {
		return Math.min(start.value, bufferCount.value)
	})
	// 下面的缓冲区
	const belowCount = computed(() => {
		return Math.min(tree.value.length - end.value, bufferCount.value)
	})
	// 可显示的列表项数
	const visibleCount = computed(() => {
		return Math.ceil(screenHeight.value / props.itemSize)
	})
	const isRadioSelect = computed(() => {
		return (item: any) => {
			let list = selectData.value;
			return (
				list && list.length > 0 && list[0][props.keyCode] == item[props.keyCode]
			);
		};
	})
	const isMulSelect = computed(() => {
		return (item: any) => {
			let list = selectData.value;
			// checked 全选 1  halfChecked 半选择 2  不选中 3
			return item.checked ? 1 : item.halfChecked ? 2 : 3;
		};
	})
	const isActive = computed(() => {
		return (index: any) => {
			return index < topics.value.length - 1;
		};
	})
	onMounted(() => {
		initialization()
	})
	onUpdated(() => {
		// #ifndef MP-WEIXIN
		nextTick(() => {
			// 根据真实元素大小，更新对应的缓存列表
			updatePositions(positions.value)
			// 更新完缓存列表后，重新赋值偏移量
			getCurrentOffset()
		})
		// #endif

		// #ifdef MP-WEIXIN
		wx.nextTick(() => {
			// 根据真实元素大小，更新对应的缓存列表
			updatePositions(positions.value)
			// 更新完缓存列表后，重新赋值偏移量
			getCurrentOffset()
		})
		// #endif
	})
	function updatePositions(positions) {
		const query = uni.createSelectorQuery().in(this)
		query.selectAll('.node-list-item').boundingClientRect()
		query.exec(function (res) {
			//res就是 所有标签为v1的元素的信息 的数组
			for (let i = 0; i < res[0].length; i++) {
				let node = res[0][i]
				let {
					height
				} = node
				let { index } = node.dataset
				let oldHeight = positions[index]
				let dValue = oldHeight - height
				if (dValue) {
					// 更新对应的列表项
					positions[index].height = height
					positions[index].bottom = positions[index].bottom - dValue
					// 依次更新之后的列表项
					for (let k = i + 1; k < positions.length; k++) {
						let pot = positions[k]
						pot.top = positions[k - 1].bottom
						pot.bottom = pot.bottom - dValue
					}
				}
			}
		})
	}
	function initialization() {
		// 空数组表示初始化 init()
		if (!props.feedBackList.length) {
			init();
		} else {
			let index = props.feedBackList.length - 1;
			// 存在上个页面选中的数据进行数据回显
			selectData.value = JSON.parse(JSON.stringify(props.feedBackList));
			reflexData(props.feedBackList[index][props.keyCode]);
		}
		positions.value = initPotions(tree.value)
		calcNode()
	}

	function calcNode() {
		let query = uni.createSelectorQuery().in(this);
		// #ifndef MP-WEIXIN
		// this.query.select('.search-tree').boundingClientRect(data => {
		// 	console.log('data', data);
		// 	const height = this.infinityHeight + data.height
		// 	this.infinityHeight = `calc(100vh - ${height + "px"})`
		// 	console.log('infinityHeight', this.infinityHeight);
		// }).exec()

		nextTick(() => {
			query.select('.infinite-list-container').boundingClientRect(data => {
				screenHeight.value = data.height
				start.value = 0;
				end.value = start.value + visibleCount.value
			}).exec()
		})
		// #endif

		// #ifdef MP-WEIXIN
		wx.nextTick(() => {
			query.select('.infinite-list-container').boundingClientRect(data => {
				screenHeight.value = data.height
				start.value = 0;
				end.value = start.value + visibleCount.value
			}).exec()
		})
		// #endif
	}

	function scrollEvent(e) {
		//当前滚动位置
		let scrollTop = e.detail.scrollTop;
		//此时的开始索引
		start.value = getStartIndex(scrollTop)
		//此时的结束索引
		end.value = start.value + visibleCount.value
		//此时的偏移量
		getCurrentOffset()
	}
	function getCurrentOffset() {
		if (start.value >= 1) {
			let size = positions.value[start.value].top - (
				positions.value[start.value - aboveCount.value] ?
					positions.value[start.value - aboveCount.value].top : 0);
			startOffset.value = positions.value[start.value - 1].bottom - size
		} else {
			startOffset.value = 0;
		}
	}
	function getStartIndex(scollTop = 0) {
		// let _ = this.positions.find(_ => _ && _.bottom > scollTop)
		// return _.index

		// 二分查找
		return binarySearch(positions.value, scollTop)
	}

	function binarySearch(positions, target) {
		let left = 0,
			right = positions.length - 1,
			targetIndex = 0
		while (left <= right) {
			let midIndex = (left + right) >> 1
			let midVal = positions[midIndex].bottom
			if (midVal == target) {
				return midIndex
			} else if (midVal < target) {
				left = midIndex + 1
				targetIndex = left
			} else {
				right = midIndex - 1
				targetIndex = right
			}
		}
		return targetIndex
	}
	function initPotions(listData) {
		let potions = listData.map((item, index) => {
			return {
				index,
				top: index * props.itemSize,
				bottom: (index + 1) * props.itemSize,
				height: props.itemSize
			}
		})
		start.value = 0
		return potions
	}

	function init() {
		topics.value = [{
			[props.label]: "全部",
			children: props.treeNode
		}];
		tree.value = props.treeNode;
	}

	function handleConfirm() {
		emit("handleConfirm", selectData.value);
	}
	// 回显数据
	function reflexData(key) {
		// 根据keyCode找到回显的数据
		// 初始化数据
		let _topics = [{
			[props.label]: "全部",
			children: props.treeNode
		}];
		let map = [];
		// 通过递归算法找到子节点
		dfs(props.treeNode, key, map);
		_topics.push(...map);
		// 扁平化树形结构
		// const flats = this.toFlatArray(treeNode, '0')
		// 获取所有关联父节点集合
		// const relativeNode = this.getRelativeNode(flats,key)
		// _topics.push(...relativeNode)
		topics.value = _topics;
		tree.value = _topics[_topics.length - 1][props.children];
		props.checkStrictly && handleTreeChecked();
	}
	// 递归遍历找到回显数据 sonNode子节点, key 回显数据的唯一标识，map找到的子节点所有关联父节点集合
	function dfs(sonNode, key, map) {
		for (var i = 0; i < sonNode.length; i++) {
			const chidNode = sonNode[i];
			if (key == chidNode[props.keyCode]) {
				// map.unshift(chidNode)
				console.log("chidNode", chidNode.name);
				return true;
			}
			if (chidNode[props.children] && chidNode[props.children].length) {
				const flag = dfs(chidNode[props.children], key, map);
				// 本次的父节点添加到map中
				if (flag) {
					map.unshift(chidNode);
					return true;
				}
			}
		}
	}
	// 处理当前节点和子节点的选中与半选择与不选中的状态
	function handleTreeChecked() {
		for (var i = 0; i < tree.value.length; i++) {
			const treeItem = tree.value[i];
			// 没有子节点就不需要去改变他的选中状态
			if (!treeItem[props.children] || !treeItem[props.children].length)
				continue;
			// 有子节点去计算出子节点的状态 treeNode子节点的数量  treeNodeSelect选中的子节点的数量
			const {
				treeNode = 0, treeNodeSelect = 0
			} = handleCalcNodeAccount(
				treeItem[props.children],
				0,
				0
			);
			// 初始状态0 =0不算  子节点的数量 == 选中的子节点的数量 => 全选状态
			if (treeNode != 0 && treeNodeSelect != 0) {
				// 全选
				if (treeNode == treeNodeSelect) {
					treeItem.checked = true;
					treeItem.halfChecked = false;
				}
				//半选
				else {
					treeItem.checked = false;
					treeItem.halfChecked = true;
				}
			} else {
				treeItem.checked = false;
				treeItem.halfChecked = false;
			}
		}
	}
	function handleCalcNodeAccount(children, treeNode, treeNodeSelect) {
		for (var i = 0; i < children.length; i++) {
			const child = children[i];
			if (child[props.children] && child[props.children].length) {
				const treeAccount = handleCalcNodeAccount(
					child[props.children],
					treeNode,
					treeNodeSelect
				);
				treeNode = treeAccount.treeNode;
				treeNodeSelect = treeAccount.treeNodeSelect;
			}
			treeNode++;
			// 判断节点是否存在于selectData已选择的数据中，如果存在表示选中，不存在表示不选中
			const findIndex = selectData.value.findIndex(
				(_) => _[props.keyCode] == child[props.keyCode]
			);
			findIndex != -1 && treeNodeSelect++;
		}
		return {
			treeNode,
			treeNodeSelect,
		};
	}
	function selectOpen() {
		console.log('popupRef', popupRef);
		popupRef.value?.open()
	}

	function handlePath() {
		if (props.hasPath) return [];
		const map = topics.value.map((_) => {
			const topic = Object.assign({}, _);
			delete topic[props.children];
			return topic;
		});
		return map.slice(1, map.length) || [];
	}
	// 点击tab
	function handleTopic(index, topic) {
		console.log(index, topic);
		if (index == 0) {
			searchRef.value.clear()
		}
		if (!isActive.value(index)) return;
		// 同时删除index后的数据
		topics.value.splice(index + 1, topics.value.length);
		tree.value = topic[props.children];
		props.checkStrictly && handleTreeChecked();
		positions.value = initPotions(tree.value)
	}
	// 点击单选按钮
	function handleRadioSelect(item) {
		console.log("单选", item);
		// 处理路径
		const path = handlePath();
		item.path = path;
		selectData.value = [item];
	}
	// 点击多选按钮
	function handleMulSelect(item) {
		// 选中状态有全选和半选择
		console.log("多选", item, item.checked);
		const index = selectData.value.findIndex(
			(_) => _[props.keyCode] == item[props.keyCode]
		);
		// 得到路径
		const path = handlePath(item[props.keyCode]);
		console.log("path", path);
		// 不关联子级
		if (!props.checkStrictly) {
			item.checked ?
				selectData.value.splice(index, 1) :
				selectData.value.push(item)
			item.checked = !item.checked
			item.halfChecked = false;
			// 保存路径
			item.path = path

			console.log('item', item, item.checked);
			return
		}

		// 关联子级/取消关联子级
		item.checked || item.halfChecked ? handleCancelRelativeNode(item) : selectData.value = selectData.value.concat(handleSelectRelativeNode(item, path))
		// 全选状态
		item.checked = item.checked || item.halfChecked ? false : true
		item.halfChecked = false
		// 添加路径
		item.path = path
	}
	// 关联子级
	function handleSelectRelativeNode(nodes, path) {
		// 已选中的状态不需要再加进来了 !nodes.checked && !nodes.halfChecked
		let map = [];
		if (!nodes.checked && !nodes.halfChecked) {
			map.push(nodes);
		}
		if (nodes[props.children] && nodes[props.children].length) {
			for (var i = 0; i < nodes[props.children].length; i++) {
				const node = nodes[props.children][i];
				const pathNode = {
					...nodes
				};
				// 删除pathNode中的children属性
				delete pathNode[props.children];
				const _newNode = [...path, pathNode];
				// 添加路径
				node.path = _newNode;
				if (node[props.children] && node[props.children].length) {
					map = map.concat(handleSelectRelativeNode(node, _newNode));
				} else {
					if (!nodes.checked && !nodes.halfChecked) {
						map.push(node);
					}
				}
				// 设置全选状态
				node.checked = true;
				node.halfChecked = false;
			}
		}
		return map;
	}
	// 取消关联子级
	function handleCancelRelativeNode(nodes) {
		// 删除selectData中的nodes数据
		if (nodes[props.children] && nodes[props.children].length) {
			for (var i = 0; i < nodes[props.children].length; i++) {
				const node = nodes[props.children][i];
				handleCancelRelativeNode(node);
				node.checked = false;
				node.halfChecked = false;
			}
		}
		const index = selectData.value.findIndex(
			(_) => _[props.keyCode] == nodes[props.keyCode]
		);
		index != -1 && selectData.value.splice(index, 1);
	}
	// 下一级
	function handleTreeNode(node, index) {
		// 没有子项不点击
		if (!node[props.children] || !node[props.children].length) return;
		// 处理上面的tab
		handleTopics(node);
		tree.value = node[props.children];
		positions.value = initPotions(tree.value)
		// 关联子级
		props.checkStrictly && handleTreeChecked();
	}
	// 处理上面的tab
	function handleTopics(node) {
		// tabs 列表下标赋值
		// 添加到tab列表中
		topics.value.push(node)
	}

	function confirmSearch(val) {
		searchResult = []
		search(props.treeNode, val)
		const copyTopics = topics.value.slice(0, 1)
		copyTopics.push({
			[props.label]: "搜索结果",
			children: searchResult
		})
		uni.showLoading({
			title: '正在查找'
		})
		topics.value = copyTopics
		setTimeout(() => {
			tree.value = searchResult
			positions.value = initPotions(tree.value)
			uni.hideLoading()
			emit('confirmSearch', [...searchResult])
		}, 300)
	}
	function search(data, keyword) {
		let {
			label,
			children
		} = props
		for (var i = 0, len = data.length; i < len; i++) {
			if (data[i][label].indexOf(keyword) >= 0) {
				searchResult.push(data[i])
			}
			if (data[i][children] && data[i][children].length) {
				search(data[i][children], keyword)
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "./css/style.scss";
	@import url("./css/icon.css");
</style>