import { renderHook, act as hooksAct } from '@testing-library/react-hooks'
import { screen, render } from '@testing-library/react'
import { useCartStore } from '../store/cart'
import { makeServer } from '../../miragejs/server'
import { setAutoFreeze } from 'immer'
import userEvent from '@testing-library/user-event'
import Cart from './cart'
import TestRenderer from 'react-test-renderer'

const { act: componentsAct } = TestRenderer

setAutoFreeze(false)

describe('Cart-Store', () => {
  let server
  let result
  let spyToggle
  let spyRemoveAll
  let add

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
    result = renderHook(() => useCartStore()).result
    add = result.current.actions.add
    spyToggle = jest.spyOn(result.current.actions, 'toggle')
    spyRemoveAll = jest.spyOn(result.current.actions, 'removeAll')
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

  it('should not add css class "hidden" in the component', async () => {
    await componentsAct(async () => {
      render(<Cart />)

      const buttonClose = screen.getByTestId('button-close')

      await userEvent.click(buttonClose)

      expect(screen.getByTestId('cart')).not.toHaveClass('hidden')
    })
  })

  it('should call store toggle twice', async () => {
    await componentsAct(async () => {
      render(<Cart />)

      const button = screen.getByTestId('button-close')

      await userEvent.click(button)
      await userEvent.click(button)

      expect(spyToggle).toHaveBeenCalledTimes(2)
    })
  })

  it('should display 2 products cards', () => {
    const products = server.createList('product', 2)

    hooksAct(() => {
      for (const product of products) {
        add(product)
      }
    })

    render(<Cart />)

    const cardItem = screen.getAllByTestId('cart-item')
    expect(cardItem).toHaveLength(2)
  })

  it('should call removeAll() when remove button is clicked', async () => {
    const products = server.createList('product', 2)

    hooksAct(() => {
      for (const product of products) {
        add(product)
      }
    })

    await componentsAct(async () => {
      render(<Cart />)

      expect(screen.getAllByTestId('cart-item')).toHaveLength(2)

      const buttonRemoveAll = screen.getByRole('button', {
        name: /clear cart/i
      })

      userEvent.click(buttonRemoveAll)

      expect(spyRemoveAll).toHaveBeenCalledTimes(1)
      expect(screen.queryAllByTestId('cart-item')).toHaveLength(0)
    })
  })

  it('should not display clear cart button if no products are in the cart', () => {
    render(<Cart />)

    expect(
      screen.queryByRole('button', { name: /clear cart/i })
    ).not.toBeInTheDocument()
  })
})
