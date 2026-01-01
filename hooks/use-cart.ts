"use client"

import { create } from "zustand"
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  getCart,
  type Cart,
  type CartItem,
} from "@/lib/cart"

interface CartStore {
  cart: Cart
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clear: () => void
  initialize: () => void
}

export const useCart = create<CartStore>((set) => ({
  cart: { items: [], totalItems: 0, totalPrice: 0 },
  addItem: (item: CartItem) => {
    const updatedCart = addToCart(item)
    set({ cart: updatedCart })
  },
  removeItem: (productId: string) => {
    const updatedCart = removeFromCart(productId)
    set({ cart: updatedCart })
  },
  updateQuantity: (productId: string, quantity: number) => {
    const updatedCart = updateCartItemQuantity(productId, quantity)
    set({ cart: updatedCart })
  },
  clear: () => {
    const emptyCart = clearCart()
    set({ cart: emptyCart })
  },
  initialize: () => {
    const cart = getCart()
    set({ cart })
  },
}))
