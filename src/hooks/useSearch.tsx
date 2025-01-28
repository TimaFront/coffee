import { useMemo } from "react";
import { UseSearchProps } from "../types/interfaces/search.interface";

const useSearch = <T extends Record<string, any>>({ 
  data,
  accessorKey,
  searchTerm
}: UseSearchProps<T>): { searchedData: T[] } => {
  console.log('useSearch input:', { data, accessorKey, searchTerm });

  const searchedData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) => {
      return accessorKey.some((key) => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });
    });
  }, [data, accessorKey, searchTerm]);

  console.log('useSearch output:', searchedData);

  return { searchedData };
};

export default useSearch;
