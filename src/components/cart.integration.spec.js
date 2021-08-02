import { renderHook, act } from '@testing-library/react-hooks'
import { screen, render } from '@testing-library/react'
import { useCartStore } from '../store/cart'
import { makeServer } from '../../miragejs/server'
import { setAutoFreeze } from 'immer'
import userEvent from '@testing-library/user-event'
import Cart from './cart'

setAutoFreeze(false)

describe('Cart-Store', () => {
  let server
  let result
  let spyToggle
  let add
  let toggle

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
    result = renderHook(() => useCartStore()).result
    add = result.current.actions.add
    toggle = result.current.actions.toggle
    spyToggle = jest.spyOn(result.current.actions, 'toggle')
  })

  afterEach(() => {
    server.shutdown()
    jest.clearAllMocks()
  })

  it('should render component Cart', () => {
    render(<Cart />)
    expect(screen.getByTestId('cart')).toBeInTheDocument()
  })

  it('should add css class "hidden" in the component', () => {
    render(<Cart />)
    expect(screen.getByTestId('cart')).toHaveClass('hidden')
  })

  it('should not add css class "hidden" in the component', () => {
    render(<Cart />)

    act(() => {
      toggle()
    })

    expect(screen.getByTestId('cart')).not.toHaveClass('hidden')
  })

  it('should call store toggle twice', () => {
    render(<Cart />)

    const button = screen.getByTestId('button-close')

    act(() => {
      userEvent.click(button)
      userEvent.click(button)
    })

    expect(spyToggle).toHaveBeenCalledTimes(2)
  })

  it('should display 2 products cards', () => {
    const products = server.createList('product', 2)

    act(() => {
      for (const product of products) {
        add(product)
      }
    })

    render(<Cart />)

    const cardItem = screen.getAllByTestId('cart-item')
    expect(cardItem).toHaveLength(2)
  })
})
