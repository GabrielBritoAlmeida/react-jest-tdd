import { render, screen, waitFor } from '@testing-library/react'
import ProductList from '../pages/index'

describe('ProductList', () => {
  it('should render ProductList', () => {
    render(<ProductList />)

    expect(screen.getByTestId('product-list')).toBeInTheDocument()
  })

  fit('should render the ProductCard component 10 times', async () => {
    render(<ProductList />)

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(10)
    })
  })

  it.todo('should render the no products message')

  it.todo('should render the Search component')
})
