import { PropType } from 'vue'
import { UPDATE_MODEL_EVENT } from '@/constants/event'
import { isArray } from '@/utils/types'

interface ITreeNode {
	[propName: string]: any;
}

export const basicProps = {
	// 回显的数据
	modelValue: {
		type: Array as PropType<ITreeNode[]>,
		default: () => [],
	},
}

export const popupEmits = {
	[UPDATE_MODEL_EVENT]: (val: any[]) => isArray(val)
}

export type PopupEmits = typeof popupEmits