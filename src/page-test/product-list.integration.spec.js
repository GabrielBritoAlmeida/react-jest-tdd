import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import ProductList from '../pages/index'
import { makeServer } from '../../miragejs/server'
import Response from 'miragejs'
import userEvent from '@testing-library/user-event'

const renderProductList = (server, quantity = 10) => {
  server.createList('product', quantity)
  return render(<ProductList />)
}

describe('ProductList', () => {
  let server

  beforeEach(() => {
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

  it('should filter the product list when a search is performed', async () => {
    const searchTerm = 'Relógio bonito'

    renderProductList(server, 2)

    server.create('product', {
      title: searchTerm
    })

    const form = screen.getByRole('form')
    const input = screen.getByRole('searchbox')

    userEvent.type(input, searchTerm)
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(1)
    })
  })

  it('should display the total quantity of products', async () => {
    renderProductList(server)

    await waitFor(() => {
      expect(screen.getByText(/10 products/i)).toBeInTheDocument()
    })
  })

  it('should display product (singular) when there is only 1 product', async () => {
    renderProductList(server, 1)

    await waitFor(() => {
      expect(screen.getByText(/1 product$/i)).toBeInTheDocument()
    })
  })
})
