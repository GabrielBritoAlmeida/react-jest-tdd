import { api } from '../../services/api'
import { useCallback, useEffect, useState } from 'react'

export function useGetProducts() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(false)

  const getProducts = useCallback(async () => {
    try {
      const response = await api.get('/products')

      /* istanbul ignore next */
      if (response.status === 200) {
        setProducts(response.data.products)
      }
    } catch (error) {
      setError(true)
      return null
    }
  }, [])

  useEffect(() => {
    getProducts()

    return () => setProducts([])
  }, [getProducts])

  return { products, error }
}
