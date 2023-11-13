export const isNumber = (val: unknown): val is number => typeof val === 'number'

export const isObject = (val: unknown): val is Record<string, unknown> => typeof val === 'object' && val !== null