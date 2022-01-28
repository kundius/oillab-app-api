export interface PageInfo {
  total: number
  page: number
  perPage: number
}

export interface PaginatedResult<T> {
  pageInfo: PageInfo
  items: T[]
}
