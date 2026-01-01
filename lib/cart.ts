export interface CartItem {
  productId: string
  title: string
  price: number
  quantity: number
  image: string
  color: string
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

const CART_STORAGE_KEY = "shopping-cart"

// Get cart from localStorage
export function getCart(): Cart {
  if (typeof window === "undefined") {
    return { items: [], totalItems: 0, totalPrice: 0 }
  }

  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY)
    if (cartData) {
      return JSON.parse(cartData)
    }
  } catch (error) {
    console.error("Error reading cart:", error)
  }

  return { items: [], totalItems: 0, totalPrice: 0 }
}

// Save cart to localStorage
export function saveCart(cart: Cart): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error("Error saving cart:", error)
  }
}

// Calculate cart totals
export function calculateCartTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return { totalItems, totalPrice }
}

// Add item to cart
export function addToCart(item: CartItem): Cart {
  const cart = getCart()
  const existingItemIndex = cart.items.findIndex((i) => i.productId === item.productId)

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += item.quantity
  } else {
    cart.items.push(item)
  }

  const totals = calculateCartTotals(cart.items)
  cart.totalItems = totals.totalItems
  cart.totalPrice = totals.totalPrice

  saveCart(cart)
  return cart
}

// Remove item from cart
export function removeFromCart(productId: string): Cart {
  const cart = getCart()
  cart.items = cart.items.filter((item) => item.productId !== productId)

  const totals = calculateCartTotals(cart.items)
  cart.totalItems = totals.totalItems
  cart.totalPrice = totals.totalPrice

  saveCart(cart)
  return cart
}

// Update item quantity
export function updateCartItemQuantity(productId: string, quantity: number): Cart {
  const cart = getCart()
  const itemIndex = cart.items.findIndex((item) => item.productId === productId)

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }
  }

  const totals = calculateCartTotals(cart.items)
  cart.totalItems = totals.totalItems
  cart.totalPrice = totals.totalPrice

  saveCart(cart)
  return cart
}

// Clear cart
export function clearCart(): Cart {
  const emptyCart: Cart = { items: [], totalItems: 0, totalPrice: 0 }
  saveCart(emptyCart)
  return emptyCart
}
