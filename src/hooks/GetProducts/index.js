import axios from 'axios'
import { useCallback } from 'react'

function GetProducts() {
  const getProducts = useCallback(async ({ setProducts, setError }) => {
    try {
      const response = await axios.get('/products')
      if (response.status === 200) {
        setProducts(response.data)
      }
    } catch (error) {
      setError(true)
      return null
    }
  }, [])

  return { getProducts }
}

export function useGetProducts() {
  return GetProducts()
}
