import { renderHook, act } from '@testing-library/react-hooks'
import { useCartStore } from '.'

describe('Cart-Store', () => {
  it('should return open equals false on initial state', () => {
    const { result } = renderHook(() =>
      useCartStore((store) => store.state.open)
    )
    expect(result.current).toBe(false)
  })

  it('should return open equals true on open', async () => {
    const { result } = renderHook(() => useCartStore((store) => store))

    const toggle = result.current.actions.toggle

    expect(result.current.state.open).toBe(false)

    act(() => toggle())
    expect(result.current.state.open).toBe(true)
  })
})
