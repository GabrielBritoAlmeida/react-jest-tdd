import create from 'zustand'
import produce from 'immer'

const initialState = {
  open: false,
  products: []
}

export const useCartStore = create((set) => {
  const setState = (fn) => set(produce(fn))

  return {
    state: {
      ...initialState
    },
    actions: {
      toggle() {
        setState(({ state }) => {
          state.open = !state.open
        })
      },

      add(product) {
        setState(({ state }) => {
          if (!state.products.includes(product)) {
            state.products.push(product)
            state.open = true
          }
        })
      },

      removeAll() {
        setState(({ state }) => {
          state.products = []
        })
      },

      remove(product) {
        setState(({ state }) => {
          const exists = state.products.includes(product)

          if (exists) {
            state.products = state.products.filter(
              (currentProduct) => currentProduct !== product
            )
          }
        })
      },

      reset() {
        setState((store) => {
          store.state = initialState
        })
      }
    }
  }
})
