import { readonly, ref, onUnmounted } from 'vue'
/**
 * frame： 记录当前的帧数
 *	checkIsRender： 拿列表每一项的索引去跟当前帧数比较，到达了指定索引帧数才渲染这一项
 */
export const useDefer = (max: number, count: number = 1) => {
	const frame = ref(0)
	// 记录raf的id
	let rafId: number | null = null
	const updateFrame = () => {
		rafId = requestAnimationFrame(() => {
			// 每一帧去递增
			frame.value = frame.value + count
			console.log(frame.value);
			// 渲染完就不继续计算了
			if(frame.value >= max) return
			updateFrame()
		})
	}
	updateFrame()
	const checkIsRender = (index) => {
		// 判断是否需要渲染
		return frame.value >= index
	}
	onUnmounted(() => {
		// 组件销毁时取消
		if(rafId) {
			cancelAnimationFrame(rafId)
		}
	})
	return {
		frame: readonly(frame),
		checkIsRender
	}
}