export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export interface UseSearchProps<T> {
  data: T[];
  accessorKey: StringKeys<T>[];
  searchTerm: string;
} 