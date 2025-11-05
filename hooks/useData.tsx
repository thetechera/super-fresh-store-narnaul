
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { AppData, DataKey, DataModel } from '../types';

interface DataContextType {
  data: AppData;
  loading: boolean;
  isInitialLoad: boolean;
  isMutating: boolean;
  error: string | null;
  fetchData: () => void;
  addItem: <T extends DataModel>(dataKey: DataKey, item: Omit<T, 'id'>) => Promise<void>;
  updateItem: <T extends DataModel>(dataKey: DataKey, item: T) => Promise<void>;
  deleteItem: (dataKey: DataKey, id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_BASE_URL = '/api';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>({ products: [], sales: [], purchases: [], inventory: [] });
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Only set loading to true for the initial fetch, not for refetches
    if (isInitialLoad) {
      setLoading(true);
    }
    setError(null);
    try {
      const responses = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/sales`),
        fetch(`${API_BASE_URL}/purchases`),
        fetch(`${API_BASE_URL}/inventory`),
      ]);

      const failedResponse = responses.find(res => !res.ok);
      if (failedResponse) {
        let errorMessage = `A server error occurred (status: ${failedResponse.status})`;
        try {
          const errorJson = await failedResponse.json();
          if (errorJson.error) {
            errorMessage = errorJson.error;
          }
        } catch (e) {
          // Ignore if JSON parsing fails
        }
        throw new Error(errorMessage);
      }

      const [products, sales, purchases, inventory] = await Promise.all(responses.map(res => res.json()));
      setData({ products, sales, purchases, inventory });
    } catch (e) {
      setError((e as Error).message);
      console.error("Fetch error:", e);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, [isInitialLoad]); // Dependency on isInitialLoad to correctly handle loading state

  useEffect(() => {
    fetchData().finally(() => {
      setIsInitialLoad(false);
    });
  }, [fetchData]);

  const apiOperation = useCallback(async (url: string, options: RequestInit, operationName: string, successMessage: string) => {
    setIsMutating(true);
    setError(null);
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${operationName}`);
      }
      await fetchData(); // Refetch all data to ensure consistency
      alert(successMessage); // Provide success feedback to the user
    } catch (e) {
      setError((e as Error).message);
      console.error(`Failed to ${operationName}:`, e);
      throw e;
    } finally {
      setIsMutating(false);
    }
  }, [fetchData]);

  const addItem = useCallback(async <T extends DataModel>(dataKey: DataKey, item: Omit<T, 'id'>) => {
    await apiOperation(`${API_BASE_URL}/${dataKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    }, 'add item', `Successfully added new ${dataKey.slice(0, -1)}.`);
  }, [apiOperation]);

  const updateItem = useCallback(async <T extends DataModel>(dataKey: DataKey, item: T) => {
    await apiOperation(`${API_BASE_URL}/${dataKey}/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    }, 'update item', `Successfully updated ${dataKey.slice(0, -1)}.`);
  }, [apiOperation]);

  const deleteItem = useCallback(async (dataKey: DataKey, id: string) => {
    await apiOperation(`${API_BASE_URL}/${dataKey}/${id}`, {
      method: 'DELETE',
    }, 'delete item', `Successfully deleted ${dataKey.slice(0, -1)}.`);
  }, [apiOperation]);

  const value = useMemo(() => ({ data, loading, isInitialLoad, isMutating, error, fetchData, addItem, updateItem, deleteItem }), [data, loading, isInitialLoad, isMutating, error, fetchData, addItem, updateItem, deleteItem]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
