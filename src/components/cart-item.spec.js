import { fireEvent, render, screen } from '@testing-library/react'
import CartItem from './cart-item'

const product = {
  title: 'Relógio bonito',
  price: '50,00',
  image:
    'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'
}

const renderCartItem = () => {
  return render(<CartItem product={product} />)
}

describe('CartItem', () => {
  it('should render CartItem', () => {
    renderCartItem()

    expect(screen.getByTestId('cart-item')).toBeInTheDocument()
  })

  it('should display proper content', () => {
    renderCartItem()

    const componentImage = screen.getByTestId('image')

    expect(screen.getByText(new RegExp(product.title, 'i'))).toBeInTheDocument()
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument()
    expect(componentImage).toHaveProperty('src', product.image)
    expect(componentImage).toHaveProperty('alt', product.title)
  })

  it('should display 1 as initial quantity', () => {
    renderCartItem()

    const componentQuantity = screen.getByTestId('quantity')

    expect(componentQuantity.textContent).toBe('1')
  })

  it('should increase quantity by 1 when second button is clicked', () => {
    renderCartItem()

    const [_, buttonAdd] = screen.getAllByRole('button')

    fireEvent.click(buttonAdd)

    expect(screen.getByTestId('quantity').textContent).toBe('2')
  })

  it.todo('should decrease quantity by 1 when second button is clicked')

  it.todo('should not go below zero in the quantity')
})
