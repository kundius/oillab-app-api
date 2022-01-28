export interface StringFilter {
  eq?: string
  contains?: string
}

export interface IdFilter {
  eq?: number
  in?: [number]
}

export interface DateFilter {
  eq?: Date
  lt?: Date
  gt?: Date
}

export interface NumberFilter {
  eq?: number
  lt?: number
  gt?: number
}
