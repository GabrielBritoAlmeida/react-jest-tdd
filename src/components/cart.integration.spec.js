import { renderHook, act } from '@testing-library/react-hooks'
import { screen, render } from '@testing-library/react'
import { useCartStore } from '../store/cart'
import { makeServer } from '../../miragejs/server'
import Cart from './cart'

describe('Cart-Store', () => {
  let server
  let result
  let spy
  let add
  let toggle
  let reset

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
    result = renderHook(() => useCartStore()).result
    add = result.current.actions.add
    toggle = result.current.actions.toggle
    reset = result.current.actions.reset
    spy = jest.spyOn(result.current.actions, 'toggle')
  })

  afterEach(() => {
    server.shutdown()
    jest.clearAllMocks()
    act(() => result.current.actions.reset())
  })

  it('should return open equals false on initial state', () => {
    render(<Cart />)
    expect(screen.getByTestId('cart')).toBeInTheDocument()
  })
})
