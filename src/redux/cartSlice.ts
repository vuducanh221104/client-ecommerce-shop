// cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  quantity: 0,
  products: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    incrementQuantity: (state) => {
      state.quantity += 1;
    },
    decreaseQuantity: (state) => {
      if (state.quantity > 0) {
        state.quantity -= 1;
      }
    },
    deleteQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = Math.max(state.quantity - action.payload, 0);
    },
    addProductToCart: (state, action: PayloadAction<any>) => {
      const product = action.payload;

      if (!state.products) {
        state.products = [];
      }

      const existingProduct = state.products.find((p) => p._id === product._id);
      const productPrice = product.price.discount || product.price.original;

      if (existingProduct) {
        existingProduct.quantityAddToCart += product.quantityAddToCart;
        existingProduct.productTotalPrice =
          existingProduct.quantityAddToCart * productPrice;
      } else {
        state.products.push({
          ...product,
          productTotalPrice: product.quantityAddToCart * productPrice,
        });
      }

      state.quantity += product.quantityAddToCart;
      state.totalPrice += productPrice * product.quantityAddToCart;
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((item) => item._id === id);
      if (product) {
        const productPrice = product.price.discount || product.price.original;
        const quantityDifference = quantity - product.quantityAddToCart;

        product.quantityAddToCart = quantity;
        product.productTotalPrice = quantity * productPrice;

        state.quantity += quantityDifference;
        state.totalPrice += quantityDifference * productPrice;
      }
    },
    updateTotalPrice: (state) => {
      state.totalPrice = state.products.reduce(
        (total, item) =>
          item.price.discount
            ? total + item.price.discount * item.quantityAddToCart
            : total + item.price.original * item.quantityAddToCart,
        0
      );
      state.quantity = state.products.reduce(
        (total, item) => total + item.quantityAddToCart,
        0
      );
    },
    removeProduct: (state, action: PayloadAction<{ id: string }>) => {
      const productId = action.payload.id;
      const productToRemove = state.products.find(
        (item) => item._id === productId
      );

      if (productToRemove) {
        state.totalPrice -= productToRemove.productTotalPrice;
        state.quantity -= productToRemove.quantityAddToCart;
        state.products = state.products.filter(
          (item) => item._id !== productId
        );
      }
    },
    clearCart: (state) => {
      state.quantity = 0;
      state.products = [];
      state.totalPrice = 0;
    },
  },
});

export const {
  incrementQuantity,
  decreaseQuantity,
  deleteQuantity,
  addProductToCart,
  updateQuantity,
  updateTotalPrice,
  removeProduct,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
