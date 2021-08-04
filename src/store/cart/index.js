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
          const indexProduct = !!state.products.find(
            ({ id }) => id === product.id
          )
          if (!indexProduct) {
            if (!product.quantity) {
              product.quantity = 1
            }
            state.products.push(product)
            state.open = true
          }

          if (indexProduct) {
            if (!product.quantity) {
              product.quantity = 1
            } else {
              product.quantity++
            }
            state.open = true
          }
        })
      },

      increase(product) {
        setState(({ state }) => {
          const indexProduct = !!state.products.find(
            ({ id }) => id === product.id
          )

          if (indexProduct) {
            if (!product.quantity) {
              product.quantity = 1
            } else {
              product.quantity++
            }
            state.open = true
          }
        })
      },

      remove(product) {
        setState(({ state }) => {
          const exists = !!state.products.find(({ id }) => id === product.id)

          if (exists) {
            state.products = state.products.filter(
              ({ id }) => id !== product.id
            )
          }
        })
      },

      removeAll() {
        setState(({ state }) => {
          state.products = []
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
