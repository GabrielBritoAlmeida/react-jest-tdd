import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook } from '@testing-library/react-hooks'
import { useCartStore } from '../store/cart'
import CartItem from './cart-item'
import { setAutoFreeze } from 'immer'
import TestRenderer from 'react-test-renderer'

const { act: componentsAct } = TestRenderer

setAutoFreeze(false)

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
  let result

  beforeEach(() => {
    result = renderHook(() => useCartStore()).result
  })

  afterEach(() => {
    jest.clearAllMocks()
    act(() => result.current.actions.reset())
  })

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

  it('should call remove() when remove button is clicked', () => {
    const spy = jest.spyOn(result.current.actions, 'remove')

    renderCartItem()

    const buttonRemove = screen.getByRole('button', { name: /remove/i })

    userEvent.click(buttonRemove)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(product)
  })

  it('should call decrease() when decrease button is clicked', () => {
    const spy = jest.spyOn(result.current.actions, 'decrease')

    renderCartItem()

    const buttonDecrease = screen.getByTestId('button-decrease')

    userEvent.click(buttonDecrease)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(product)
  })

  it('should call increase() when increase button is clicked', () => {
    const spy = jest.spyOn(result.current.actions, 'increase')

    renderCartItem()

    const buttonIncrease = screen.getByTestId('button-increase')

    userEvent.click(buttonIncrease)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(product)
  })
})
