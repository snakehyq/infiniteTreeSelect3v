import { PropType } from 'vue'
interface ITreeNode {
	[propName: string]: any;
}
export const basicProps = {
	isCheck: {
		type: Boolean as PropType<boolean>,
		default: false
	},
	// 数据的唯一标识
	keyCode: {
		type: String as PropType<string>,
		default: "id",
	},
	treeNode: {
		type: Array as PropType<ITreeNode[]>,
		default: () => [],
	},
	number: {
		type: Number as PropType<number>,
		default: 1,
	},
	// 名字字段label
	label: {
		type: String as PropType<string>,
		default: "name",
	},
	// 子项字段
	children: {
		type: String as PropType<string>,
		default: "children",
	},
	// 是否多选模式
	multiple: Boolean as PropType<boolean>,
	// 单选模式true ,只选子项、false任意一项
	nodes: {
		type: Boolean as PropType<boolean>,
		default: true,
	},
	// 是否选中的数据包含路径
	hasPath: {
		type: Boolean as PropType<boolean>,
		default: false
	},
	// 是否关联下级
	checkStrictly: {
		type: Boolean as PropType<boolean>,
		default: false
	},
	// 回显的数据
	feedBackList: {
		type: Array as PropType<ITreeNode[]>,
		default: () => [],
	},
}