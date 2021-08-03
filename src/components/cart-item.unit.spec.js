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

    const buttonAdd = screen.getByTestId('button-increase')
    const quantity = screen.getByTestId('quantity')

    fireEvent.click(buttonAdd)
    expect(quantity.textContent).toBe('2')
  })

  it('should decrease quantity by 1 when second button is clicked', () => {
    renderCartItem()

    const buttonAdd = screen.getByTestId('button-increase')
    const buttonSub = screen.getByTestId('button-decrease')
    const quantity = screen.getByTestId('quantity')

    fireEvent.click(buttonAdd)
    expect(quantity.textContent).toBe('2')

    fireEvent.click(buttonSub)
    expect(quantity.textContent).toBe('1')
  })

  it('should not go below zero in the quantity', () => {
    renderCartItem()

    const buttonSub = screen.getByTestId('button-decrease')
    const quantity = screen.getByTestId('quantity')

    fireEvent.click(buttonSub)
    fireEvent.click(buttonSub)
    expect(quantity.textContent).toBe('0')
  })
})
