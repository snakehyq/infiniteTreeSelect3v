const toString = Object.prototype.toString

export const isNumber = (val: any): val is number => typeof val === 'number'

export const isObject = (val: unknown): val is Record<string, unknown> => typeof val === 'object' && val !== null

export const isArray = (val: unknown): val is any[] => Array.isArray(val)


