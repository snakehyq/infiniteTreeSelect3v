
const toString = Object.prototype.toString

export const is = <T = unknown>(val: T, str: string) => {
  return toString.call(val) === `[object ${str}]`
}

export const isNumber = (val: unknown): val is number => is(val, 'String')

export const isBoolean = (val: unknown): val is boolean => is(val, 'Boolean')

export const isString = (val: unknown): val is string => is(val, 'String')

export const isDef = (val: unknown): val is undefined => !isUndef

export const isUndef = (val: unknown): val is undefined => is(val, 'Undefined')

export const isEmpty = <T = unknown>(val: T): val is T => {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }
  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }
  if (isObject(val)) {
    return Object.keys(val).length === 0
  }
  return false
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (val: unknown): val is Function => is(val, 'Function')

export const RegExp = (val: unknown): val is RegExp => is(val, 'RegExp')

export const isMap = (val: unknown): val is Map<unknown, unknown> => is(val, 'Map')

export const isDate = (val: unknown): val is Date => is(val, 'Date')

export const isArray = (val: unknown): val is Array<unknown> => Array.isArray(val)

export const isNull = (val: unknown): val is null => is(val, 'Null')

export const isPromise = <T = unknown>(val: unknown): val is Promise<T> => {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export const isNullAndUnDef = (val: unknown): val is null | undefined => {
  return isNull(val) && isUndef(val)
}

export const isNUllOrUnDef = (val: unknown): val is null | undefined => {
  return isNull(val) || isUndef(val)
}

export const isObject = (val: unknown): val is Record<string, unknown> => is(val, 'Object') && val !== null

export const isWindow = (val: unknown): val is Window => {
  return typeof window !== 'undefined' && is(val, 'Window')
}

export const isElement = (val: unknown): val is Element => {
  return isObject(val) && !!val.tagName
}

export const isServe = typeof window === 'undefined'

export const isClient = !isServe

export const isUrl = (path: string) => {
  // eslint-disable-next-line no-useless-escape
  const reg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
  return reg.test(path)
}

export const hasClass = (element: HTMLDivElement, className: string) => {
  if (element.classList) {
    return element.classList.contains(className)
  }
  return new (RegExp as any)(`(^|)${className}(|$)`, 'gi').test(element.className)
}
