import { render, screen } from '@testing-library/react'
import ProductList from '../pages/index'

describe('ProductList', () => {
  it('should render ProductList', () => {
    render(<ProductList />)

    expect(screen.getByTestId('product-list')).toBeInTheDocument()
  })

  it.todo('should render the ProductCard component 10 times')

  it.todo('should render the no products message')

  it.todo('should render the Search component')
})
