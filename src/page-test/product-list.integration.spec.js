import { render, screen, waitFor } from '@testing-library/react'
import ProductList from '../pages/index'
import { makeServer } from '../../miragejs/server'
import Response from 'miragejs'

const renderProductList = (server, quantity = 10) => {
  server.createList('product', quantity)
  return render(<ProductList />)
}

describe('ProductList', () => {
  let server

  beforeAll(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should render the ProductCard component 10 times', async () => {
    renderProductList(server)

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(10)
    })
  })

  it('should render ProductList', () => {
    renderProductList(server)

    expect(screen.getByTestId('product-list')).toBeInTheDocument()
  })

  it('should render the no products message', async () => {
    renderProductList(server, 0)

    await waitFor(() => {
      expect(screen.getByTestId('no-product')).toBeInTheDocument()
      expect(screen.queryByTestId('product-card')).toBeNull()
    })
  })

  it('should render the Search component', async () => {
    server.get('products', () => new Response(500, {}, 'error'))

    renderProductList(server, 0)

    await waitFor(() => {
      expect(screen.getByTestId('server-error')).toBeInTheDocument()
      expect(screen.queryByTestId('no-product')).toBeNull()
      expect(screen.queryAllByTestId('product-card')).toHaveLength(0)
    })
  })
})
