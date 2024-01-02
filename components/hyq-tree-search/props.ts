import { isString } from "@/utils/types"

export const searchEmits = {
	"confirm": (val: string) => isString(val)
}

export type SearchEmits = typeof searchEmits