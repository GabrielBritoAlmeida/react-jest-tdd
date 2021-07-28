import { useEffect, useState } from 'react'
import ProductCard from '../components/product-card'
import Search from '../components/search'
import { useGetProducts } from '../hooks/useGetProducts'

export default function Home() {
  const { products, error } = useGetProducts()
  const [term, setTerm] = useState('')
  const [localProducts, setLocalProducts] = useState([])

  useEffect(() => {
    if (term === '') {
      setLocalProducts(products)
    } else {
      setLocalProducts(
        products.filter(({ title }) =>
          title.toLowerCase().includes(term.toLowerCase())
        )
      )
    }
  }, [products, term])

  const renderListProducts = () => {
    if (products.length === 0 && !error) {
      return <p data-testid="no-product">No products</p>
    }

    return localProducts.map((product) => (
      <ProductCard product={product} key={product?.id} />
    ))
  }

  const renderErrorMessage = () => {
    if (!error) {
      return null
    }

    return <h4 data-testid="server-error">Server is down</h4>
  }

  return (
    <main data-testid="product-list" className="my-8">
      <Search doSearch={setTerm} />
      <div className="container mx-auto px-6">
        <h3 className="text-gray-700 text-2xl font-medium">Wrist Watch</h3>
        <span className="mt-3 text-sm text-gray-500">200+ Products</span>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {renderErrorMessage()}

          {renderListProducts()}
        </div>
      </div>
    </main>
  )
}
