import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function useFetchData<T>(
  dataBaseName: string,
  filters: Record<string, string | number | boolean> = {},
  refreshKey: Number
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!dataBaseName) return
    
    const fetchData = async () => {
      let token = await AsyncStorage.getItem('token');
      setLoading(true)
      setError(null)

      try {
        // Constrói a query string com os filtros
        const queryParams = new URLSearchParams()
        for (const key in filters) {
          if (filters[key]!== undefined && filters[key]!== null) {
            queryParams.append(key, String(filters[key]))
}
}

        const url = `http://10.0.2.2:3000/api/v1/${dataBaseName}?${queryParams.toString()}`
        const res = await fetch(url, {
            headers: {
                 Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
            }
        })
        const json = await res.json()
        setData(json)
} catch (err: any) {
        console.error('Erro ao carregar dados:', err)
        setError(err.message || 'Erro desconhecido')
} finally {
        setLoading(false)
}
}

    fetchData()
}, [dataBaseName, JSON.stringify(filters), refreshKey])

  return { data, loading, error}
}