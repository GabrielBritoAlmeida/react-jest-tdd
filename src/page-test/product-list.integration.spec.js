import { render, screen, waitFor } from '@testing-library/react'
import ProductList from '../pages/index'
import { makeServer } from '../../miragejs/server'

const renderProductList = (server) => {
  server.createList('product', 10)
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

  it.todo('should render the no products message')

  it.todo('should render the Search component')
})
