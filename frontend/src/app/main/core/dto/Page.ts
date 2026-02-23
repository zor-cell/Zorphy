export interface Page<T> {
  content: T[];
  page: PageInfo;
}

interface PageInfo {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}