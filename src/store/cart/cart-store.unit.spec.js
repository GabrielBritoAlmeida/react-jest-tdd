import { renderHook, act } from '@testing-library/react-hooks'
import { useCartStore } from '.'
import { makeServer } from '../../../miragejs/server'

describe('Cart-Store', () => {
  let server
  let result
  let add
  let toggle
  let remove
  let removeAll
  let increase
  let decrease

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
    result = renderHook(() => useCartStore()).result
    add = result.current.actions.add
    toggle = result.current.actions.toggle
    remove = result.current.actions.remove
    removeAll = result.current.actions.removeAll
    increase = result.current.actions.increase
    decrease = result.current.actions.decrease
  })

  afterEach(() => {
    server.shutdown()
    jest.clearAllMocks()
    act(() => result.current.actions.reset())
  })

  it('should return open equals false on initial state', () => {
    expect(result.current.state.open).toBe(false)
  })

  it('should return open equals true on open', () => {
    expect(result.current.state.open).toBe(false)
    expect(result.current.state.products).toHaveLength(0)

    act(() => toggle())
    expect(result.current.state.open).toBe(true)
    expect(result.current.state.products).toHaveLength(0)
  })

  it('should return an empty array for products on initial state', () => {
    expect(result.current.state.products).toEqual([])
    expect(result.current.state.products).toHaveLength(0)
  })

  it('should return two products in cart and open the cart', async () => {
    const products = server.createList('product', 2)

    for (const product of products) {
      act(() => add(product))
    }

    expect(result.current.state.products).toHaveLength(2)
    expect(result.current.state.open).toBe(true)
  })

  it('should not add same product twice', () => {
    const product = server.create('product')

    act(() => add(product))
    act(() => add(product))

    expect(result.current.state.products).toHaveLength(1)
  })

  it('should remove a product from the store ', () => {
    const [product1, product2] = server.createList('product', 2)

    act(() => {
      add(product1)
      add(product2)
    })

    expect(result.current.state.products).toHaveLength(2)

    act(() => remove(product1))

    expect(result.current.state.products).toHaveLength(1)
    expect(result.current.state.products[0]).toEqual(product2)
  })

  it('should clear cart ', () => {
    const [product1, product2] = server.createList('product', 2)

    act(() => {
      add(product1)
      add(product2)
    })

    expect(result.current.state.products).toHaveLength(2)

    act(() => removeAll())

    expect(result.current.state.products).toHaveLength(0)
  })

  it('should assign 1 as initial quantity on product add()', () => {
    const [product1] = server.createList('product', 2)

    act(() => {
      add(product1)
    })

    expect(product1.quantity).toBe(1)

    expect(result.current.state.products).toHaveLength(1)
  })

  it('should increase quantity', () => {
    const product = server.create('product')

    act(() => {
      add(product)
      increase(product)
    })

    expect(product.quantity).toBe(2)

    expect(result.current.state.products).toHaveLength(1)
  })

  it('should decrease quantity', () => {
    const product = server.create('product')

    act(() => {
      add(product)
      increase(product)
      increase(product)
      decrease(product)
    })

    expect(product.quantity).toBe(2)

    expect(result.current.state.products).toHaveLength(1)
  })

  it('should decrease with quantity one to cart', () => {
    const product = server.create('product')

    act(() => {
      add(product)
      decrease(product)
    })

    expect(product.quantity).toBe(0)

    expect(result.current.state.products).toHaveLength(0)
  })
})
