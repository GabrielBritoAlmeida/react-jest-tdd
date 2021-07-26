import { useGetProducts } from '.'
import { makeServer } from '../../../miragejs/server'
import { renderHook } from '@testing-library/react-hooks'
import Response from 'miragejs'

describe('useGetProducts', () => {
  let server

  beforeAll(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should return list of 10 products', async () => {
    server.createList('product', 10)

    const { result, waitForNextUpdate } = renderHook(() => useGetProducts())

    await waitForNextUpdate()

    expect(result.current.products).toHaveLength(10)
    expect(result.current.error).toBe(false)
  })

  it('should set error to true when catch() block is executed', async () => {
    server.get('products', () => {
      return new Response(500, {}, '')
    })

    const { result, waitForNextUpdate } = renderHook(() => useGetProducts())

    await waitForNextUpdate()

    expect(result.current.error).toBe(true)
    expect(result.current.products).toHaveLength(0)
  })
})
